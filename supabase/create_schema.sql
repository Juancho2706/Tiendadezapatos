-- ============================================================
-- SneakHub: FULL SCHEMA CREATION
-- Run this FIRST in the Supabase SQL Editor
-- Then run verify_setup.sql to confirm everything works
-- ============================================================

-- ========== 1. PROFILES ==========
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  full_name TEXT,
  phone TEXT,
  shipping_address JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 2. AUTO-CREATE PROFILE ON SIGNUP ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== 3. BRANDS ==========
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view brands" ON brands
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage brands" ON brands
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 4. PRODUCTS ==========
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  category TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_drop BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 5. PRODUCT VARIANTS ==========
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT,
  sku TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage variants" ON product_variants
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 6. PRODUCT IMAGES ==========
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage images" ON product_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 7. ORDERS ==========
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_id TEXT,
  shipping_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 8. ORDER ITEMS ==========
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can manage order items" ON order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 9. CONTENT BLOCKS (CMS) ==========
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active blocks" ON content_blocks
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage blocks" ON content_blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ========== 10. SEED CONTENT BLOCKS ==========
INSERT INTO content_blocks (section_name, title, subtitle, button_text, button_link, is_active) VALUES
  ('hero_home', 'DEFINE YOUR LEGACY', 'Las zapatillas más exclusivas, directo a tus pies', 'EXPLORAR AHORA', '/shop', true),
  ('marquee_top', 'ENVÍO GRATIS 🔥 NUEVOS DROPS CADA SEMANA 🚀 EDICIÓN LIMITADA', NULL, NULL, NULL, true),
  ('banner_promo', 'Colección Verano 2026', 'Descubre los nuevos diseños que están marcando tendencia', 'Ver Colección', '/shop', true),
  ('newsletter_home', 'Únete al Club', 'Sé el primero en conocer los lanzamientos y ofertas exclusivas', NULL, NULL, true),
  ('store_config', '{}', '{}', NULL, NULL, true)
ON CONFLICT (section_name) DO NOTHING;

-- ========== 11. SEED SAMPLE BRANDS ==========
INSERT INTO brands (name, slug) VALUES
  ('Nike', 'nike'),
  ('Adidas', 'adidas'),
  ('Jordan', 'jordan'),
  ('New Balance', 'new-balance'),
  ('Puma', 'puma')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
SELECT '✅ SCHEMA CREATED SUCCESSFULLY!' AS result;
SELECT '➡️  Next step: Run verify_setup.sql to confirm everything' AS result;
SELECT '➡️  Then create your admin user (see walkthrough)' AS result;
-- ============================================================
