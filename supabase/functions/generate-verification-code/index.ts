import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Generates a cryptographically secure verification code
 * Format: GIG-XXXXXXXX (8 random hex characters)
 */
function generateVerificationCode(): string {
  const randomBytes = new Uint8Array(4);
  crypto.getRandomValues(randomBytes);
  const random = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `GIG-${random}`;
}

/**
 * Generates a tamper-evident HMAC hash for the report
 * Uses SHA-256 with a secret key stored in Supabase secrets
 */
async function generateVerificationHash(data: {
  verificationCode: string;
  userId: string;
  totalIncome: number;
  monthlyAverage: number;
  generatedAt: string;
}): Promise<string> {
  const secret = Deno.env.get('VERIFICATION_SECRET');
  if (!secret) {
    throw new Error('VERIFICATION_SECRET not configured');
  }

  const dataString = JSON.stringify({
    code: data.verificationCode,
    userId: data.userId,
    total: data.totalIncome,
    monthly: data.monthlyAverage,
    date: data.generatedAt
  });

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(dataString);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { reportData } = await req.json();

    // Generate verification code (cryptographically secure)
    const verificationCode = generateVerificationCode();

    // Generate tamper-evident hash
    const verificationHash = await generateVerificationHash({
      verificationCode,
      userId: user.id,
      totalIncome: reportData.totalIncome,
      monthlyAverage: reportData.monthlyAverage,
      generatedAt: new Date().toISOString()
    });

    // Calculate expiration (90 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    return new Response(
      JSON.stringify({
        verificationCode,
        verificationHash,
        expiresAt: expiresAt.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating verification code:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate verification code' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
