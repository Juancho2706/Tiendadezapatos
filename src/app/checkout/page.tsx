
"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-24 h-24 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Thank you for your purchase. Your order #12345 has been placed successfully.
                </p>
                <div className="pt-6">
                    <Link href="/">
                        <Button size="lg" className="w-full">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
