import {
  seedBrands,
  seedProducts,
  seedOrders,
  seedProfiles,
  seedContentBlocks,
  type MockBrand,
  type MockProduct,
  type MockOrder,
  type MockProfile,
  type MockContentBlock,
} from "./data";

const STORAGE_KEY = "sneakhub_mock_db";

interface MockDb {
  brands: MockBrand[];
  products: MockProduct[];
  orders: MockOrder[];
  profiles: MockProfile[];
  contentBlocks: MockContentBlock[];
}

function loadDb(): MockDb {
  if (typeof window === "undefined") {
    return {
      brands: seedBrands.map((b) => ({ ...b })),
      products: seedProducts.map((p) => ({
        ...p,
        images: p.images.map((i) => ({ ...i })),
        variants: p.variants.map((v) => ({ ...v })),
        product_images: p.images.map((i) => ({ ...i })),
        product_variants: p.variants.map((v) => ({ ...v })),
      })),
      orders: seedOrders.map((o) => ({ ...o, order_items: o.order_items.map((i) => ({ ...i })) })),
      profiles: seedProfiles.map((p) => ({ ...p })),
      contentBlocks: seedContentBlocks.map((c) => ({ ...c })),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  const db: MockDb = {
    brands: seedBrands.map((b) => ({ ...b })),
    products: seedProducts.map((p) => ({
      ...p,
      images: p.images.map((i) => ({ ...i })),
      variants: p.variants.map((v) => ({ ...v })),
      product_images: p.images.map((i) => ({ ...i })),
      product_variants: p.variants.map((v) => ({ ...v })),
    })),
    orders: seedOrders.map((o) => ({ ...o, order_items: o.order_items.map((i) => ({ ...i })) })),
    profiles: seedProfiles.map((p) => ({ ...p })),
    contentBlocks: seedContentBlocks.map((c) => ({ ...c })),
  };
  saveDb(db);
  return db;
}

function saveDb(db: MockDb) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // ignore
    }
  }
}

let db = loadDb();

function syncProductRelations(p: MockProduct) {
  // Ensure nested arrays exist for admin components
  p.product_images = p.images;
  p.product_variants = p.variants;
  p.brand = db.brands.find((b) => b.id === p.brand_id)
    ? { name: db.brands.find((b) => b.id === p.brand_id)!.name }
    : { name: "Unknown" };
  p.brands = p.brand;
}

// ── Products ──

