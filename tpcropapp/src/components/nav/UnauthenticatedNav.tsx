import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function UnauthenticatedNav() {
    return (
        <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full md:w-auto"
        >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập</span>
        </Link>
    );
}
