import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Newspaper } from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { getNavByRole } from "@/utils/navConfig";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navContent = getNavByRole(user?.role, isAuthenticated);

    return (
        <header className="flex items-center justify-between h-16 px-4 md:px-8 border-b border-gray-200 bg-white sticky top-0 z-40">
            <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                TPCrop
            </Link>

            <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center gap-4">
                    <Link
                        to="/articles"
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-xl transition-colors"
                    >
                        <Newspaper className="w-4 h-4" />
                        <span>Bài viết</span>
                    </Link>
                    {navContent}
                </nav>

                <div className="relative" ref={menuRef}>
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>

                    {isMenuOpen && (
                        <nav className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 px-2 md:hidden flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                            <Link
                                to="/articles"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                            >
                                <Newspaper className="w-4 h-4" />
                                <span>Bài viết</span>
                            </Link>
                            {navContent}
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}
