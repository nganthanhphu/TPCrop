import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Sprout,
    User as UserIcon,
    UserCheck,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Camera,
    Loader2,
    ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { register as registerUser } from "@/services/userService";

interface RegisterFormData {
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar: FileList;
}

export default function Register() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const login = useAuthStore((state) => state.login);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const avatarRegister = register("avatar", {
        validate: (files) => {
            if (!files || files.length === 0) {
                return "Vui lòng chọn ảnh đại diện";
            }
            return true;
        },
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    toast.error("Kích thước ảnh không được vượt quá 5MB");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setAvatarPreview(null);
            }
        },
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: RegisterFormData) => {
        if (!data.avatar || data.avatar.length === 0) {
            toast.error("Vui lòng chọn ảnh đại diện.");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName.trim());
            formData.append("username", data.username.trim());
            formData.append("email", data.email.trim());
            formData.append("password", data.password);
            formData.append("avatar", data.avatar[0]);
            formData.append("role", "FARMER");

            const res = await registerUser(formData);
            const { user, token } = res.data;

            login(user, token);
            toast.success(`Đăng ký tài khoản thành công! Chào mừng ${user.fullName || user.username}`);
            navigate("/", { replace: true });
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            const errorMsg =
                errorObj.response?.data?.error ||
                errorObj.response?.data?.message ||
                "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-emerald-100/80 shadow-xl shadow-emerald-950/5">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-4">
                            <Sprout className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Đăng ký tài khoản TPCrop
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col items-center justify-center mb-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-24 h-24 rounded-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/60 flex items-center justify-center cursor-pointer overflow-hidden group transition-colors shadow-inner"
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-emerald-600">
                                        <Camera className="w-8 h-8 mb-1 opacity-70 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-[10px] font-semibold text-emerald-700">Chọn ảnh</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <Camera className="w-6 h-6" />
                                </div>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                {...avatarRegister}
                                ref={(e) => {
                                    avatarRegister.ref(e);
                                    fileInputRef.current = e;
                                }}
                            />
                            {errors.avatar && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.avatar.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập họ và tên đầy đủ"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.fullName
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    {...register("fullName", {
                                        required: "Vui lòng nhập họ và tên",
                                        maxLength: { value: 100, message: "Họ và tên không quá 100 ký tự" },
                                    })}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập tên đăng nhập (viết liền không dấu)"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.username
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    {...register("username", {
                                        required: "Vui lòng nhập tên đăng nhập",
                                        maxLength: { value: 50, message: "Tên đăng nhập không quá 50 ký tự" },
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
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="example@domain.com"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.email
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    {...register("email", {
                                        required: "Vui lòng nhập email",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Định dạng email không hợp lệ",
                                        },
                                        maxLength: { value: 100, message: "Email không quá 100 ký tự" },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ít nhất 8 ký tự (gồm hoa, thường, số)"
                                    className={`w-full pl-10 pr-11 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.password
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    {...register("password", {
                                        required: "Vui lòng nhập mật khẩu",
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                            message: "Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
                                        },
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

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu"
                                    className={`w-full pl-10 pr-11 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.confirmPassword
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    {...register("confirmPassword", {
                                        required: "Vui lòng xác nhận mật khẩu",
                                        validate: (value) =>
                                            value === getValues("password") || "Mật khẩu xác nhận không trùng khớp",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-500 font-medium">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 disabled:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Đang tạo tài khoản...</span>
                                </>
                            ) : (
                                <span>Đăng ký tài khoản</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors"
                            >
                                Đăng nhập ngay
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
