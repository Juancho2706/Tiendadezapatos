
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
    const { locale, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle Language"
        >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium uppercase">{locale}</span>
        </button>
    );
}
