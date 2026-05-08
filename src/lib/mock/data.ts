export type MockBrand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
};

export type MockProductImage = {
  url: string;
  is_main: boolean;
  display_order: number;
};

export type MockProductVariant = {
  size: string;
  color: string | null;
  stock_quantity: number;
  sku: string | null;
};

export type MockProduct = {
  id: string;
  brand_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category: string | null;
  is_featured: boolean;
  is_drop: boolean;
  created_at: string;
  updated_at: string;
  brand?: { name: string };
  images: MockProductImage[];
  variants: MockProductVariant[];
  product_images?: MockProductImage[];
  product_variants?: MockProductVariant[];
  brands?: { name: string };
};

export type MockOrderItem = {
  quantity: number;
  unit_price: number;
  product_name: string;
};

export type MockOrder = {
  id: string;
  user_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_details: any;
  order_items: MockOrderItem[];
};

export type MockProfile = {
  id: string;
  role: "admin" | "customer";
  full_name: string | null;
  email: string | null;
  phone: string | null;
  shipping_address: any;
  created_at: string;
  updated_at: string;
};

export type MockContentBlock = {
  id: string;
  key: string;
  content: string;
  type: string;
  updated_at: string;
};

export const seedBrands: MockBrand[] = [
  { id: "b1", name: "Nike", slug: "nike", logo_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "b2", name: "Jordan", slug: "jordan", logo_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "b3", name: "Adidas", slug: "adidas", logo_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "b4", name: "New Balance", slug: "new-balance", logo_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "b5", name: "Puma", slug: "puma", logo_url: null, created_at: "2024-01-01T00:00:00Z" },
];

function img(url: string, isMain = true, order = 0): MockProductImage {
  return { url, is_main: isMain, display_order: order };
}

function variant(size: string, color: string | null, stock: number, sku: string | null): MockProductVariant {
  return { size, color, stock_quantity: stock, sku };
}

