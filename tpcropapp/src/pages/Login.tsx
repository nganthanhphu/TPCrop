import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Sprout,
    User as UserIcon,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { loginWithPassword } from "@/services/userService";
import type { UserLogin } from "@/types/user";

export default function Login() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const login = useAuthStore((state) => state.login);

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserLogin>();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: UserLogin) => {
        setIsLoading(true);

        try {
            const res = await loginWithPassword(data);
            const { user, token } = res.data;

            login(user, token);
            toast.success(`Đăng nhập thành công! Chào mừng ${user.fullName || user.username}`);
            navigate("/", { replace: true });
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            const errorMsg =
                errorObj.response?.data?.error ||
                errorObj.response?.data?.message ||
                "Tên đăng nhập hoặc mật khẩu không chính xác.";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-emerald-100/80 shadow-xl shadow-emerald-950/5">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-4">
                            <Sprout className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Đăng nhập vào TPCrop
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập tên đăng nhập"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                        errors.username
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    }`}
                                    {...register("username", {
                                        required: "Vui lòng nhập tên đăng nhập",
                                    })}
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu"
                                    className={`w-full pl-10 pr-11 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                                        errors.password
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    }`}
                                    {...register("password", {
                                        required: "Vui lòng nhập mật khẩu",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                <span>Đăng nhập</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Chưa có tài khoản?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>

                        <div>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Quay lại trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
