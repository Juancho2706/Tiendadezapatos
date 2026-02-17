-- ============================================================
-- SneakHub: MASTER RESET — Drop, Create, RLS, Seed, Admin
-- Run this ONCE in Supabase SQL Editor
-- It does EVERYTHING in one shot
-- ============================================================

-- ╔════════════════════════════════════════╗
-- ║  STEP 1: DROP EVERYTHING              ║
-- ╚════════════════════════════════════════╝
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS content_blocks CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ╔════════════════════════════════════════╗
-- ║  STEP 2: CREATE ALL TABLES            ║
-- ╚════════════════════════════════════════╝

-- PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  full_name TEXT,
  phone TEXT,
  shipping_address JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BRANDS
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
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

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT,
  sku TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_id TEXT,
  shipping_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT BLOCKS (CMS)
CREATE TABLE content_blocks (
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

-- ╔════════════════════════════════════════╗
-- ║  STEP 3: AUTO-PROFILE TRIGGER         ║
-- ╚════════════════════════════════════════╝
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 'customer');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ╔════════════════════════════════════════╗
-- ║  STEP 4: is_admin() + RLS POLICIES    ║
-- ╚════════════════════════════════════════╝
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = '' STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- PROFILES policies (no recursion!)
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access profiles" ON profiles USING (public.is_admin());

-- PUBLIC read policies
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public read images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read content" ON content_blocks FOR SELECT USING (true);

-- USER read own orders
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own order items" ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- ADMIN full access policies
CREATE POLICY "Admin manage brands" ON brands FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage products" ON products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage variants" ON product_variants FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage images" ON product_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage order items" ON order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage content" ON content_blocks FOR ALL USING (public.is_admin());

-- ╔════════════════════════════════════════╗
-- ║  STEP 5: ADMIN USER PROFILE           ║
-- ╚════════════════════════════════════════╝
-- Re-create the admin profile for your existing auth user
INSERT INTO profiles (id, role, full_name)
SELECT id, 'admin', 'Admin'
FROM auth.users
WHERE email = 'admin@admin.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- ╔════════════════════════════════════════╗
-- ║  STEP 6: SEED BRANDS                  ║
-- ╚════════════════════════════════════════╝
INSERT INTO brands (id, name, slug, logo_url) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Nike', 'nike', 'https://logo.clearbit.com/nike.com'),
  ('b0000000-0000-0000-0000-000000000002', 'Adidas', 'adidas', 'https://logo.clearbit.com/adidas.com'),
  ('b0000000-0000-0000-0000-000000000003', 'Jordan', 'jordan', 'https://logo.clearbit.com/jordan.com'),
  ('b0000000-0000-0000-0000-000000000004', 'New Balance', 'new-balance', 'https://logo.clearbit.com/newbalance.com'),
  ('b0000000-0000-0000-0000-000000000005', 'Puma', 'puma', 'https://logo.clearbit.com/puma.com'),
  ('b0000000-0000-0000-0000-000000000006', 'Converse', 'converse', 'https://logo.clearbit.com/converse.com');