export const seedProducts: MockProduct[] = [
  {
    id: "p1",
    brand_id: "b2",
    name: "Air Jordan 1 High OG Chicago",
    slug: "air-jordan-1-high-og-chicago",
    description: "El icónico regreso del colorway Chicago. Parte superior de cuero premium con el clásico esquema rojo, blanco y negro.",
    price: 189990,
    sale_price: null,
    category: "Hombre",
    is_featured: true,
    is_drop: true,
    created_at: "2024-11-01T00:00:00Z",
    updated_at: "2024-11-01T00:00:00Z",
    brand: { name: "Jordan" },
    brands: { name: "Jordan" },
    images: [
      img("/Hero New.png", true, 0),
      img("/hero_new.jpg", false, 1),
    ],
    variants: [
      variant("40", "Rojo/Blanco/Negro", 5, "AJ1-CHI-40"),
      variant("41", "Rojo/Blanco/Negro", 8, "AJ1-CHI-41"),
      variant("42", "Rojo/Blanco/Negro", 12, "AJ1-CHI-42"),
      variant("43", "Rojo/Blanco/Negro", 6, "AJ1-CHI-43"),
      variant("44", "Rojo/Blanco/Negro", 3, "AJ1-CHI-44"),
    ],
  },
  {
    id: "p2",
    brand_id: "b1",
    name: "Nike Dunk Low Retro White Black",
    slug: "nike-dunk-low-retro-panda",
    description: "El clásico Panda que nunca pasa de moda. Combinación blanco y negro versátil para cualquier outfit.",
    price: 129990,
    sale_price: 109990,
    category: "Unisex",
    is_featured: true,
    is_drop: false,
    created_at: "2024-10-15T00:00:00Z",
    updated_at: "2024-10-15T00:00:00Z",
    brand: { name: "Nike" },
    brands: { name: "Nike" },
    images: [
      img("/Hombre 1.png", true, 0),
      img("/Mujer 1.png", false, 1),
    ],
    variants: [
      variant("38", "Blanco/Negro", 10, "NK-DK-PND-38"),
      variant("39", "Blanco/Negro", 15, "NK-DK-PND-39"),
      variant("40", "Blanco/Negro", 20, "NK-DK-PND-40"),
      variant("41", "Blanco/Negro", 18, "NK-DK-PND-41"),
      variant("42", "Blanco/Negro", 14, "NK-DK-PND-42"),
      variant("43", "Blanco/Negro", 9, "NK-DK-PND-43"),
    ],
  },
  {
    id: "p3",
    brand_id: "b3",
    name: "Adidas Samba OG",
    slug: "adidas-samba-og",
    description: "Un clásico del fútbol sala reinventado para la calle. Gamuza y piel con las 3 rayas icónicas.",
    price: 99990,
    sale_price: null,
    category: "Unisex",
    is_featured: true,
    is_drop: false,
    created_at: "2024-09-20T00:00:00Z",
    updated_at: "2024-09-20T00:00:00Z",
    brand: { name: "Adidas" },
    brands: { name: "Adidas" },
    images: [
      img("/Mujer 1.png", true, 0),
      img("/Hero New.png", false, 1),
    ],
    variants: [
      variant("37", "Negro/Blanco", 8, "AD-SMB-37"),
      variant("38", "Negro/Blanco", 12, "AD-SMB-38"),
      variant("39", "Negro/Blanco", 15, "AD-SMB-39"),
      variant("40", "Negro/Blanco", 11, "AD-SMB-40"),
      variant("41", "Negro/Blanco", 7, "AD-SMB-41"),
      variant("42", "Negro/Blanco", 5, "AD-SMB-42"),
    ],
  },
  {
    id: "p4",
    brand_id: "b1",
    name: "Nike Air Force 1 '07",
    slug: "nike-air-force-1-07",
    description: "El baloncesto de los 80 sigue reinando. Cuero premium, amortiguación Air y estilo atemporal.",
    price: 119990,
    sale_price: null,
    category: "Unisex",
    is_featured: true,
    is_drop: false,
    created_at: "2024-08-10T00:00:00Z",
    updated_at: "2024-08-10T00:00:00Z",
    brand: { name: "Nike" },
    brands: { name: "Nike" },
    images: [
      img("/hero_new.jpg", true, 0),
      img("/Hombre 1.png", false, 1),
    ],
    variants: [
      variant("38", "Blanco", 20, "NK-AF1-38"),
      variant("39", "Blanco", 25, "NK-AF1-39"),
      variant("40", "Blanco", 30, "NK-AF1-40"),
      variant("41", "Blanco", 28, "NK-AF1-41"),
      variant("42", "Blanco", 22, "NK-AF1-42"),
      variant("43", "Blanco", 18, "NK-AF1-43"),
      variant("44", "Blanco", 10, "NK-AF1-44"),
    ],
  },
  {
    id: "p5",
    brand_id: "b2",
    name: "Jordan 4 Retro Thunder",
    slug: "jordan-4-retro-thunder",
    description: "El retorno del Thunder. Negro y amarillo en una de las siluetas más queridas de la línea Jordan.",
    price: 229990,
    sale_price: 199990,
    category: "Hombre",
    is_featured: true,
    is_drop: true,
    created_at: "2024-11-10T00:00:00Z",
    updated_at: "2024-11-10T00:00:00Z",
    brand: { name: "Jordan" },
    brands: { name: "Jordan" },
    images: [
      img("/Hero New.png", true, 0),
      img("/hero_new.jpg", false, 1),
    ],
    variants: [
      variant("40", "Negro/Amarillo", 4, "J4-THU-40"),
      variant("41", "Negro/Amarillo", 6, "J4-THU-41"),
      variant("42", "Negro/Amarillo", 8, "J4-THU-42"),
      variant("43", "Negro/Amarillo", 5, "J4-THU-43"),
      variant("44", "Negro/Amarillo", 2, "J4-THU-44"),
    ],
  },
  {
    id: "p6",
    brand_id: "b4",
    name: "New Balance 550 White Green",
    slug: "new-balance-550-white-green",
    description: "Estética vintage de los 80 con materiales modernos. El colorway verde es una de las combinaciones más buscadas.",
    price: 139990,
    sale_price: null,
    category: "Unisex",
    is_featured: true,
    is_drop: false,
    created_at: "2024-07-05T00:00:00Z",
    updated_at: "2024-07-05T00:00:00Z",
    brand: { name: "New Balance" },
    brands: { name: "New Balance" },
    images: [
      img("/Hombre 1.png", true, 0),
      img("/Mujer 1.png", false, 1),
    ],
    variants: [
      variant("38", "Blanco/Verde", 7, "NB-550-38"),
      variant("39", "Blanco/Verde", 9, "NB-550-39"),
      variant("40", "Blanco/Verde", 12, "NB-550-40"),
      variant("41", "Blanco/Verde", 10, "NB-550-41"),
      variant("42", "Blanco/Verde", 8, "NB-550-42"),
      variant("43", "Blanco/Verde", 5, "NB-550-43"),
    ],
  },
  {
    id: "p7",
    brand_id: "b3",
    name: "Adidas Campus 00s",
    slug: "adidas-campus-00s",
    description: "Inspirada en el skate de los 2000. Gamuza gruesa y suela vulcanizada para un look auténticamente retro.",
    price: 109990,
    sale_price: 89990,
    category: "Mujer",
    is_featured: false,
    is_drop: false,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-10-01T00:00:00Z",
    brand: { name: "Adidas" },
    brands: { name: "Adidas" },
    images: [
      img("/Mujer 1.png", true, 0),
      img("/Hero New.png", false, 1),
    ],
    variants: [
      variant("36", "Gris/Blanco", 6, "AD-CMP-36"),
      variant("37", "Gris/Blanco", 8, "AD-CMP-37"),
      variant("38", "Gris/Blanco", 10, "AD-CMP-38"),
      variant("39", "Gris/Blanco", 12, "AD-CMP-39"),
      variant("40", "Gris/Blanco", 9, "AD-CMP-40"),
    ],
  },
  {
    id: "p8",
    brand_id: "b1",
    name: "Nike Air Max 1 Patta Waves",
    slug: "nike-air-max-1-patta-waves",
    description: "Colaboración icónica con Patta. El pattern de olas en colores vibrantes redefine esta silueta clásica.",
    price: 179990,
    sale_price: null,
    category: "Hombre",
    is_featured: false,
    is_drop: true,
    created_at: "2024-11-20T00:00:00Z",
    updated_at: "2024-11-20T00:00:00Z",
    brand: { name: "Nike" },
    brands: { name: "Nike" },
    images: [
      img("/hero_new.jpg", true, 0),
      img("/Hombre 1.png", false, 1),
    ],
    variants: [
      variant("40", "Monarch/Negro", 3, "NK-AM1-PAT-40"),
      variant("41", "Monarch/Negro", 5, "NK-AM1-PAT-41"),
      variant("42", "Monarch/Negro", 4, "NK-AM1-PAT-42"),
      variant("43", "Monarch/Negro", 2, "NK-AM1-PAT-43"),
    ],
  },
  {
    id: "p9",
    brand_id: "b2",
    name: "Jordan 1 Low Travis Scott Olive",
    slug: "jordan-1-low-travis-scott-olive",
    description: "La última colaboración de Travis Scott. Gamuza oliva con el detalle reverse Swoosh que define la serie.",
    price: 299990,
    sale_price: 279990,
    category: "Hombre",
    is_featured: true,
    is_drop: true,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2024-12-01T00:00:00Z",
    brand: { name: "Jordan" },
    brands: { name: "Jordan" },
    images: [
      img("/Hero New.png", true, 0),
      img("/hero_new.jpg", false, 1),
    ],
    variants: [
      variant("40", "Olive/Negro", 2, "J1-TS-OLV-40"),
      variant("41", "Olive/Negro", 3, "J1-TS-OLV-41"),
      variant("42", "Olive/Negro", 4, "J1-TS-OLV-42"),
      variant("43", "Olive/Negro", 2, "J1-TS-OLV-43"),
    ],
  },
  {
    id: "p10",
    brand_id: "b5",
    name: "Puma Suede Classic XXI",
    slug: "puma-suede-classic-xxi",
    description: "El ícono del hip-hop y el breakdance. Gamuza premium con la formstrip lateral y suela de goma.",
    price: 79990,
    sale_price: null,
    category: "Unisex",
    is_featured: false,
    is_drop: false,
    created_at: "2024-06-15T00:00:00Z",
    updated_at: "2024-06-15T00:00:00Z",
    brand: { name: "Puma" },
    brands: { name: "Puma" },
    images: [
      img("/Hombre 1.png", true, 0),
      img("/Mujer 1.png", false, 1),
    ],
    variants: [
      variant("37", "Negro/Blanco", 15, "PM-SUD-37"),
      variant("38", "Negro/Blanco", 18, "PM-SUD-38"),
      variant("39", "Negro/Blanco", 20, "PM-SUD-39"),
      variant("40", "Negro/Blanco", 22, "PM-SUD-40"),
      variant("41", "Negro/Blanco", 19, "PM-SUD-41"),
      variant("42", "Negro/Blanco", 16, "PM-SUD-42"),
      variant("43", "Negro/Blanco", 12, "PM-SUD-43"),
    ],
  },
  {
    id: "p11",
    brand_id: "b1",
    name: "Nike Zoom Vomero 5 Photon Dust",
    slug: "nike-zoom-vomero-5-photon-dust",
    description: "Running retro con amortiguación Zoom Air. El colorway Photon Dust es el favorito de los entusiastas del techwear.",
    price: 159990,
    sale_price: 139990,
    category: "Running",
    is_featured: false,
    is_drop: false,
    created_at: "2024-09-10T00:00:00Z",
    updated_at: "2024-09-10T00:00:00Z",
    brand: { name: "Nike" },
    brands: { name: "Nike" },
    images: [
      img("/Mujer 1.png", true, 0),
      img("/hero_new.jpg", false, 1),
    ],
    variants: [
      variant("40", "Gris Plata", 10, "NK-ZM5-40"),
      variant("41", "Gris Plata", 12, "NK-ZM5-41"),
      variant("42", "Gris Plata", 14, "NK-ZM5-42"),
      variant("43", "Gris Plata", 11, "NK-ZM5-43"),
      variant("44", "Gris Plata", 8, "NK-ZM5-44"),
    ],
  },
  {
    id: "p12",
    brand_id: "b4",
    name: "New Balance 9060 Sea Salt",
    slug: "new-balance-9060-sea-salt",
    description: "Silueta chunky con inspiración en los 990 y 860. La entresuela ABZORB y SBS ofrece confort todo el día.",
    price: 169990,
    sale_price: null,
    category: "Lifestyle",
    is_featured: false,
    is_drop: false,
    created_at: "2024-08-25T00:00:00Z",
    updated_at: "2024-08-25T00:00:00Z",
    brand: { name: "New Balance" },
    brands: { name: "New Balance" },
    images: [
      img("/Hero New.png", true, 0),
      img("/Hombre 1.png", false, 1),
    ],
    variants: [
      variant("38", "Sea Salt/Gris", 8, "NB-9060-38"),
      variant("39", "Sea Salt/Gris", 10, "NB-9060-39"),
      variant("40", "Sea Salt/Gris", 12, "NB-9060-40"),
      variant("41", "Sea Salt/Gris", 9, "NB-9060-41"),
      variant("42", "Sea Salt/Gris", 7, "NB-9060-42"),
      variant("43", "Sea Salt/Gris", 5, "NB-9060-43"),
    ],
  },
];

