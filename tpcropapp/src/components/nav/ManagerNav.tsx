import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User, LogOut, ChevronDown, Calendar, BarChart } from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";

export default function ManagerNav() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success("Đã đăng xuất thành công");
        navigate("/", { replace: true });
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <Link
                to="/seasons"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-xl transition-colors"
            >
                <Calendar className="w-4 h-4" />
                <span>Mùa vụ</span>
            </Link>

            <Link
                to='/account'
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-xl transition-colors"
            >
                <User className="w-4 h-4" />
                <span> Tài khoản </span>
            </Link>

            <Link
                to='/analytics'
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-xl transition-colors"
            >
                <BarChart className="w-4 h-4" />
                <span> Thống kê </span>
            </Link>

            <div className="relative pt-2 md:pt-0 border-t md:border-t-0 border-gray-100" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 md:px-2.5 md:py-1.5 rounded-xl hover:bg-gray-100/80 transition-colors w-full md:w-auto text-left"
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.fullName || user.username}
                            className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {(user?.fullName || user?.username || "N").charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[120px]">
                        {user?.fullName || user?.username}
                    </span>
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {isDropdownOpen && (
                    <div className="static md:absolute md:right-0 md:top-full mt-2 w-full md:w-56 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2.5 border-b border-gray-100">
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                {user?.fullName || user?.username}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                {user?.email || user?.role || "FARMER"}
                            </p>
                        </div>

                        <div className="py-1">
                            <Link
                                to="/profile"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            >
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Thông tin cá nhân</span>
                            </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                            >
                                <LogOut className="w-4 h-4 text-red-400" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
