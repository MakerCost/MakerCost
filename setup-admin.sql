-- Setup Admin User Script
-- Run this in your Supabase SQL Editor after running the admin schema
-- Replace 'your-email@example.com' with your actual email address

-- First, run the admin schema if you haven't already
-- Copy and paste the content from supabase-admin-schema.sql

-- Then, set your user as admin
-- Replace 'your-email@example.com' with your actual email
UPDATE public.profiles 
SET is_admin = true, updated_at = now()
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'tzabarya@gmail.com'  -- CHANGE THIS TO YOUR EMAIL
);

-- Verify the admin user was set
SELECT 
  p.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.updated_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.is_admin = true;