export const seedOrders: MockOrder[] = [
  {
    id: "ord-001",
    user_id: "u1",
    total_amount: 189990,
    status: "delivered",
    created_at: "2025-04-20T10:30:00Z",
    shipping_details: { full_name: "Juan Pérez", address: "Av. Providencia 1234", city: "Santiago", region: "RM" },
    order_items: [
      { quantity: 1, unit_price: 189990, product_name: "Air Jordan 1 High OG Chicago" },
    ],
  },
  {
    id: "ord-002",
    user_id: "u2",
    total_amount: 239980,
    status: "shipped",
    created_at: "2025-04-28T14:15:00Z",
    shipping_details: { full_name: "María González", address: "Calle Larga 567", city: "Valparaíso", region: "Valparaíso" },
    order_items: [
      { quantity: 2, unit_price: 109990, product_name: "Nike Dunk Low Retro White Black" },
    ],
  },
  {
    id: "ord-003",
    user_id: null,
    total_amount: 129990,
    status: "processing",
    created_at: "2025-05-01T09:00:00Z",
    shipping_details: { full_name: "Pedro Soto", address: "Los Alerces 89", city: "Concepción", region: "Biobío" },
    order_items: [
      { quantity: 1, unit_price: 129990, product_name: "Adidas Samba OG" },
    ],
  },
  {
    id: "ord-004",
    user_id: "u3",
    total_amount: 449980,
    status: "paid",
    created_at: "2025-05-03T16:45:00Z",
    shipping_details: { full_name: "Ana López", address: "Las Condes 4321", city: "Santiago", region: "RM" },
    order_items: [
      { quantity: 1, unit_price: 229990, product_name: "Jordan 4 Retro Thunder" },
      { quantity: 1, unit_price: 139990, product_name: "New Balance 550 White Green" },
    ],
  },
  {
    id: "ord-005",
    user_id: "u1",
    total_amount: 79990,
    status: "pending",
    created_at: "2025-05-06T11:20:00Z",
    shipping_details: { full_name: "Juan Pérez", address: "Av. Providencia 1234", city: "Santiago", region: "RM" },
    order_items: [
      { quantity: 1, unit_price: 79990, product_name: "Puma Suede Classic XXI" },
    ],
  },
];

