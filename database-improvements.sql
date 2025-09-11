-- Database Best Practices Improvements
-- Run these in your Supabase SQL editor

-- 1. ADD NOT NULL CONSTRAINTS where appropriate
-- The machine_id and material_id should never be null
ALTER TABLE public.user_machines 
ALTER COLUMN machine_id SET NOT NULL;

ALTER TABLE public.user_materials 
ALTER COLUMN material_id SET NOT NULL;

-- 2. ADD CHECK CONSTRAINTS for data validation
-- Ensure machine_id and material_id are not empty strings
ALTER TABLE public.user_machines 
ADD CONSTRAINT machine_id_not_empty CHECK (length(trim(machine_id)) > 0);

ALTER TABLE public.user_materials 
ADD CONSTRAINT material_id_not_empty CHECK (length(trim(material_id)) > 0);

-- Ensure name fields are not empty
ALTER TABLE public.user_machines 
ADD CONSTRAINT machine_name_not_empty CHECK (length(trim(name)) > 0);

ALTER TABLE public.user_materials 
ADD CONSTRAINT material_name_not_empty CHECK (length(trim(name)) > 0);

-- Ensure category is not empty for materials
ALTER TABLE public.user_materials 
ADD CONSTRAINT material_category_not_empty CHECK (length(trim(category)) > 0);

-- 3. ADD JSONB VALIDATION CONSTRAINTS
-- Ensure shop_data contains required fields
ALTER TABLE public.user_shops 
ADD CONSTRAINT shop_data_has_name CHECK (shop_data ? 'name');

ALTER TABLE public.user_shops 
ADD CONSTRAINT shop_data_has_currency CHECK (shop_data ? 'currency');

-- 4. IMPROVE INDEXING for better performance
-- Add partial indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS user_machines_user_id_name_idx 
ON public.user_machines(user_id, name) 
WHERE name IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS user_materials_user_id_category_idx 
ON public.user_materials(user_id, category) 
WHERE category IS NOT NULL;

-- Add GIN index for JSONB fields for faster JSON queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS user_shops_shop_data_gin_idx 
ON public.user_shops USING GIN (shop_data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS user_machines_machine_data_gin_idx 
ON public.user_machines USING GIN (machine_data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS user_materials_material_data_gin_idx 
ON public.user_materials USING GIN (material_data);

-- 5. ADD AUDIT FIELDS for better tracking
-- Add version field for optimistic locking
ALTER TABLE public.user_shops 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

ALTER TABLE public.user_machines 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

ALTER TABLE public.user_materials 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add soft delete support
ALTER TABLE public.user_shops 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.user_machines 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.user_materials 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- 6. UPDATE TRIGGERS for version increment
CREATE OR REPLACE FUNCTION public.increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Replace existing update triggers with version increment
DROP TRIGGER IF EXISTS handle_updated_at_user_shops ON public.user_shops;
DROP TRIGGER IF EXISTS handle_updated_at_user_machines ON public.user_machines;
DROP TRIGGER IF EXISTS handle_updated_at_user_materials ON public.user_materials;

CREATE TRIGGER increment_version_user_shops
  BEFORE UPDATE ON public.user_shops
  FOR EACH ROW
  EXECUTE PROCEDURE public.increment_version();

CREATE TRIGGER increment_version_user_machines
  BEFORE UPDATE ON public.user_machines
  FOR EACH ROW
  EXECUTE PROCEDURE public.increment_version();

CREATE TRIGGER increment_version_user_materials
  BEFORE UPDATE ON public.user_materials
  FOR EACH ROW
  EXECUTE PROCEDURE public.increment_version();

-- 7. ADD BETTER RLS POLICIES (exclude soft-deleted records)
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own shop data" ON public.user_shops;
DROP POLICY IF EXISTS "Users can view their own machines" ON public.user_machines;
DROP POLICY IF EXISTS "Users can view their own materials" ON public.user_materials;

-- Create improved policies
CREATE POLICY "Users can view their own shop data" ON public.user_shops
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can view their own machines" ON public.user_machines
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can view their own materials" ON public.user_materials
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

-- 8. CREATE FUNCTION for soft delete
CREATE OR REPLACE FUNCTION public.soft_delete_user_data(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET deleted_at = NOW() WHERE id = $1 AND user_id = auth.uid()', table_name)
  USING record_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 9. ADD TABLE COMMENTS for documentation
COMMENT ON TABLE public.user_shops IS 'User shop configuration and overhead costs';
COMMENT ON TABLE public.user_machines IS 'User-defined manufacturing machines and equipment';
COMMENT ON TABLE public.user_materials IS 'User-defined materials and their properties';

COMMENT ON COLUMN public.user_shops.shop_data IS 'JSONB containing shop configuration, costs, and settings';
COMMENT ON COLUMN public.user_machines.machine_data IS 'JSONB containing machine specifications and cost parameters';
COMMENT ON COLUMN public.user_materials.material_data IS 'JSONB containing material properties and pricing';

-- 10. VERIFY CONSTRAINTS
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid IN (
  'public.user_shops'::regclass,
  'public.user_machines'::regclass,
  'public.user_materials'::regclass
)
ORDER BY conrelid, contype;