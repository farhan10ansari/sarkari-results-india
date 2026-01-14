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
        <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 border-[#1173d4]/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 py-4 md:px-6 lg:px-10 shadow-sm">
            <div className="flex items-center gap-4 md:gap-10">
                <Link href="/" className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1173d4] to-[#0d5aa7] shadow-md md:h-10 md:w-10">
                        <Building2 className="h-5 w-5 flex-shrink-0 text-white md:h-6 md:w-6" />
                    </div>
                    <h2 className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 md:text-xl">
                        <span className="hidden sm:inline">Sarkari Results India</span>
                        <span className="sm:hidden">Sarkari Results</span>
                    </h2>
                </Link>

                <NavLinks navigation={navigation} />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Link
                    href="/admin"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-slate-100 hover:from-[#1173d4] hover:to-[#0d5aa7] dark:from-gray-800 dark:to-slate-800 dark:hover:from-[#1173d4] dark:hover:to-[#0d5aa7] text-gray-600 hover:text-white dark:text-gray-300 dark:hover:text-white md:h-10 md:w-10 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <Building2 className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
                <ThemeToggle />
                <Link
                    href="/settings"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-slate-100 hover:from-[#1173d4] hover:to-[#0d5aa7] dark:from-gray-800 dark:to-slate-800 dark:hover:from-[#1173d4] dark:hover:to-[#0d5aa7] text-gray-600 hover:text-white dark:text-gray-300 dark:hover:text-white md:h-10 md:w-10 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <Settings className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
                <MobileMenu navigation={navigation} />
            </div>
        </header>
    );
}

