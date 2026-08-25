import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Users as UsersIcon,
    User as UserIcon,
    Plus,
    X,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    Calendar,
    Mail,
    UserCheck,
    Lock,
    Eye,
    EyeOff,
    Camera,
    AlertTriangle,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import { getAllUsers, updateUserByManager, register as createUserApi } from "@/services/userService";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/formatDate";

interface CreateUserFormData {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role: string;
}

export default function Users() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const currentUser = useAuthStore((state) => state.user);

    const [page, setPage] = useState(0);
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [managerUserActiveToggle, setManagerUserActiveToggle] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        defaultValues: {
            username: "",
            password: "",
            fullName: "",
            email: "",
            role: "FARMER",
        },
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const {
        data: usersData,
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useQuery({
        queryKey: ["allUsers", page],
        queryFn: async () => {
            const res = await getAllUsers({
                page,
                size: pageSize,
            });
            return res.data;
        },
        enabled: isAuthenticated && currentUser?.role === "MANAGER",
    });

    const users: User[] = usersData?.content || [];
    const totalPages = usersData?.totalPages || 1;

    const openAddModal = () => {
        reset({
            username: "",
            password: "",
            fullName: "",
            email: "",
            role: "FARMER",
        });
        setSelectedFile(null);
        setAvatarPreview(null);
        setShowPassword(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setSelectedFile(null);
        setAvatarPreview(null);
        setShowPassword(false);
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

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ userId, active }: { userId: number; active: boolean }) => {
            const res = await updateUserByManager(userId, { active });
            return res.data;
        },
        onSuccess: (updatedUser) => {
            toast.success(
                `Đã ${updatedUser.active ? "mở khóa" : "tạm khóa"} tài khoản "${updatedUser.fullName || updatedUser.username}" thành công!`
            );
            setManagerUserActiveToggle(null);
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        },
        onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            const errMsg =
                errorObj?.response?.data?.error ||
                errorObj?.response?.data?.message ||
                "Thay đổi trạng thái tài khoản thất bại. Vui lòng thử lại!";
            toast.error(errMsg);
        },
    });

    const createUserMutation = useMutation({
        mutationFn: async (data: CreateUserFormData) => {
            const formData = new FormData();
            formData.append("username", data.username.trim());
            formData.append("password", data.password.trim());
            formData.append("fullName", data.fullName.trim());
            formData.append("email", data.email.trim());
            formData.append("role", data.role);
            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }
            const res = await createUserApi(formData);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Tạo người dùng mới thành công!");
            closeAddModal();
            queryClient.invalidateQueries({ queryKey: ["allUsers"] });
        },
        onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            const errMsg =
                errorObj?.response?.data?.error ||
                errorObj?.response?.data?.message ||
                "Tạo người dùng thất bại. Vui lòng thử lại!";
            toast.error(errMsg);
        },
    });

    const handleToggleStatus = (targetUser: User) => {
        if (targetUser.role === "MANAGER") {
            setManagerUserActiveToggle(targetUser);
        } else {
            toggleStatusMutation.mutate({
                userId: targetUser.id,
                active: !targetUser.active,
            });
        }
    };

    const confirmManagerStatusToggle = () => {
        if (managerUserActiveToggle) {
            toggleStatusMutation.mutate({
                userId: managerUserActiveToggle.id,
                active: !managerUserActiveToggle.active,
            });
        }
    };

    const onSubmitAdd = (data: CreateUserFormData) => {
        if (!selectedFile) {
            toast.error("Vui lòng chọn ảnh đại diện cho người dùng!");
            return;
        }
        createUserMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Quản lý người dùng
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-500 ml-11">
                            Danh sách tài khoản đang hoạt động trên hệ thống
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm người dùng</span>
                    </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-lg shadow-emerald-950/5 overflow-hidden">
                    {isUsersLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                            <p className="text-sm text-gray-500 font-medium">
                                Đang tải danh sách người dùng...
                            </p>
                        </div>
                    ) : isUsersError ? (
                        <div className="p-12 text-center">
                            <p className="text-sm text-red-500 font-semibold mb-2">
                                Không thể tải danh sách người dùng.
                            </p>
                            <button
                                type="button"
                                onClick={() => queryClient.invalidateQueries({ queryKey: ["allUsers"] })}
                                className="text-xs text-emerald-600 hover:underline font-bold"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center">
                            <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-700 mb-1">
                                Chưa có người dùng nào
                            </h3>
                            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                                Hệ thống chưa có người dùng nào được tạo.
                            </p>
                            <button
                                type="button"
                                onClick={openAddModal}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Thêm người dùng đầu tiên</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            <th className="py-4 px-6">Người dùng</th>
                                            <th className="py-4 px-6">Địa chỉ Email</th>
                                            <th className="py-4 px-6 text-center">Vai trò</th>
                                            <th className="py-4 px-6 text-center">Ngày tham gia</th>
                                            <th className="py-4 px-6 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {users.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="hover:bg-emerald-50/30 transition-colors"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                                                            {u.avatar ? (
                                                                <img
                                                                    src={u.avatar}
                                                                    alt={u.fullName || u.username}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {(u.fullName || u.username || "U").charAt(0).toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight">
                                                                {u.fullName || "Chưa thiết lập"}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                @{u.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-gray-600 font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        <span>{u.email || "—"}</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-center text-gray-700 font-semibold text-xs">
                                                    {u.role === "MANAGER" ? "Quản lý" : "Nông dân"}
                                                </td>

                                                <td className="py-4 px-6 text-center text-gray-500 font-medium text-xs">
                                                    <div className="inline-flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                        <span>{u.joinedDate ? formatDate(u.joinedDate) : "—"}</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        type="button"
                                                        disabled={toggleStatusMutation.isPending}
                                                        onClick={() => handleToggleStatus(u)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            u.active
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80 hover:border-emerald-300"
                                                                : "bg-red-50 text-red-700 border border-red-200/80 hover:bg-red-100/80 hover:border-red-300"
                                                        }`}
                                                        title={u.active ? "Nhấn để tạm khóa tài khoản" : "Nhấn để mở khóa tài khoản"}
                                                    >
                                                        {u.active ? (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span>Đang hoạt động</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="w-3.5 h-3.5 text-red-600" />
                                                                <span>Tạm khóa</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50/40">
                                <Pagination
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    isLoading={isUsersLoading}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {managerUserActiveToggle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-100 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-7 h-7" />
                        </div>

                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                            Cảnh báo hành động
                        </h3>

                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Bạn đang chuẩn bị {managerUserActiveToggle.active ? "tạm khóa" : "mở khóa"} tài khoản có vai trò <strong>Quản lý</strong> (
                            {managerUserActiveToggle.fullName} - @{managerUserActiveToggle.username}
                            ). Bạn có chắc chắn muốn tiếp tục?
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setManagerUserActiveToggle(null)}
                                disabled={toggleStatusMutation.isPending}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                onClick={confirmManagerStatusToggle}
                                disabled={toggleStatusMutation.isPending}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-md shadow-amber-600/25 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                {toggleStatusMutation.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                <span>Xác nhận</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-gray-900">
                                        Thêm người dùng mới
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        Tạo tài khoản mới trên hệ thống
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeAddModal}
                                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmitAdd)} className="flex flex-col flex-1 overflow-y-auto space-y-4 pr-1">
                            <div className="flex flex-col items-center justify-center pb-2">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-200 shadow-sm bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-2xl shrink-0">
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Preview Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="w-8 h-8 text-emerald-600" />
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md transition-all cursor-pointer hover:scale-105"
                                        title="Chọn ảnh đại diện"
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

                                {avatarPreview ? (
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                                        <span>Đã chọn ảnh</span>
                                        <button
                                            type="button"
                                            onClick={removeSelectedAvatar}
                                            className="text-red-500 hover:text-red-700 cursor-pointer font-bold ml-1"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-gray-400 mt-1.5">
                                        Ảnh đại diện <span className="text-red-500">*</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Tên đăng nhập <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên đăng nhập..."
                                        {...register("username", {
                                            required: "Tên đăng nhập không được để trống",
                                            maxLength: {
                                                value: 50,
                                                message: "Tên đăng nhập không quá 50 ký tự",
                                            },
                                        })}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                                            errors.username ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ít nhất 8 ký tự..."
                                        {...register("password", {
                                            required: "Mật khẩu không được để trống",
                                            validate: (val) => {
                                                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                                                if (!regex.test(val)) {
                                                    return "Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
                                                }
                                                return true;
                                            },
                                        })}
                                        className={`w-full pl-10 pr-11 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                                            errors.password ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? (
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
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                                            errors.fullName ? "border-red-400 bg-red-50/20" : "border-gray-200"
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
                                        placeholder="example@domain.com"
                                        {...register("email", {
                                            required: "Email không được để trống",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Định dạng email không hợp lệ",
                                            },
                                        })}
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                                            errors.email ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Vai trò <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <select
                                        {...register("role", {
                                            required: "Vui lòng chọn vai trò",
                                        })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer font-medium"
                                    >
                                        <option value="FARMER">Nông dân</option>
                                        <option value="MANAGER">Quản lý</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={createUserMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    {createUserMutation.isPending && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    <span>Tạo</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
