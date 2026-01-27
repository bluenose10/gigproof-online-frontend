# Google OAuth Setup Guide

## Troubleshooting Supabase Dashboard Error

If you're seeing this error in the Supabase dashboard:
```
Failed to retrieve OAuth Server apps
Error: Unexpected non-whitespace character after JSON at position 4
```

Follow these troubleshooting steps:

### Quick Fixes (Try These First)

1. **Clear Browser Cache**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files" and "Cookies"
   - Clear data for `supabase.com`
   - Refresh the page

2. **Try Incognito/Private Window**
   - Open a new incognito/private window
   - Navigate to: https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa/auth/providers
   - This rules out browser extensions interfering

3. **Try Different Browser**
   - If using Chrome, try Firefox or Edge
   - Sometimes browser-specific issues occur

4. **Direct Navigation**
   - Try these direct URLs:
     - https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa/auth/providers
     - https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa/settings/auth

5. **Check Supabase Status**
   - Visit: https://status.supabase.com/
   - Check if there are known issues with the dashboard

### If Dashboard Still Broken

#### Option 1: Wait and Retry
- Dashboard issues are often temporary
- Wait 5-10 minutes and try again
- Supabase team usually fixes issues quickly

#### Option 2: Use Supabase CLI (Advanced)
If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref eiuwenohohvmtbjcclpa

# Note: Provider configuration via CLI may require specific commands
# Check: https://supabase.com/docs/reference/cli
```

#### Option 3: Contact Supabase Support
- Go to: https://supabase.com/support
- Report the dashboard bug
- Request manual configuration assistance
- Provide your project reference: `eiuwenohohvmtbjcclpa`

## Setting Up Google OAuth (Once Dashboard Works)

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and click "Enable"
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "GigProof" (or your choice)
   - Authorized redirect URIs:
     ```
     https://eiuwenohohvmtbjcclpa.supabase.co/auth/v1/callback
     ```
   - For local development (optional):
     ```
     http://localhost:8080/auth/v1/callback
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these)

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa
   ```

2. Navigate to:
   - **Authentication** > **Providers**
   - Or: **Settings** > **Authentication**

3. Find **Google** in the provider list

4. Click **Enable** or toggle it on

5. Enter credentials:
   - **Client ID (for OAuth)**: Paste from Google Cloud Console
   - **Client Secret (for OAuth)**: Paste from Google Cloud Console

6. Click **Save**

### Step 3: Test

1. Go to your app's login page
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to your app

## Verification

The redirect URL format should be:
```
https://[PROJECT_REF].supabase.co/auth/v1/callback
```

For this project:
```
https://eiuwenohohvmtbjcclpa.supabase.co/auth/v1/callback
```

**Important**: This exact URL must be added to Google Cloud Console's authorized redirect URIs.

## Common Issues

### "Provider is not enabled"
- Google OAuth hasn't been enabled in Supabase dashboard
- Follow Step 2 above

### "Invalid redirect URI"
- Redirect URI in Google Cloud Console doesn't match Supabase's callback URL
- Ensure exact match: `https://eiuwenohohvmtbjcclpa.supabase.co/auth/v1/callback`

### "Access blocked"
- Google OAuth consent screen not configured
- In Google Cloud Console, go to "OAuth consent screen"
- Configure app name, support email, and authorized domains

### Dashboard JSON Error
- This is a Supabase dashboard bug
- Follow the troubleshooting steps at the top of this document
- Contact Supabase support if it persists

## Need Help?

- Supabase Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase Support: https://supabase.com/support
- Project Reference: `eiuwenohohvmtbjcclpa`