-- ╔════════════════════════════════════════╗
-- ║  STEP 7: SEED PRODUCTS                ║
-- ╚════════════════════════════════════════╝
INSERT INTO products (id, brand_id, name, slug, description, price, sale_price, category, is_featured, is_drop) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'Nike Air Max 90', 'nike-air-max-90',
   'Amortiguación Air visible, diseño retro-futurista y comodidad superior para el día a día.',
   89990, NULL, 'Lifestyle', true, false),

  ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001',
   'Nike Dunk Low Retro', 'nike-dunk-low-retro',
   'El clásico del streetwear. Cuero premium, suela vulcanizada y el estilo que definió una generación.',
   109990, 89990, 'Streetwear', true, true),

  ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001',
   'Nike Air Force 1', 'nike-air-force-1-07',
   'El original desde 1982. Cuero suave, suela AirSole y el legado que sigue marcando tendencia.',
   79990, NULL, 'Lifestyle', false, false),

  ('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003',
   'Air Jordan 1 Retro High OG', 'air-jordan-1-retro-high-og',
   'La zapatilla que empezó todo. Cuero premium, caña alta icónica y la silueta más reconocida.',
   149990, NULL, 'Basketball Heritage', true, true),

  ('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003',
   'Air Jordan 4 Retro', 'air-jordan-4-retro',
   'Diseño de Tinker Hatfield. Malla lateral, soporte en lengüeta y amortiguación Air revolucionaria.',
   189990, 169990, 'Basketball Heritage', true, false),

  ('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002',
   'Adidas Samba OG', 'adidas-samba-og',
   'De las canchas de indoor al street style. Punta T-toe, tiras laterales y suela de goma translúcida.',
   99990, NULL, 'Retro', true, false),

  ('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000002',
   'Adidas Gazelle', 'adidas-gazelle',
   'El favorito del terrace style. Gamuza suave, perfil bajo y diseño que trasciende décadas.',
   84990, 74990, 'Retro', false, false),

  ('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004',
   'New Balance 550', 'new-balance-550',
   'El retro basketball que conquistó el mundo. Cuero premium, suela cupsole y silueta clean.',
   109990, NULL, 'Retro Basketball', true, true),

  ('a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000004',
   'New Balance 2002R', 'new-balance-2002r',
   'Tech meets heritage. ABZORB, N-ERGY y diseño premium inspirado en running de los 2000.',
   139990, 119990, 'Running Heritage', false, false),

  ('a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000005',
   'Puma Suede Classic XXI', 'puma-suede-classic-xxi',
   'Nacida en la cancha, criada en la calle. Gamuza premium y medio siglo de cultura.',
   69990, NULL, 'Streetwear', false, false),

  ('a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000006',
   'Chuck Taylor All Star 70 High', 'chuck-taylor-70-high',
   'La versión premium del All Star. Canvas más grueso, suela vintage y mayor amortiguación.',
   74990, NULL, 'Heritage', false, false),

  ('a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006',
   'Converse Run Star Hike', 'converse-run-star-hike',
   'Plataforma, suela dentada y actitud. El Chuck reinventado para la nueva generación.',
   94990, 79990, 'Platform', true, false);

