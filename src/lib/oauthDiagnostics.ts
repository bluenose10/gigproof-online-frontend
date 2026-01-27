/**
 * OAuth Diagnostics Utility
 * 
 * This utility helps diagnose Google OAuth configuration issues
 * when the Supabase dashboard is unavailable.
 */

export interface OAuthDiagnosticResult {
  success: boolean;
  message: string;
  details?: {
    errorCode?: string;
    errorMessage?: string;
    suggestions?: string[];
  };
}

/**
 * Analyze OAuth error and provide diagnostic information
 * This function doesn't actually initiate OAuth (which would redirect),
 * but analyzes error messages to provide helpful diagnostics
 */
export function diagnoseOAuthError(errorMessage: string): OAuthDiagnosticResult {
  const message = errorMessage.toLowerCase();
  
  if (message.includes("provider is not enabled") || 
      message.includes("unsupported provider")) {
    return {
      success: false,
      message: "Google OAuth is not enabled in Supabase",
      details: {
        errorCode: "PROVIDER_NOT_ENABLED",
        errorMessage: errorMessage,
        suggestions: [
          "Go to Supabase Dashboard > Authentication > Providers",
          "Enable the Google provider",
          "Add your Google OAuth Client ID and Client Secret",
          "If dashboard is broken, try: https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa/auth/providers",
          "Clear browser cache and try again",
          "See GOOGLE_OAUTH_SETUP.md for detailed instructions",
          "Contact Supabase support if dashboard remains broken"
        ]
      }
    };
  }

  if (message.includes("redirect") || message.includes("uri")) {
    return {
      success: false,
      message: "Google OAuth redirect URI mismatch",
      details: {
        errorCode: "REDIRECT_URI_MISMATCH",
        errorMessage: errorMessage,
        suggestions: [
          "Verify redirect URI in Google Cloud Console matches:",
          "https://eiuwenohohvmtbjcclpa.supabase.co/auth/v1/callback",
          "Check Supabase project settings",
          "See GOOGLE_OAUTH_SETUP.md for setup instructions"
        ]
      }
    };
  }

  return {
    success: false,
    message: "Google OAuth configuration issue",
    details: {
      errorCode: "OAUTH_ERROR",
      errorMessage: errorMessage,
      suggestions: [
        "Check your Supabase project configuration",
        "Verify Google OAuth credentials are correct",
        "Check Supabase status: https://status.supabase.com/",
        "See GOOGLE_OAUTH_SETUP.md for troubleshooting"
      ]
    }
  };
}

/**
 * Get troubleshooting steps based on error type
 */
export function getTroubleshootingSteps(errorMessage: string): string[] {
  const message = errorMessage.toLowerCase();
  const steps: string[] = [];

  if (message.includes("provider is not enabled")) {
    steps.push(
      "1. Navigate to Supabase Dashboard: https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa",
      "2. Go to Authentication > Providers",
      "3. Find 'Google' in the provider list",
      "4. Click 'Enable' or toggle it on",
      "5. Enter your Google OAuth credentials:",
      "   - Client ID (from Google Cloud Console)",
      "   - Client Secret (from Google Cloud Console)",
      "6. Add redirect URI: https://eiuwenohohvmtbjcclpa.supabase.co/auth/v1/callback",
      "7. Click 'Save'"
    );
  }

  if (message.includes("json") || message.includes("parse")) {
    steps.push(
      "Dashboard JSON Error Detected:",
      "1. Clear browser cache and cookies for supabase.com",
      "2. Try incognito/private browsing mode",
      "3. Try a different browser (Chrome, Firefox, Edge)",
      "4. Disable browser extensions (ad blockers, privacy tools)",
      "5. Try direct URL: https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa/auth/providers",
      "6. Check Supabase status: https://status.supabase.com/",
      "7. Wait a few minutes and retry (temporary issues often resolve)",
      "8. Contact Supabase support if issue persists"
    );
  }

  if (steps.length === 0) {
    steps.push(
      "General troubleshooting:",
      "1. Check Supabase project is active",
      "2. Verify environment variables are correct",
      "3. Check browser console for detailed errors",
      "4. Try refreshing the page",
      "5. Contact support if issue persists"
    );
  }

  return steps;
}
