-- ============================================================
-- SneakHub: Supabase Schema & RLS Verification Script
-- Run this in the Supabase SQL Editor to verify everything
-- ============================================================

-- ========== 1. VERIFY TABLES EXIST ==========
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY['profiles','brands','products','product_variants','product_images','orders','order_items','content_blocks'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name=t) THEN
      RAISE WARNING '❌ Table "%" does NOT exist!', t;
    ELSE
      RAISE NOTICE '✅ Table "%" exists', t;
    END IF;
  END LOOP;
END $$;

-- ========== 2. VERIFY KEY COLUMNS ==========
DO $$
BEGIN
  -- profiles.role
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
    RAISE NOTICE '✅ profiles.role column exists';
  ELSE
    RAISE WARNING '❌ profiles.role column MISSING — admin auth will fail!';
  END IF;

  -- products.is_featured
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_featured') THEN
    RAISE NOTICE '✅ products.is_featured column exists';
  ELSE
    RAISE WARNING '❌ products.is_featured column MISSING';
  END IF;

  -- products.is_drop
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_drop') THEN
    RAISE NOTICE '✅ products.is_drop column exists';
  ELSE
    RAISE WARNING '❌ products.is_drop column MISSING';
  END IF;

  -- products.sale_price
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sale_price') THEN
    RAISE NOTICE '✅ products.sale_price column exists';
  ELSE
    RAISE WARNING '❌ products.sale_price column MISSING';
  END IF;

  -- orders.shipping_details
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='shipping_details') THEN
    RAISE NOTICE '✅ orders.shipping_details column exists';
  ELSE
    RAISE WARNING '❌ orders.shipping_details column MISSING';
  END IF;

  -- content_blocks.section_name
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='content_blocks' AND column_name='section_name') THEN
    RAISE NOTICE '✅ content_blocks.section_name column exists';
  ELSE
    RAISE WARNING '❌ content_blocks.section_name column MISSING — Site Builder will fail!';
  END IF;
END $$;

-- ========== 3. VERIFY RLS IS ENABLED ==========
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY['profiles','brands','products','product_variants','product_images','orders','order_items','content_blocks'];
  rls_on BOOLEAN;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    SELECT relrowsecurity INTO rls_on FROM pg_class WHERE relname = t AND relnamespace = 'public'::regnamespace;
    IF rls_on THEN
      RAISE NOTICE '✅ RLS enabled on "%"', t;
    ELSE
      RAISE WARNING '⚠️  RLS NOT enabled on "%"', t;
    END IF;
  END LOOP;
END $$;

-- ========== 4. CHECK FOR ADMIN USER ==========
DO $$
DECLARE
  admin_count INT;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM profiles WHERE role = 'admin';
  IF admin_count > 0 THEN
    RAISE NOTICE '✅ Found % admin user(s)', admin_count;
  ELSE
    RAISE WARNING '❌ NO admin users found! Create one with:';
    RAISE WARNING '   UPDATE profiles SET role = ''admin'' WHERE id = ''<USER_UUID>'';';
  END IF;
END $$;

-- ========== 5. CHECK handle_new_user TRIGGER ==========
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE NOTICE '✅ on_auth_user_created trigger exists';
  ELSE
    RAISE WARNING '⚠️  on_auth_user_created trigger not found — new users won''t get profiles automatically';
  END IF;
END $$;

-- ========== 6. SEED CONTENT BLOCKS (if empty) ==========
-- These are needed for the Site Builder to work
INSERT INTO content_blocks (section_name, title, subtitle, button_text, button_link, is_active)
SELECT * FROM (VALUES
  ('hero_home', 'DEFINE YOUR LEGACY', 'Las zapatillas más exclusivas, directo a tus pies', 'EXPLORAR AHORA', '/shop', true),
  ('marquee_top', 'ENVÍO GRATIS 🔥 NUEVOS DROPS CADA SEMANA 🚀 EDICIÓN LIMITADA', NULL, NULL, NULL, true),
  ('banner_promo', 'Colección Verano 2026', 'Descubre los nuevos diseños que están marcando tendencia', 'Ver Colección', '/shop', true),
  ('newsletter_home', 'Únete al Club', 'Sé el primero en conocer los lanzamientos y ofertas exclusivas', NULL, NULL, true),
  ('store_config', '{}', '{}', NULL, NULL, true)
) AS v(section_name, title, subtitle, button_text, button_link, is_active)
WHERE NOT EXISTS (SELECT 1 FROM content_blocks WHERE section_name = v.section_name);

-- ========== 7. VERIFY STORAGE BUCKETS ==========
-- Run this check manually in the Supabase Dashboard > Storage
-- Required buckets (all PUBLIC):
--   - product-images
--   - brand-logos
--   - site-content

SELECT '============================================' AS result
UNION ALL
SELECT '✅ VERIFICATION COMPLETE — Check notices above' AS result
UNION ALL
SELECT '============================================' AS result;
