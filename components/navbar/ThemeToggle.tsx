"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-[#1173d4]/10 dark:bg-gray-800 dark:hover:bg-[#1173d4]/20 text-gray-600 dark:text-gray-300 md:h-10 md:w-10">
                    {theme === "dark" ? (
                        <Moon className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                        <Sun className="h-4 w-4 md:h-5 md:w-5" />
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Settings className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
