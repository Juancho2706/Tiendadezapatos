
"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, subtotal, isOpen, closeCart } = useCart();
    const { t } = useLanguage();

    // Helper to format currency
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeCart}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-xl">
                                        <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-100">
                                            <Dialog.Title className="text-lg font-black uppercase tracking-widest text-black">
                                                {t.cart.title}
                                            </Dialog.Title>
                                            <div className="ml-3 flex h-7 items-center">
                                                <button
                                                    type="button"
                                                    className="relative -m-2 p-2 text-gray-400 hover:text-black transition-colors"
                                                    onClick={closeCart}
                                                >
                                                    <span className="absolute -inset-0.5" />
                                                    <span className="sr-only">Close panel</span>
                                                    <X className="h-6 w-6" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            {items.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                                    <p className="text-gray-500">{t.cart.empty}</p>
                                                    <button
                                                        onClick={closeCart}
                                                        className="text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors uppercase tracking-wider"
                                                    >
                                                        {t.cart.continueShopping}
                                                    </button>
                                                </div>
                                            ) : (
                                                <ul role="list" className="-my-6 divide-y divide-gray-100">
                                                    {items.map((item) => (
                                                        <li key={`${item.id}-${item.size}-${item.color}`} className="flex py-6">
                                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-gray-100">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    width={96}
                                                                    height={96}
                                                                    className="h-full w-full object-cover object-center"
                                                                />
                                                            </div>

                                                            <div className="ml-4 flex flex-1 flex-col">
                                                                <div>
                                                                    <div className="flex justify-between text-base font-bold text-black uppercase tracking-tight">
                                                                        <h3>
                                                                            <Link href={`/product/${item.id}`} onClick={closeCart}>{item.name}</Link>
                                                                        </h3>
                                                                        <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                                                                    </div>
                                                                    <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
                                                                        {t.product.selectSize.replace('(EU)', '')}: {item.size}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                                    <div className="flex items-center border border-gray-300">
                                                                        <button
                                                                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                                                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                                            disabled={item.quantity <= 1}
                                                                        >
                                                                            <Minus className="w-3 h-3" />
                                                                        </button>
                                                                        <span className="px-3 font-medium text-xs">{item.quantity}</span>
                                                                        <button
                                                                            onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                                                            className="p-2 hover:bg-gray-100 transition-colors"
                                                                        >
                                                                            <Plus className="w-3 h-3" />
                                                                        </button>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeItem(item.id, item.size, item.color)}
                                                                        className="font-medium text-gray-400 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {items.length > 0 && (
                                            <div className="border-t border-gray-100 px-4 py-6 sm:px-6 bg-gray-50/50">
                                                <div className="flex justify-between text-base font-bold text-black uppercase tracking-widest mb-4">
                                                    <p>{t.cart.subtotal}</p>
                                                    <p>{formatPrice(subtotal)}</p>
                                                </div>
                                                <p className="mt-0.5 text-xs text-gray-500 mb-6">
                                                    {t.cart.shippingNote}
                                                </p>
                                                <Link
                                                    href="/checkout"
                                                    className="flex items-center justify-center w-full bg-black px-6 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-gray-900 transition-colors"
                                                    onClick={closeCart}
                                                >
                                                    {t.cart.checkout}
                                                </Link>
                                                <div className="mt-6 flex justify-center text-center text-xs text-gray-500">
                                                    <button
                                                        type="button"
                                                        className="font-medium hover:text-black underline uppercase tracking-wider transition-colors"
                                                        onClick={closeCart}
                                                    >
                                                        {t.cart.continueShopping}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
