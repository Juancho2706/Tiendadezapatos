
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { dictionary, Locale } from "@/lib/dictionary";

interface LanguageContextType {
    locale: Locale;
    toggleLanguage: () => void;
    t: typeof dictionary.es;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>("es");

    const toggleLanguage = () => {
        setLocale((prev) => (prev === "es" ? "en" : "es"));
    };

    const t = dictionary[locale];

    return (
        <LanguageContext.Provider value={{ locale, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
