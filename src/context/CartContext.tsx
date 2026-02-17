"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: number;
    color: string;
    variant_id?: string; // Optional for now, but needed for DB
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string | number, size: number, color: string) => void;
    updateQuantity: (id: string | number, size: number, color: string, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const supabase = createSupabaseBrowserClient();

    // Load from LocalStorage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    // Sync to LocalStorage whenever items change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    // TODO: Implement full auth sync.
    // Ideally, we check if user is logged in.
    // If yes, we fetch their cart from 'carts' table.
    // If they have local items, we might merge them or prompt.
    // For now, we keep the LocalStorage logic as the visual source of truth
    // to ensure the UI remains responsive, but we could add background sync here.

    /* 
    useEffect(() => {
      const syncCart = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;
        
        // Fetch DB cart...
        // Merge...
      };
      if(isMounted) syncCart();
    }, [isMounted]);
    */

    const addItem = (newItem: CartItem) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }

            return [...currentItems, newItem];
        });
        setIsOpen(true);
    };

    const removeItem = (id: string | number, size: number, color: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => !(item.id === id && item.size === size && item.color === color))
        );
    };

    const updateQuantity = (id: string | number, size: number, color: string, quantity: number) => {
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.id === id && item.size === size && item.color === color
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        );
    };

    const clearCart = () => setItems([]);
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isOpen,
                openCart,
                closeCart,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
