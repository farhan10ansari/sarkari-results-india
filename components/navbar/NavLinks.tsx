"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks({ navigation }: { navigation: Array<{ name: string; href: string }> }) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navigation.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors ${
                        isActive(item.href)
                            ? "font-bold text-[#1173d4]"
                            : "text-gray-600 hover:text-[#1173d4] dark:text-gray-300 dark:hover:text-[#1173d4]"
                    }`}
                >
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}
