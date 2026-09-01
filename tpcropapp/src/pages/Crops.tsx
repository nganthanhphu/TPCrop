import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Sprout,
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    AlertCircle,
    Loader2,
    Bot,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import {
    getCrops,
    addCrop,
    updateCrop,
    deleteCrop,
} from "@/services/cropService";
import type { Crop } from "@/types/crop";

interface CropFormData {
    name: string;
    isSupportChatbot: boolean;
}

export default function Crops() {
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
    const [deletingCrop, setDeletingCrop] = useState<Crop | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CropFormData>({
        defaultValues: {
            name: "",
            isSupportChatbot: false,
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword);
            setPage(0);
        }, 400);

        return () => {
            clearTimeout(timer);
        };
    }, [keyword]);

    const {
        data: cropsData,
        isLoading: isCropsLoading,
        isError: isCropsError,
        refetch: refetchCrops,
    } = useQuery({
        queryKey: ["crops", page, debouncedKeyword],
        queryFn: async () => {
            const res = await getCrops({
                page,
                size: pageSize,
                name: debouncedKeyword.trim() || undefined,
            });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const crops: Crop[] = cropsData?.content || [];
    const totalPages = cropsData?.totalPages || 1;

    const openAddModal = () => {
        setEditingCrop(null);
        reset({
            name: "",
            isSupportChatbot: false,
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (crop: Crop) => {
        setEditingCrop(crop);
        reset({
            name: crop.name,
            isSupportChatbot: crop.isSupportChatbot ?? false,
        });
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingCrop(null);
        reset();
    };

    const saveMutation = useMutation({
        mutationFn: async (data: CropFormData) => {
            if (editingCrop) {
                return updateCrop(editingCrop.id, {
                    name: data.name.trim(),
                    isSupportChatbot: data.isSupportChatbot,
                });
            } else {
                return addCrop({
                    name: data.name.trim(),
                });
            }
        },
        onSuccess: () => {
            toast.success(
                editingCrop
                    ? "Cập nhật cây trồng thành công!"
                    : "Thêm cây trồng mới thành công!"
            );
            closeFormModal();
            queryClient.invalidateQueries({ queryKey: ["crops"] });
            queryClient.invalidateQueries({ queryKey: ["allCrops"] });
        },
        onError: () => {
            toast.error(
                editingCrop
                    ? "Cập nhật cây trồng thất bại. Vui lòng thử lại!"
                    : "Thêm cây trồng thất bại. Vui lòng thử lại!"
            );
        },
    });

    const onSubmit = (data: CropFormData) => {
        saveMutation.mutate(data);
    };

    const deleteMutation = useMutation({
        mutationFn: async (cropId: number) => {
            return deleteCrop(cropId);
        },
        onSuccess: () => {
            toast.success("Đã xóa cây trồng thành công!");
            setDeletingCrop(null);
            queryClient.invalidateQueries({ queryKey: ["crops"] });
            queryClient.invalidateQueries({ queryKey: ["allCrops"] });
        },
        onError: () => {
            toast.error("Không thể xóa cây trồng. Vui lòng thử lại sau!");
        },
    });

    const confirmDelete = () => {
        if (deletingCrop) {
            deleteMutation.mutate(deletingCrop.id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Quản lý cây trồng
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Danh mục các loại cây trồng trong hệ thống
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="h-11 inline-flex items-center gap-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm cây trồng mới</span>
                    </button>
                </div>

                <div className="flex justify-end items-center mb-6">
                    <div className="relative flex items-center w-full sm:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm kiếm theo tên cây trồng..."
                            className="w-full h-11 pl-9.5 pr-9 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
                        />
                        {keyword && (
                            <button
                                onClick={() => {
                                    setKeyword("");
                                    setDebouncedKeyword("");
                                    setPage(0);
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md shadow-emerald-950/5 overflow-hidden">
                    {isCropsLoading ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3, 4, 5].map((idx) => (
                                <div
                                    key={idx}
                                    className="h-16 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-between px-6"
                                >
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                </div>
                            ))}
                        </div>
                    ) : isCropsError ? (
                        <div className="text-center py-16 px-4">
                            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Không thể tải danh sách cây trồng
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Đã xảy ra lỗi khi kết nối máy chủ. Vui lòng thử lại!
                            </p>
                            <button
                                onClick={() => refetchCrops()}
                                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : crops.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                <Sprout className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                {debouncedKeyword
                                    ? "Không tìm thấy cây trồng phù hợp"
                                    : "Chưa có cây trồng nào"}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                {debouncedKeyword
                                    ? `Không có kết quả nào khớp với "${debouncedKeyword}".`
                                    : "Hãy thêm cây trồng đầu tiên vào hệ thống."}
                            </p>
                            {!debouncedKeyword && (
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Thêm cây trồng mới</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Tên cây trồng</th>
                                        <th className="py-4 px-6 text-center">Hỗ trợ Chatbot</th>
                                        <th className="py-4 px-6 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {crops.map((crop) => (
                                        <tr
                                            key={crop.id}
                                            className="hover:bg-emerald-50/30 transition-colors group"
                                        >
                                            <td className="py-4.5 px-6 font-bold text-gray-900 leading-snug">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                        <Sprout className="w-5 h-5" />
                                                    </div>
                                                    <span className="group-hover:text-emerald-700 transition-colors text-base">
                                                        {crop.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4.5 px-6 text-center">
                                                {crop.isSupportChatbot ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                                                        <Bot className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>Đang hỗ trợ</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                                        Không hỗ trợ
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-4.5 px-6 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(crop)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                        title="Chỉnh sửa cây trồng"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingCrop(crop)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Xóa cây trồng"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isCropsLoading && !isCropsError && crops.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50/40">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                isLoading={isCropsLoading}
                            />
                        </div>
                    )}
                </div>
            </div>

            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <h2 className="text-xl font-extrabold text-gray-900">
                                {editingCrop ? "Chỉnh sửa cây trồng" : "Thêm cây trồng mới"}
                            </h2>
                            <button
                                type="button"
                                onClick={closeFormModal}
                                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto space-y-4 pr-1">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Tên cây trồng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Tên cây trồng"
                                    {...register("name", {
                                        required: "Tên cây trồng không được để trống",
                                        maxLength: {
                                            value: 100,
                                            message: "Tên cây trồng không được vượt quá 100 ký tự",
                                        },
                                    })}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                                        errors.name ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                    }`}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {editingCrop && (
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-emerald-50/40 hover:border-emerald-200 transition-all">
                                        <input
                                            type="checkbox"
                                            {...register("isSupportChatbot")}
                                            className="w-4 h-4 text-emerald-600 rounded-lg focus:ring-emerald-500 border-gray-300 cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                <Bot className="w-4 h-4 text-emerald-600" />
                                                <span>Kích hoạt hỗ trợ AI Chatbot</span>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Chỉ kích hoạt khi chatbot đã hỗ trợ cây trồng này
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={closeFormModal}
                                    className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={saveMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    {saveMutation.isPending && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    <span>
                                        {editingCrop ? "Cập nhật cây trồng" : "Thêm cây trồng"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingCrop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center">
                        <div className="w-14 h-14 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                            Xác nhận xóa cây trồng
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn xóa cây trồng{" "}
                            <span className="font-bold text-gray-800">
                                "{deletingCrop.name}"
                            </span>
                            ? Tất cả các mùa vụ và nhiệm vụ liên quan đến cây trồng này cũng có thể bị ảnh hưởng.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingCrop(null)}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold transition-all cursor-pointer"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                disabled={deleteMutation.isPending}
                                onClick={confirmDelete}
                                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-md shadow-red-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
                            >
                                {deleteMutation.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                <span>Xóa cây trồng</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
