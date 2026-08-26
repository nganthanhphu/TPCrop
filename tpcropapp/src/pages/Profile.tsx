import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import {
    User as UserIcon,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Camera,
    Loader2,
    ShieldCheck,
    Calendar,
    X,
    UserCheck,
    Pencil,
} from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { getCurrentUser, updateUserProfile } from "@/services/userService";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/formatDate";

interface ProfileFormData {
    fullName: string;
    email: string;
    oldPassword?: string;
    password?: string;
    confirmPassword?: string;
}

export default function Profile() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const storeUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data: currentUserData } = useQuery({
        queryKey: ["currentUserProfile"],
        queryFn: async () => {
            const res = await getCurrentUser();
            return res.data;
        },
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const user: User | null = currentUserData || storeUser;

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        mode: "all",
        defaultValues: {
            fullName: "",
            email: "",
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
    });

    const watchedPassword = useWatch({ control, name: "password" });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const openEditModal = () => {
        if (user) {
            reset({
                fullName: user.fullName || "",
                email: user.email || "",
                oldPassword: "",
                password: "",
                confirmPassword: "",
            });
        }
        setSelectedFile(null);
        setAvatarPreview(null);
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedFile(null);
        setAvatarPreview(null);
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước ảnh không được vượt quá 5MB");
                return;
            }
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeSelectedAvatar = () => {
        setSelectedFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const updateMutation = useMutation({
        mutationFn: async (data: ProfileFormData) => {
            const formData = new FormData();
            formData.append("fullName", data.fullName.trim());
            formData.append("email", data.email.trim());
            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }
            if (data.oldPassword?.trim() && data.password?.trim()) {
                formData.append("oldPassword", data.oldPassword.trim());
                formData.append("password", data.password.trim());
            }
            const res = await updateUserProfile(formData);
            return res.data;
        },
        onSuccess: (updatedUser) => {
            toast.success("Cập nhật thông tin cá nhân thành công!");
            setUser(updatedUser);
            closeEditModal();
            queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
        },
        onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            const errMsg =
                errorObj?.response?.data?.error ||
                errorObj?.response?.data?.message ||
                "Cập nhật thông tin thất bại. Vui lòng thử lại!";
            toast.error(errMsg);
        },
    });

    const onSubmit = (data: ProfileFormData) => {
        updateMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Hồ sơ cá nhân
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Xem và quản lý thông tin tài khoản của bạn
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openEditModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                    >
                        <Pencil className="w-4 h-4" />
                        <span>Chỉnh sửa thông tin</span>
                    </button>
                </div>

                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-lg shadow-emerald-950/5 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-emerald-100 shadow-md bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-3xl shrink-0">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullName || user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>
                                    {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                                    {user?.fullName || user?.username || "Người dùng"}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-center sm:self-auto border border-emerald-200/60">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{user?.role === "MANAGER" ? "Quản lý" : "Nông dân"}</span>
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-gray-500 pt-3 border-t border-gray-100">
                                {user?.joinedDate && (
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>Tham gia: {formatDate(user.joinedDate)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md shadow-emerald-950/5 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Thông tin tài khoản
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                    Tên đăng nhập
                                </span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <span>{user?.username}</span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                    Họ và tên
                                </span>
                                <span className="text-sm font-semibold text-gray-800">
                                    {user?.fullName || "Chưa thiết lập"}
                                </span>
                            </div>

                            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                    Địa chỉ Email
                                </span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <span>{user?.email || "Chưa thiết lập"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md shadow-emerald-950/5 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Thông tin hệ thống
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                    Vai trò
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                                        {user?.role === "MANAGER" ? "Quản lý" : "Nông dân"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                    Trạng thái
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                        <span>{user?.active !== false ? "Đang hoạt động" : "Tạm khóa"}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="p-3.5 bg-gray-50/80 rounded-2xl border border-gray-100">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                    Ngày tạo tài khoản
                                </span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <span>{user?.joinedDate ? formatDate(user.joinedDate) : "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <h2 className="text-xl font-extrabold text-gray-900">
                                Chỉnh sửa thông tin cá nhân
                            </h2>
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto space-y-5 pr-1">
                            <div className="flex flex-col items-center justify-center pb-2">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-2xl shrink-0">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Preview Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.fullName || user.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>
                                                {(user?.fullName || user?.username || "U").charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md transition-all cursor-pointer hover:scale-105"
                                        title="Chọn ảnh mới"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                    />
                                </div>

                                {avatarPreview && (
                                    <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                                        <span>Đã chọn ảnh mới</span>
                                        <button
                                            type="button"
                                            onClick={removeSelectedAvatar}
                                            className="text-amber-600 hover:text-amber-800 cursor-pointer font-bold ml-1"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Tên đăng nhập
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        disabled
                                        value={user?.username || ""}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm text-gray-500 cursor-not-allowed select-none font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <UserIcon className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ và tên đầy đủ..."
                                        {...register("fullName", {
                                            required: "Họ và tên không được để trống",
                                            maxLength: {
                                                value: 100,
                                                message: "Họ và tên không quá 100 ký tự",
                                            },
                                        })}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.fullName ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                            }`}
                                    />
                                </div>
                                {errors.fullName && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Địa chỉ Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Nhập địa chỉ email..."
                                        {...register("email", {
                                            required: "Email không được để trống",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Định dạng email không hợp lệ",
                                            },
                                        })}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.email ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                            }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="pt-3 border-t border-gray-100 space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                                        Đổi mật khẩu
                                    </h4>
                                    <p className="text-[11px] text-gray-400 mb-3">
                                        Để trống nếu bạn không muốn đổi mật khẩu
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Mật khẩu hiện tại
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu hiện tại..."
                                            {...register("oldPassword", {
                                                validate: (val) => {
                                                    if (watchedPassword && !val) {
                                                        return "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới";
                                                    }
                                                    return true;
                                                },
                                            })}
                                            className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.oldPassword ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        >
                                            {showOldPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.oldPassword && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.oldPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Ít nhất 8 ký tự..."
                                                {...register("password", {
                                                    validate: (val) => {
                                                        if (!val) return true;
                                                        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                                                        if (!regex.test(val)) {
                                                            return "Mật khẩu tối thiểu 8 ký tự, có chữ hoa, thường và số";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                                className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.password ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-xs text-red-500 mt-1.5 font-medium">
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Nhập lại mật khẩu..."
                                                {...register("confirmPassword", {
                                                    validate: (val) => {
                                                        if (watchedPassword && val !== watchedPassword) {
                                                            return "Mật khẩu xác nhận không trùng khớp";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                                className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.confirmPassword ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1.5 font-medium">
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    {updateMutation.isPending && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    <span>Lưu thay đổi</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
