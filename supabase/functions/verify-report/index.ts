import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS (production + development)
const allowedOrigins = new Set([
  'https://gigproof.online',
  'https://www.gigproof.online',
  'http://localhost:5173', // Local development
  'http://localhost:8888', // Netlify dev
]);

function getCorsHeaders(origin: string | null) {
  const requestOrigin = origin ?? '';
  return {
    'Access-Control-Allow-Origin': allowedOrigins.has(requestOrigin)
      ? requestOrigin
      : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    'Vary': 'Origin',
  };
}

// Rate limiting configuration
const RATE_LIMITS = {
  MAX_ATTEMPTS_PER_HOUR: 10,
  MAX_ATTEMPTS_PER_DAY: 50,
  LOCKOUT_THRESHOLD: 5,
  LOCKOUT_DURATION: 3600000, // 1 hour in ms
};

// Check if IP is locked out
async function checkLockout(supabase: any, ip: string) {
  const { data } = await supabase
    .from('verification_lockouts')
    .select('locked_until, failure_count')
    .eq('ip_address', ip)
    .maybeSingle();

  if (data && new Date(data.locked_until) > new Date()) {
    const minutesRemaining = Math.ceil(
      (new Date(data.locked_until).getTime() - Date.now()) / 60000
    );
    throw new Error(
      `Too many failed attempts. Please try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`
    );
  }

  return data?.failure_count || 0;
}

// Check rate limit (attempts per hour)
async function checkRateLimit(supabase: any, ip: string) {
  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  // Check hourly limit
  const { count: hourlyCount } = await supabase
    .from('verification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', hourAgo);

  if (hourlyCount && hourlyCount >= RATE_LIMITS.MAX_ATTEMPTS_PER_HOUR) {
    throw new Error('Rate limit exceeded. Maximum 10 verification attempts per hour.');
  }

  // Check daily limit
  const { count: dailyCount } = await supabase
    .from('verification_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', dayAgo);

  if (dailyCount && dailyCount >= RATE_LIMITS.MAX_ATTEMPTS_PER_DAY) {
    throw new Error('Rate limit exceeded. Maximum 50 verification attempts per day.');
  }
}

// Record failed verification and update lockout
async function recordFailure(supabase: any, ip: string, currentFailureCount: number) {
  const newCount = currentFailureCount + 1;

  if (newCount >= RATE_LIMITS.LOCKOUT_THRESHOLD) {
    // Lock out for 1 hour
    await supabase
      .from('verification_lockouts')
      .upsert({
        ip_address: ip,
        locked_until: new Date(Date.now() + RATE_LIMITS.LOCKOUT_DURATION).toISOString(),
        failure_count: newCount,
        updated_at: new Date().toISOString(),
      });
  } else {
    // Increment failure count
    await supabase
      .from('verification_lockouts')
      .upsert({
        ip_address: ip,
        locked_until: new Date(Date.now() + RATE_LIMITS.LOCKOUT_DURATION).toISOString(),
        failure_count: newCount,
        updated_at: new Date().toISOString(),
      });
  }
}

// Reset failure count on successful verification
async function resetFailureCount(supabase: any, ip: string) {
  await supabase
    .from('verification_lockouts')
    .delete()
    .eq('ip_address', ip);
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code, pdfHash } = await req.json();

    // Get client IP address (x-forwarded-for can be a comma-separated list, take first)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor
      ? forwardedFor.split(',')[0].trim()
      : (req.headers.get('x-real-ip') || 'unknown');

    if (!code && !pdfHash) {
      return new Response(
        JSON.stringify({ found: false, status: 'bad_request', message: 'Verification code or PDF hash required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key for database access
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // RATE LIMITING: Check if IP is locked out
    const currentFailureCount = await checkLockout(supabaseClient, ip);

    // RATE LIMITING: Check hourly and daily limits
    await checkRateLimit(supabaseClient, ip);

    // Look up report by verification code OR PDF hash
    // Return all income data so lender can compare against the PDF they received
    let query = supabaseClient
      .from('reports')
      .select('verification_code, created_at, expires_at, period_start, period_end, verification_count, pdf_hash, total_90_days, monthly_average, weekly_average, consistency_score, platform_breakdown, iso_currency_code');

    if (code) {
      query = query.eq('verification_code', code.toUpperCase());
    } else if (pdfHash) {
      query = query.eq('pdf_hash', pdfHash);
    }

    const { data: report, error } = await query.maybeSingle();

    if (error || !report) {
      // Log failed verification
      await supabaseClient.from('verification_logs').insert({
        verification_code: code || 'PDF_HASH',
        success: false,
        ip_address: ip,
      });

      // RATE LIMITING: Record failure and potentially lock out
      await recordFailure(supabaseClient, ip, currentFailureCount);

      return new Response(
        JSON.stringify({
          found: false,
          status: 'not_found',
          message: 'Invalid verification code.'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if expired
    const isExpired = new Date(report.expires_at) < new Date();
    const status = isExpired ? 'expired' : 'valid';

    // Log successful verification attempt
    await supabaseClient.from('verification_logs').insert({
      verification_code: report.verification_code || 'PDF_HASH',
      success: true,
      ip_address: ip,
    });

    // RATE LIMITING: Reset failure count on successful verification
    await resetFailureCount(supabaseClient, ip);

    // Update verification count
    await supabaseClient
      .from('reports')
      .update({
        verification_count: (report.verification_count || 0) + 1,
        last_verified_at: new Date().toISOString()
      })
      .eq('verification_code', report.verification_code);

    // Return verification result with SERVER-STORED income data
    // Lender will compare these official figures against the PDF they received
    return new Response(
      JSON.stringify({
        found: true,
        status: status, // "valid" or "expired"
        verificationCode: report.verification_code,
        generatedDate: report.created_at,
        expiresDate: report.expires_at,
        verificationPeriod: {
          start: report.period_start,
          end: report.period_end
        },
        // THE AUTHORITATIVE INCOME DATA (from GigProof database)
        incomeData: {
          total_90_days: Number(report.total_90_days || 0),
          monthly_average: Number(report.monthly_average || 0),
          weekly_average: Number(report.weekly_average || 0),
          consistency_score: report.consistency_score || 0,
          platform_breakdown: report.platform_breakdown || [],
          iso_currency_code: report.iso_currency_code || 'USD',
        },
        verificationCount: (report.verification_count || 0) + 1,
        verificationType: pdfHash ? 'pdf_upload' : 'code_entry',
        message: isExpired
          ? 'This report has expired. Contact the applicant for an updated report.'
          : 'These are the official figures GigProof calculated from linked bank transactions. If the PDF you received shows different numbers, it has been altered or is not the same report.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Verification error:', error);

    // Return rate limit errors with appropriate status codes
    if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
      return new Response(
        JSON.stringify({ found: false, status: 'rate_limited', message: error.message }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (error instanceof Error && error.message.includes('Too many failed attempts')) {
      return new Response(
        JSON.stringify({ found: false, status: 'rate_limited', message: error.message }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ found: false, status: 'error', message: 'Verification failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
