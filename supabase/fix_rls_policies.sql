-- ============================================================
-- FIX: Infinite recursion in profiles RLS policies
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create a SECURITY DEFINER function that bypasses RLS
-- This is the standard pattern to avoid self-referencing policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  );
$$;

-- 2. Drop ALL old policies on profiles (they cause recursion)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 3. Recreate profiles policies WITHOUT recursion
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins full access profiles" ON profiles
  USING (public.is_admin());

-- 4. Fix all other tables' admin policies to use is_admin() too
-- (they reference profiles which triggers the recursive policies)

-- BRANDS
DROP POLICY IF EXISTS "Admins can manage brands" ON brands;
CREATE POLICY "Admins can manage brands" ON brands
  FOR ALL USING (public.is_admin());

-- PRODUCTS
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (public.is_admin());

-- PRODUCT VARIANTS
DROP POLICY IF EXISTS "Admins can manage variants" ON product_variants;
CREATE POLICY "Admins can manage variants" ON product_variants
  FOR ALL USING (public.is_admin());

-- PRODUCT IMAGES
DROP POLICY IF EXISTS "Admins can manage images" ON product_images;
CREATE POLICY "Admins can manage images" ON product_images
  FOR ALL USING (public.is_admin());

-- ORDERS
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (public.is_admin());

-- ORDER ITEMS
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
CREATE POLICY "Admins can manage order items" ON order_items
  FOR ALL USING (public.is_admin());

-- CONTENT BLOCKS
DROP POLICY IF EXISTS "Admins can manage blocks" ON content_blocks;
CREATE POLICY "Admins can manage blocks" ON content_blocks
  FOR ALL USING (public.is_admin());

-- ============================================================
SELECT '✅ RLS POLICIES FIXED — Try logging in again!' AS result;
-- ============================================================
