
"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    // Default to light mode (false)
    // We removed the system preference check to enforce light mode by default as requested
    useEffect(() => {
        // Optional: Check localStorage if you wanted persistence, but for now strict default
        const isDarkStored = localStorage.getItem("theme") === "dark";
        setIsDark(isDarkStored);
        if (isDarkStored) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    // Note: Actual theme switching logic needs to be implemented via a ThemeProvider or manual class toggling
    // For now, we'll just toggle the state and the 'dark' class on html
    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
        if (newIsDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
        >
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
    );
}
