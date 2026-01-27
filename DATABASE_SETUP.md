# Database Setup Instructions

## Overview
After setting up your Supabase project, you need to run database migrations to create the required tables and functions.

## Step 1: Run Migrations in Supabase Dashboard

1. Go to your Supabase project dashboard:
   ```
   https://supabase.com/dashboard/project/eiuwenohohvmtbjcclpa
   ```

2. Navigate to **SQL Editor** (left sidebar)

3. Run migrations in this order:

### Migration 1: Profiles and Triggers
Open file: `supabase/migrations/20260108094838_8272aacb-a86f-4fae-838b-d1ca8c680501.sql`
- Copy the entire contents
- Paste into SQL Editor
- Click "Run" or press `Ctrl+Enter`
- Verify: Check that `profiles` and `user_roles` tables are created

### Migration 2: Plaid Tables
Open file: `supabase/migrations/20260108095330_090b0935-5b54-4e0a-92c5-7bc93759bf82.sql`
- Copy the entire contents
- Paste into SQL Editor
- Click "Run"
- Verify: Check that `plaid_items`, `transactions`, and `income_summaries` tables are created

### Migration 3: Reports Table
Open file: `supabase/migrations/20260109000000_create_reports_table.sql`
- Copy the entire contents
- Paste into SQL Editor
- Click "Run"
- Verify: Check that `reports` table is created

### Migration 4: Create Missing Profiles (If you have existing users)
Open file: `supabase/migrations/20260111000000_create_missing_profiles.sql`
- Copy the entire contents
- Paste into SQL Editor
- Click "Run"
- This creates profiles for any existing users (like OAuth users) who don't have one

## Step 2: Verify Tables Exist

1. Go to **Database** > **Tables** in Supabase dashboard
2. You should see these tables:
   - `profiles`
   - `user_roles`
   - `plaid_items`
   - `transactions`
   - `income_summaries`
   - `reports`

## Step 3: Verify Row Level Security (RLS)

1. Go to **Database** > **Tables**
2. Click on each table
3. Check that **RLS** is enabled (should show "Enabled" badge)
4. Check **Policies** tab to see RLS policies are created

## Step 4: Deploy Edge Functions

1. Go to **Edge Functions** in Supabase dashboard
2. Verify these functions exist:
   - `plaid-create-link-token`
   - `plaid-exchange-token`
   - `plaid-get-transactions`

3. If functions don't exist, you need to deploy them:
   - Use Supabase CLI: `supabase functions deploy`
   - Or use the dashboard to create them manually

## Troubleshooting

### 404 Errors for Tables
- **Problem**: Tables don't exist
- **Solution**: Run the migrations above

### 400 Error for Profiles
- **Problem**: Profile doesn't exist for user
- **Solution**: Run migration 4 (`20260111000000_create_missing_profiles.sql`)

### 401 Error for Edge Functions
- **Problem**: Edge function not deployed or auth issue
- **Solution**: 
  1. Verify edge functions are deployed
  2. Check that user is authenticated
  3. Verify session token is being passed correctly

### RLS Policy Errors
- **Problem**: User can't access their own data
- **Solution**: 
  1. Verify RLS is enabled on tables
  2. Check that policies exist and are correct
  3. Ensure user is authenticated (`auth.uid()` should return user ID)

## Quick Check SQL

Run this in SQL Editor to verify everything is set up:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'plaid_items', 'transactions', 'income_summaries', 'reports')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'plaid_items', 'transactions', 'income_summaries', 'reports');

-- Check profiles for existing users
SELECT 
  u.id as user_id,
  u.email,
  p.id as profile_id,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 10;
```

## Need Help?

- Supabase Docs: https://supabase.com/docs/guides/database
- Project Reference: `eiuwenohohvmtbjcclpa`
