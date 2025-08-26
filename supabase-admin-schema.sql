-- Admin functionality schema for MakerCost
-- Run this in your Supabase SQL Editor to add admin functionality

-- Add admin role column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create admin policies
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create admin views for all data
CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can view all quotes" ON public.quotes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND is_admin = true
  );
END;
$$;

-- Create function to get all users (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE(
  id uuid,
  email text,
  first_name text,
  last_name text,
  username text,
  is_admin boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.id,
    u.email,
    p.first_name,
    p.last_name,
    p.username,
    p.is_admin,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  JOIN auth.users u ON p.id = u.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Create function to get admin stats (admin only)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_users bigint,
  total_projects bigint,
  total_quotes bigint,
  users_this_month bigint,
  projects_this_month bigint,
  quotes_this_month bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.profiles)::bigint,
    (SELECT COUNT(*) FROM public.projects)::bigint,
    (SELECT COUNT(*) FROM public.quotes)::bigint,
    (SELECT COUNT(*) FROM public.profiles WHERE created_at >= date_trunc('month', now()))::bigint,
    (SELECT COUNT(*) FROM public.projects WHERE created_at >= date_trunc('month', now()))::bigint,
    (SELECT COUNT(*) FROM public.quotes WHERE created_at >= date_trunc('month', now()))::bigint;
END;
$$;

-- Create function to set admin status (existing admin only)
CREATE OR REPLACE FUNCTION public.set_admin_status(target_user_id uuid, admin_status boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  UPDATE public.profiles
  SET is_admin = admin_status, updated_at = now()
  WHERE id = target_user_id;

  RETURN FOUND;
END;
$$;