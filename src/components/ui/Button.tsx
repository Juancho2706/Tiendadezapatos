
"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
            outline: "border-2 border-gray-200 text-gray-900 hover:border-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-100 bg-transparent",
            ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-sm",
            md: "px-5 py-2.5 text-base",
            lg: "px-8 py-3.5 text-lg font-semibold",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export default Button;
