import { Building2, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Schemes", href: "/schemes" },
    { name: "Results", href: "/results" },
    { name: "Admission", href: "/admissions" },
    { name: "Upcoming", href: "/upcoming" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#1173d4]/20 bg-background px-4 py-4 md:px-6 lg:px-10">
            <div className="flex items-center gap-4 md:gap-10">
                <Link href="/" className="flex items-center gap-2 text-[#1173d4] md:gap-3">
                    <Building2 className="h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
                    <h2 className="text-base font-bold text-gray-800 dark:text-white md:text-xl">
                        <span className="hidden sm:inline">Sarkari Results India</span>
                        <span className="sm:hidden">Sarkari Results</span>
                    </h2>
                </Link>

                <NavLinks navigation={navigation} />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Link
                    href="/admin"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-[#1173d4]/10 dark:bg-gray-800 dark:hover:bg-[#1173d4]/20 text-gray-600 dark:text-gray-300 md:h-10 md:w-10"
                >
                    <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
                <ThemeToggle />
                <Link
                    href="/settings"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gray-100 hover:bg-[#1173d4]/10 dark:bg-gray-800 dark:hover:bg-[#1173d4]/20 text-gray-600 dark:text-gray-300 md:h-10 md:w-10"
                >
                    <Settings className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
                <MobileMenu navigation={navigation} />
            </div>
        </header>
    );
}

