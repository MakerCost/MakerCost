-- Fix user_shops table to prevent 406 errors
-- Run this in your Supabase SQL editor

-- First, remove any duplicate rows (keep the most recent one for each user)
DELETE FROM public.user_shops 
WHERE id NOT IN (
  SELECT DISTINCT ON (user_id) id 
  FROM public.user_shops 
  ORDER BY user_id, updated_at DESC
);

-- Add the unique constraint on user_id
ALTER TABLE public.user_shops 
ADD CONSTRAINT user_shops_user_id_unique UNIQUE (user_id);

-- Check if the constraint was added successfully
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.user_shops'::regclass;