export const seedProfiles: MockProfile[] = [
  {
    id: "u1",
    role: "customer",
    full_name: "Juan Pérez",
    email: "juan@example.com",
    phone: "+56912345678",
    shipping_address: { address: "Av. Providencia 1234", city: "Santiago", region: "RM" },
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "u2",
    role: "customer",
    full_name: "María González",
    email: "maria@example.com",
    phone: "+56987654321",
    shipping_address: { address: "Calle Larga 567", city: "Valparaíso", region: "Valparaíso" },
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "u3",
    role: "customer",
    full_name: "Ana López",
    email: "ana@example.com",
    phone: "+56911223344",
    shipping_address: { address: "Las Condes 4321", city: "Santiago", region: "RM" },
    created_at: "2024-03-20T00:00:00Z",
    updated_at: "2024-03-20T00:00:00Z",
  },
];

export const seedContentBlocks: MockContentBlock[] = [
  {
    id: "c1",
    key: "hero_title",
    content: "SNEAKHUB | Zapatillas Urbanas Exclusivas",
    type: "text",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "c2",
    key: "hero_subtitle",
    content: "Descubre las zapatillas más exclusivas de Chile. Nike, Jordan, Adidas y más.",
    type: "text",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "c3",
    key: "footer_text",
    content: "© 2025 SNEAKHUB. Todos los derechos reservados.",
    type: "text",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
