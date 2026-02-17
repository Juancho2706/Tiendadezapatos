export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'admin' | 'customer'
                    full_name: string | null
                    phone: string | null
                    shipping_address: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role?: 'admin' | 'customer'
                    full_name?: string | null
                    phone?: string | null
                    shipping_address?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: 'admin' | 'customer'
                    full_name?: string | null
                    phone?: string | null
                    shipping_address?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            brands: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    logo_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    logo_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    logo_url?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    brand_id: string | null
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    sale_price: number | null
                    category: string | null
                    is_featured: boolean
                    is_drop: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    brand_id?: string | null
                    name: string
                    slug: string
                    description?: string | null
                    price: number
                    sale_price?: number | null
                    category?: string | null
                    is_featured?: boolean
                    is_drop?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    brand_id?: string | null
                    name?: string
                    slug?: string
                    description?: string | null
                    price?: number
                    sale_price?: number | null
                    category?: string | null
                    is_featured?: boolean
                    is_drop?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    size: string
                    color: string | null
                    sku: string | null
                    stock_quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    size: string
                    color?: string | null
                    sku?: string | null
                    stock_quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    size?: string
                    color?: string | null
                    sku?: string | null
                    stock_quantity?: number
                    created_at?: string
                }
            }
            product_images: {
                Row: {
                    id: string
                    product_id: string
                    url: string
                    is_main: boolean
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    url: string
                    is_main?: boolean
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    product_id?: string
                    url?: string
                    is_main?: boolean
                    display_order?: number | null
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string | null
                    status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount: number
                    payment_id: string | null
                    shipping_details: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount?: number
                    payment_id?: string | null
                    shipping_details?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
                    total_amount?: number
                    payment_id?: string | null
                    shipping_details?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    variant_id: string | null
                    quantity: number
                    unit_price: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    variant_id?: string | null
                    quantity?: number
                    unit_price: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    variant_id?: string | null
                    quantity?: number
                    unit_price?: number
                    created_at?: string
                }
            }
            cart_items: {
                Row: {
                    id: string
                    cart_id: string
                    product_id: string
                    variant_id: string | null
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    cart_id: string
                    product_id: string
                    variant_id?: string | null
                    quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    cart_id?: string
                    product_id?: string
                    variant_id?: string | null
                    quantity?: number
                    created_at?: string
                }
            }
            carts: {
                Row: {
                    id: string
                    user_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            content_blocks: {
                Row: {
                    id: string
                    section_name: string
                    title: string | null
                    subtitle: string | null
                    button_text: string | null
                    button_link: string | null
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    section_name: string
                    title?: string | null
                    subtitle?: string | null
                    button_text?: string | null
                    button_link?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    section_name?: string
                    title?: string | null
                    subtitle?: string | null
                    button_text?: string | null
                    button_link?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
