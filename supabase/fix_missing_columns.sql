-- ============================================================
-- FIX: Add missing columns to existing tables
-- Run this if create_schema.sql skipped tables that already existed
-- ============================================================

-- Add missing columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_drop BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_address JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure product_variants has all columns
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS color TEXT;
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sku TEXT;

-- Ensure orders has all columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_details JSONB DEFAULT '{}';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure content_blocks has all columns
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS button_link TEXT;
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE content_blocks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

SELECT '✅ Missing columns added! Now run seed_data.sql' AS result;
