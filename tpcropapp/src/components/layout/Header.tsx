import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
export default function Header({ children }: { children?: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
            <a href="/" className="text-3xl font-bold text-green-600">
                TPCrop
            </a>

            <div className="flex items-center gap-4">
                <nav className="hidden md:flex items-center gap-4">
                    <Link to="/articles" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                        Bài viết
                    </Link>
                    {children}
                </nav>

                <div className="relative" ref={menuRef}>
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {isMenuOpen && (
                        <nav className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 md:hidden">
                            <Link to="/articles" className="block px-4 py-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                Bài viết
                            </Link>
                            {children}
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}
