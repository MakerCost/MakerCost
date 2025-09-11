-- Database schema for user data tables
-- Run these commands in your Supabase SQL editor

-- User Shops Table
CREATE TABLE IF NOT EXISTS public.user_shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  shop_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Machines Table
CREATE TABLE IF NOT EXISTS public.user_machines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  machine_id TEXT NOT NULL, -- From the application (machine.id)
  name TEXT NOT NULL,
  machine_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, machine_id)
);

-- User Materials Table  
CREATE TABLE IF NOT EXISTS public.user_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL, -- From the application (material.id)
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  material_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.user_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_materials ENABLE ROW LEVEL SECURITY;

-- User Shops Policies
CREATE POLICY "Users can view their own shop data" ON public.user_shops
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shop data" ON public.user_shops
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shop data" ON public.user_shops
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shop data" ON public.user_shops
  FOR DELETE USING (auth.uid() = user_id);

-- User Machines Policies
CREATE POLICY "Users can view their own machines" ON public.user_machines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own machines" ON public.user_machines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own machines" ON public.user_machines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own machines" ON public.user_machines
  FOR DELETE USING (auth.uid() = user_id);

-- User Materials Policies
CREATE POLICY "Users can view their own materials" ON public.user_materials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own materials" ON public.user_materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own materials" ON public.user_materials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own materials" ON public.user_materials
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS user_shops_user_id_idx ON public.user_shops(user_id);
CREATE INDEX IF NOT EXISTS user_machines_user_id_idx ON public.user_machines(user_id);
CREATE INDEX IF NOT EXISTS user_materials_user_id_idx ON public.user_materials(user_id);

-- Updated at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER handle_updated_at_user_shops
  BEFORE UPDATE ON public.user_shops
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_updated_at_user_machines
  BEFORE UPDATE ON public.user_machines
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

CREATE OR REPLACE TRIGGER handle_updated_at_user_materials
  BEFORE UPDATE ON public.user_materials
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();