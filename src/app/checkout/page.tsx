"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Truck, Shield, CreditCard, ChevronRight } from "lucide-react";
import { formatCLP } from "@/lib/utils";

const steps = ["Datos", "Envío", "Pago"];

export default function CheckoutPage() {
    const { items, subtotal } = useCart();
    const [currentStep, setCurrentStep] = useState(0);



    const shipping = subtotal >= 50000 ? 0 : 5990;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8">

                {/* Back link */}
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Seguir Comprando
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-display font-black uppercase tracking-[-0.03em] mb-10"
                >
                    Checkout
                </motion.h1>

                {/* Progress Steps */}
                <div className="flex items-center gap-2 mb-12">
                    {steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentStep(i)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${i === currentStep
                                    ? "bg-[var(--color-neon)] text-black"
                                    : i < currentStep
                                        ? "bg-white/10 text-white"
                                        : "bg-transparent text-zinc-600 border border-white/10"
                                    }`}
                            >
                                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                                    {i + 1}
                                </span>
                                {step}
                            </button>
                            {i < steps.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-zinc-700" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Form */}
                    <div className="lg:col-span-3 space-y-6">
                        {currentStep === 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Datos Personales</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input placeholder="Nombre" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                    <input placeholder="Apellido" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                </div>
                                <input placeholder="Email" type="email" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                <input placeholder="Teléfono" type="tel" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Dirección de Envío</h2>
                                <input placeholder="Dirección" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input placeholder="Ciudad" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                    <input placeholder="Región" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                </div>
                                <input placeholder="Código Postal" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />

                                {/* Shipping info */}
                                <div className="flex items-center gap-3 p-4 bg-[#141414] border border-white/5 rounded-lg mt-4">
                                    <Truck className="w-5 h-5 text-[var(--color-neon)]" />
                                    <div>
                                        <p className="text-sm font-bold">
                                            {shipping === 0 ? "¡Envío Gratis!" : `Envío: ${formatCLP(shipping)}`}
                                        </p>
                                        <p className="text-[10px] text-zinc-500">
                                            {shipping === 0 ? "Pedido supera $50.000" : "Envío gratis en pedidos +$50.000"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-5"
                            >
                                <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Método de Pago</h2>
                                <div className="flex items-center gap-3 p-4 bg-[#141414] border border-[var(--color-neon)]/30 rounded-lg cursor-pointer">
                                    <CreditCard className="w-5 h-5 text-[var(--color-neon)]" />
                                    <div>
                                        <p className="text-sm font-bold">Tarjeta de Crédito / Débito</p>
                                        <p className="text-[10px] text-zinc-500">Visa, Mastercard, American Express</p>
                                    </div>
                                </div>
                                <input placeholder="Número de Tarjeta" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="MM / AA" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                    <input placeholder="CVV" className="bg-[#141414] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors w-full" />
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-2">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Pago seguro con encriptación SSL de 256-bit</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-4">
                            {currentStep > 0 && (
                                <button
                                    onClick={() => setCurrentStep((s) => s - 1)}
                                    className="border border-white/10 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                                >
                                    Atrás
                                </button>
                            )}
                            {currentStep < 2 ? (
                                <button
                                    onClick={() => setCurrentStep((s) => s + 1)}
                                    className="flex-1 bg-[var(--color-neon)] text-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all"
                                >
                                    Continuar
                                </button>
                            ) : (
                                <button className="flex-1 bg-[var(--color-neon)] text-black px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all">
                                    Confirmar Pedido — {formatCLP(total)}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-28 bg-[#141414] border border-white/5 rounded-xl p-6">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-5">Resumen del Pedido</h3>

                            {items.length === 0 ? (
                                <p className="text-sm text-zinc-500">Tu carrito está vacío</p>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                        {items.map((item) => (
                                            <div key={`${item.id}-${item.size}`} className="flex gap-3">
                                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0a0a0a] shrink-0 border border-white/5">
                                                    <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{item.name}</p>
                                                    <p className="text-[10px] text-zinc-500">Talla {item.size} × {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-bold whitespace-nowrap">{formatCLP(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/5 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Subtotal</span>
                                            <span>{formatCLP(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Envío</span>
                                            <span className={shipping === 0 ? "text-green-400" : ""}>
                                                {shipping === 0 ? "Gratis" : formatCLP(shipping)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-base font-black pt-2 border-t border-white/5 mt-2">
                                            <span>Total</span>
                                            <span className="text-[var(--color-neon)]">{formatCLP(total)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