-- ╔════════════════════════════════════════╗
-- ║  STEP 8: SEED PRODUCT IMAGES          ║
-- ╚════════════════════════════════════════╝
INSERT INTO product_images (product_id, url, is_main, display_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80', false, 1),
  ('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1612902456551-404b5c9e8e14?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80', false, 1),
  ('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1585854467604-41b2e1a6981e?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80', false, 1),
  ('a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1608379743498-dd26bb3c9a5e?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80', true, 0),
  ('a0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', true, 0);

-- ╔════════════════════════════════════════╗
-- ║  STEP 9: SEED VARIANTS (10 sizes each)║
-- ╚════════════════════════════════════════╝
DO $$
DECLARE
  p RECORD;
  sizes TEXT[] := ARRAY['36','37','38','39','40','41','42','43','44','45'];
  s TEXT;
  stock INT;
  counter INT := 1;
BEGIN
  FOR p IN SELECT id FROM products ORDER BY id LOOP
    FOREACH s IN ARRAY sizes LOOP
      stock := CASE
        WHEN random() < 0.15 THEN 0
        WHEN random() < 0.30 THEN (random() * 5)::int + 1
        ELSE (random() * 30)::int + 5
      END;
      INSERT INTO product_variants (product_id, size, color, sku, stock_quantity)
      VALUES (p.id, s, 'Default', 'SKU-' || LPAD(counter::text, 4, '0'), stock);
      counter := counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- ╔════════════════════════════════════════╗
-- ║  STEP 10: SEED CONTENT BLOCKS (CMS)   ║
-- ╚════════════════════════════════════════╝
INSERT INTO content_blocks (section_name, title, subtitle, button_text, button_link, is_active) VALUES
  ('hero_home', 'DEFINE YOUR LEGACY', 'Las zapatillas más exclusivas, directo a tus pies', 'EXPLORAR AHORA', '/shop', true),
  ('marquee_top', 'ENVÍO GRATIS 🔥 NUEVOS DROPS CADA SEMANA 🚀 EDICIÓN LIMITADA', NULL, NULL, NULL, true),
  ('banner_promo', 'Colección Verano 2026', 'Descubre los nuevos diseños que marcan tendencia', 'Ver Colección', '/shop', true),
  ('newsletter_home', 'Únete al Club', 'Sé el primero en conocer los lanzamientos y ofertas exclusivas', NULL, NULL, true),
  ('store_config', '{}', '{}', NULL, NULL, true);

-- ╔════════════════════════════════════════╗
-- ║  STEP 11: SEED SAMPLE ORDERS          ║
-- ╚════════════════════════════════════════╝
-- Use the admin user as customer for demo orders (since we can't insert fake profiles with FK to auth.users)
DO $$
DECLARE
  admin_id UUID;
  v1 UUID; v2 UUID; v3 UUID; v4 UUID; v5 UUID;
  o1 UUID; o2 UUID; o3 UUID; o4 UUID; o5 UUID;
BEGIN
  -- Get admin user id
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@admin.com' LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE NOTICE 'No admin user found, skipping orders';
    RETURN;
  END IF;

  -- Get some variant IDs
  SELECT id INTO v1 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000001' AND size = '42' LIMIT 1;
  SELECT id INTO v2 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000002' AND size = '40' LIMIT 1;
  SELECT id INTO v3 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000004' AND size = '43' LIMIT 1;
  SELECT id INTO v4 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000006' AND size = '39' LIMIT 1;
  SELECT id INTO v5 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000008' AND size = '41' LIMIT 1;

  -- Create orders
  INSERT INTO orders (id, user_id, status, total_amount, payment_id, shipping_details, created_at) VALUES
    (gen_random_uuid(), admin_id, 'delivered', 199980, 'PAY-001',
     '{"line1":"Av. Providencia 1234","city":"Santiago","state":"RM","zip":"7500000"}',
     NOW() - INTERVAL '5 days')
  RETURNING id INTO o1;

  INSERT INTO orders (id, user_id, status, total_amount, payment_id, shipping_details, created_at) VALUES
    (gen_random_uuid(), admin_id, 'shipped', 109990, 'PAY-002',
     '{"line1":"Calle Valparaíso 567","city":"Viña del Mar","state":"Valparaíso"}',
     NOW() - INTERVAL '2 days')
  RETURNING id INTO o2;

  INSERT INTO orders (id, user_id, status, total_amount, payment_id, shipping_details, created_at) VALUES
    (gen_random_uuid(), admin_id, 'processing', 249980, 'PAY-003',
     '{"line1":"Los Leones 890","city":"Santiago","state":"RM"}',
     NOW() - INTERVAL '1 day')
  RETURNING id INTO o3;

  INSERT INTO orders (id, user_id, status, total_amount, payment_id, shipping_details, created_at) VALUES
    (gen_random_uuid(), admin_id, 'paid', 149990, 'PAY-004',
     '{"line1":"Macul 456","city":"Santiago","state":"RM"}',
     NOW() - INTERVAL '6 hours')
  RETURNING id INTO o4;

  INSERT INTO orders (id, user_id, status, total_amount, payment_id, shipping_details, created_at) VALUES
    (gen_random_uuid(), admin_id, 'pending', 84990, NULL,
     '{"line1":"Simón Bolívar 123","city":"Concepción","state":"Biobío"}',
     NOW() - INTERVAL '3 hours')
  RETURNING id INTO o5;

  -- Create order items
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    (o1, v1, 1, 89990), (o1, v2, 1, 109990),
    (o2, v2, 1, 109990),
    (o3, v3, 1, 149990), (o3, v4, 1, 99990),
    (o4, v3, 1, 149990),
    (o5, v5, 1, 84990);
END $$;

-- ============================================================
SELECT '✅ MASTER RESET COMPLETE!' AS result;
SELECT '• 8 tables created with RLS' AS detail;
SELECT '• 12 products, 120 variants, 6 brands' AS detail;
SELECT '• 15 images, 5 orders, 5 content blocks' AS detail;
SELECT '• Admin profile restored for admin@admin.com' AS detail;
-- ============================================================
