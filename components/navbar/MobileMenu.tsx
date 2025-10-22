"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileMenu({ navigation }: { navigation: Array<{ name: string; href: string }> }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-[#1173d4]/10 hover:bg-[#1173d4]/20 text-[#1173d4] lg:hidden">
                    <Menu className="h-5 w-5" />
                </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col gap-6 pt-8">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Menu</h3>
                    <nav className="flex flex-col gap-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? "bg-[#1173d4]/10 font-bold text-[#1173d4]"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-[#1173d4] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-[#1173d4]"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