export async function getProducts(options?: {
  category?: string;
  isFeatured?: boolean;
  limit?: number;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  brand?: string;
}): Promise<MockProduct[]> {
  let list = db.products.map((p) => {
    const copy = { ...p, images: p.images.map((i) => ({ ...i })), variants: p.variants.map((v) => ({ ...v })) };
    syncProductRelations(copy);
    return copy;
  });

  if (options?.category && options.category !== "All") {
    list = list.filter((p) => p.category === options.category);
  }
  if (options?.isFeatured) {
    list = list.filter((p) => p.is_featured);
  }
  if (options?.brand) {
    list = list.filter((p) => p.brand?.name === options.brand);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (options?.sort === "price-asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sort === "price-desc") {
    list.sort((a, b) => b.price - a.price);
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  if (options?.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

export async function getProductById(id: string): Promise<MockProduct | null> {
  const p = db.products.find((x) => x.id === id);
  if (!p) return null;
  const copy = { ...p, images: p.images.map((i) => ({ ...i })), variants: p.variants.map((v) => ({ ...v })) };
  syncProductRelations(copy);
  return copy;
}

export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  const p = db.products.find((x) => x.slug === slug);
  if (!p) return null;
  const copy = { ...p, images: p.images.map((i) => ({ ...i })), variants: p.variants.map((v) => ({ ...v })) };
  syncProductRelations(copy);
  return copy;
}

export async function createProduct(data: Partial<MockProduct>): Promise<MockProduct> {
  const id = "p" + (db.products.length + 1 + Math.floor(Math.random() * 10000));
  const now = new Date().toISOString();
  const newProduct: MockProduct = {
    id,
    brand_id: data.brand_id || null,
    name: data.name || "",
    slug: data.slug || id,
    description: data.description || null,
    price: data.price || 0,
    sale_price: data.sale_price || null,
    category: data.category || null,
    is_featured: data.is_featured || false,
    is_drop: data.is_drop || false,
    created_at: now,
    updated_at: now,
    images: data.images || [],
    variants: data.variants || [],
  };
  db.products.push(newProduct);
  saveDb(db);
  const copy = { ...newProduct, images: newProduct.images.map((i) => ({ ...i })), variants: newProduct.variants.map((v) => ({ ...v })) };
  syncProductRelations(copy);
  return copy;
}

export async function updateProduct(id: string, data: Partial<MockProduct>): Promise<MockProduct | null> {
  const idx = db.products.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...data, updated_at: new Date().toISOString() };
  saveDb(db);
  const p = db.products[idx];
  const copy = { ...p, images: p.images.map((i) => ({ ...i })), variants: p.variants.map((v) => ({ ...v })) };
  syncProductRelations(copy);
  return copy;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const idx = db.products.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  db.products.splice(idx, 1);
  saveDb(db);
  return true;
}

// ── Brands ──

export async function getBrands(): Promise<MockBrand[]> {
  return db.brands.map((b) => ({ ...b }));
}

export async function createBrand(data: Partial<MockBrand>): Promise<MockBrand> {
  const id = "b" + (db.brands.length + 1 + Math.floor(Math.random() * 10000));
  const newBrand: MockBrand = {
    id,
    name: data.name || "",
    slug: data.slug || id,
    logo_url: data.logo_url || null,
    created_at: new Date().toISOString(),
  };
  db.brands.push(newBrand);
  saveDb(db);
  return { ...newBrand };
}

export async function updateBrand(id: string, data: Partial<MockBrand>): Promise<MockBrand | null> {
  const idx = db.brands.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  db.brands[idx] = { ...db.brands[idx], ...data };
  saveDb(db);
  return { ...db.brands[idx] };
}

export async function deleteBrand(id: string): Promise<boolean> {
  const idx = db.brands.findIndex((x) => x.id === id);
  if (idx === -1) return false;
  db.brands.splice(idx, 1);
  // Unassign products from this brand
  db.products.forEach((p) => {
    if (p.brand_id === id) p.brand_id = null;
  });
  saveDb(db);
  return true;
}

// ── Orders ──

export async function getOrders(): Promise<MockOrder[]> {
  return db.orders.map((o) => ({ ...o, order_items: o.order_items.map((i) => ({ ...i })) })).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getOrderById(id: string): Promise<MockOrder | null> {
  const o = db.orders.find((x) => x.id === id);
  if (!o) return null;
  return { ...o, order_items: o.order_items.map((i) => ({ ...i })) };
}

// ── Profiles / Customers ──

export async function getProfiles(): Promise<MockProfile[]> {
  return db.profiles.map((p) => ({ ...p }));
}

export async function getProfileById(id: string): Promise<MockProfile | null> {
  const p = db.profiles.find((x) => x.id === id);
  return p ? { ...p } : null;
}

// ── Content Blocks ──

export async function getContentBlocks(): Promise<MockContentBlock[]> {
  return db.contentBlocks.map((c) => ({ ...c }));
}

export async function updateContentBlock(id: string, content: string): Promise<MockContentBlock | null> {
  const idx = db.contentBlocks.findIndex((x) => x.id === id);
  if (idx === -1) return null;
  db.contentBlocks[idx] = { ...db.contentBlocks[idx], content, updated_at: new Date().toISOString() };
  saveDb(db);
  return { ...db.contentBlocks[idx] };
}

// ── Utils ──

export function resetMockDb() {
  db = {
    brands: seedBrands.map((b) => ({ ...b })),
    products: seedProducts.map((p) => ({
      ...p,
      images: p.images.map((i) => ({ ...i })),
      variants: p.variants.map((v) => ({ ...v })),
      product_images: p.images.map((i) => ({ ...i })),
      product_variants: p.variants.map((v) => ({ ...v })),
    })),
    orders: seedOrders.map((o) => ({ ...o, order_items: o.order_items.map((i) => ({ ...i })) })),
    profiles: seedProfiles.map((p) => ({ ...p })),
    contentBlocks: seedContentBlocks.map((c) => ({ ...c })),
  };
  saveDb(db);
}
