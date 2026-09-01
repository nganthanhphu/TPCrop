import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    MapPin,
    Sprout,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    X,
    LandPlot,
    ListTodo,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import { getPlots, addMyPlot, updatePlot, deletePlot } from "@/services/plotService";
import { getCrops } from "@/services/cropService";
import type { Plot } from "@/types/plot";
import type { Crop } from "@/types/crop";

interface PlotFormData {
    address: string;
    size: number;
    cropIds: string[];
}

export default function Plots() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [page, setPage] = useState(0);
    const [filterCropId, setFilterCropId] = useState<number | "">("");
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
    const [deletingPlot, setDeletingPlot] = useState<Plot | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PlotFormData>({
        defaultValues: {
            address: "",
            size: 0,
            cropIds: [],
        },
    });

    const {
        data: plotsData,
        isLoading: isPlotsLoading,
        isError: isPlotsError,
        refetch: refetchPlots,
    } = useQuery({
        queryKey: ["plots", page, filterCropId],
        queryFn: async () => {
            const res = await getPlots({
                page,
                size: pageSize,
                cropId: filterCropId ? Number(filterCropId) : undefined,
            });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const { data: cropsData } = useQuery({
        queryKey: ["allCrops"],
        queryFn: async () => {
            const res = await getCrops({ page: 0, size: 100 });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const plots: Plot[] = plotsData?.content || [];
    const totalPages = plotsData?.totalPages || 1;
    const crops: Crop[] = cropsData?.content || [];

    const openAddModal = () => {
        setEditingPlot(null);
        reset({
            address: "",
            size: 0,
            cropIds: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (plot: Plot) => {
        setEditingPlot(plot);
        reset({
            address: plot.address,
            size: plot.size,
            cropIds: (plot.crops || []).map((c) => String(c.id)),
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlot(null);
    };

    const addMutation = useMutation({
        mutationFn: async (data: PlotFormData) => {
            return addMyPlot({
                address: data.address.trim(),
                size: Number(data.size),
                cropIds: data.cropIds.map(Number),
            });
        },
        onSuccess: () => {
            toast.success("Thêm mảnh đất thành công!");
            closeModal();
            queryClient.invalidateQueries({ queryKey: ["plots"] });
            queryClient.invalidateQueries({ queryKey: ["farmerPlots"] });
        },
        onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            toast.error(errorObj.response?.data?.error || errorObj.response?.data?.message || "Không thể thêm mảnh đất.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: PlotFormData) => {
            if (!editingPlot) return;
            return updatePlot(editingPlot.id, {
                address: data.address.trim(),
                size: Number(data.size),
                cropIds: data.cropIds.map(Number),
            });
        },
        onSuccess: () => {
            toast.success("Cập nhật mảnh đất thành công!");
            closeModal();
            queryClient.invalidateQueries({ queryKey: ["plots"] });
            queryClient.invalidateQueries({ queryKey: ["farmerPlots"] });
        },
        onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            toast.error(errorObj.response?.data?.error || errorObj.response?.data?.message || "Không thể cập nhật mảnh đất.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (plotId: number) => {
            return deletePlot(plotId);
        },
        onSuccess: () => {
            toast.success("Đã xóa mảnh đất!");
            setDeletingPlot(null);
            queryClient.invalidateQueries({ queryKey: ["plots"] });
            queryClient.invalidateQueries({ queryKey: ["farmerPlots"] });
        },
        onError: (err: unknown) => {
            const errorObj = err as { response?: { data?: { error?: string; message?: string } } };
            toast.error(errorObj.response?.data?.error || errorObj.response?.data?.message || "Không thể xóa mảnh đất.");
        },
    });

    const onSubmit = (data: PlotFormData) => {
        if (!data.cropIds || data.cropIds.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 loại cây trồng canh tác.");
            return;
        }

        if (editingPlot) {
            updateMutation.mutate(data);
        } else {
            addMutation.mutate(data);
        }
    };

    const isSubmitting = addMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Quản lý đất đai
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Danh sách và quản lý các mảnh đất canh tác của bạn
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex items-center">
                            <select
                                value={filterCropId}
                                onChange={(e) => {
                                    setFilterCropId(e.target.value ? Number(e.target.value) : "");
                                    setPage(0);
                                }}
                                className="h-11 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                            >
                                <option value="">Tất cả cây trồng</option>
                                {crops.map((crop) => (
                                    <option key={crop.id} value={crop.id}>
                                        {crop.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="h-11 inline-flex items-center gap-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Thêm mảnh đất</span>
                        </button>
                    </div>
                </div>

                {isPlotsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4"
                            >
                                <div className="h-5 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-8 bg-gray-200 rounded-xl w-full" />
                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                    <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                                    <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isPlotsError ? (
                    <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-200 shadow-sm">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Không thể tải danh sách mảnh đất
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                        </p>
                        <button
                            onClick={() => refetchPlots()}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : plots.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                        <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                            <LandPlot className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {filterCropId ? "Không tìm thấy mảnh đất phù hợp" : "Chưa có mảnh đất nào"}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                            {filterCropId
                                ? "Không có mảnh đất nào đang canh tác loại cây trồng đã chọn."
                                : "Bắt đầu quản lý mùa vụ bằng cách thêm mảnh đất canh tác đầu tiên của bạn!"}
                        </p>
                        {filterCropId ? (
                            <button
                                onClick={() => {
                                    setFilterCropId("");
                                    setPage(0);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <span>Xem tất cả cây trồng</span>
                            </button>
                        ) : (
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Thêm mảnh đất ngay</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plots.map((plot) => (
                                <div
                                    key={plot.id}
                                    onClick={() => navigate(`/plots/${plot.id}/tasks`)}
                                    className="flex flex-col justify-between bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-emerald-100/80 shadow-lg shadow-emerald-950/5 hover:shadow-xl hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-start gap-2.5 min-w-0">
                                                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                                                    {plot.address}
                                                </h3>
                                            </div>

                                            <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-900 shadow-xs">
                                                {plot.size} ha
                                            </span>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                                Cây trồng canh tác
                                            </p>
                                            {plot.crops && plot.crops.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {plot.crops.map((crop) => (
                                                        <span
                                                            key={crop.id}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80"
                                                        >
                                                            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                                                            {crop.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">
                                                    Chưa gán loại cây trồng nào
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-gray-100">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/plots/${plot.id}/tasks`);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <ListTodo className="w-3.5 h-3.5" />
                                            <span>Nhiệm vụ</span>
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(plot);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            <span>Chỉnh sửa</span>
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingPlot(plot);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Xóa</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            isLoading={isPlotsLoading}
                        />
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 relative animate-in fade-in zoom-in-95 duration-150">
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">
                            {editingPlot ? "Chỉnh sửa mảnh đất" : "Thêm mảnh đất mới"}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Địa chỉ mảnh đất
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nhập địa chỉ hoặc vị trí mảnh đất"
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.address
                                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            }`}
                                        {...register("address", {
                                            required: "Vui lòng nhập địa chỉ mảnh đất",
                                            maxLength: { value: 255, message: "Địa chỉ không quá 255 ký tự" },
                                        })}
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-1.5 text-xs text-red-500 font-medium">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                    Diện tích (ha)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ví dụ: 1.5"
                                    className={`w-full px-4 py-3 bg-gray-50/70 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${errors.size
                                        ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                                        : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    {...register("size", {
                                        required: "Vui lòng nhập diện tích",
                                        min: { value: 0.01, message: "Diện tích phải lớn hơn 0" },
                                        valueAsNumber: true,
                                    })}
                                />
                                {errors.size && (
                                    <p className="mt-1.5 text-xs text-red-500 font-medium">
                                        {errors.size.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                    Cây trồng canh tác (chọn ít nhất 1)
                                </label>
                                {crops.length === 0 ? (
                                    <p className="text-xs text-gray-500 italic">
                                        Đang tải danh sách cây trồng...
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                                        {crops.map((crop) => (
                                            <label
                                                key={crop.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none has-checked:bg-emerald-600 has-checked:text-white has-checked:border-emerald-600 has-checked:shadow-sm has-checked:shadow-emerald-600/20 bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={String(crop.id)}
                                                    className="hidden"
                                                    {...register("cropIds", {
                                                        validate: (value) =>
                                                            (value && value.length > 0) ||
                                                            "Vui lòng chọn ít nhất 1 loại cây trồng canh tác",
                                                    })}
                                                />
                                                <Sprout className="w-3.5 h-3.5" />
                                                <span>{crop.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {errors.cropIds && (
                                    <p className="mt-1.5 text-xs text-red-500 font-medium">
                                        {errors.cropIds.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>{editingPlot ? "Lưu thay đổi" : "Thêm mảnh đất"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingPlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-red-100 relative animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-12 h-12 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                            Xác nhận xóa mảnh đất
                        </h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            Bạn có chắc chắn muốn xóa mảnh đất tại{" "}
                            <strong className="text-gray-800">{deletingPlot.address}</strong>?
                            Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingPlot(null)}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                type="button"
                                onClick={() => deleteMutation.mutate(deletingPlot.id)}
                                disabled={deleteMutation.isPending}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white font-bold shadow-lg shadow-red-600/25 transition-all cursor-pointer disabled:cursor-not-allowed"
                            >
                                {deleteMutation.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                <span>Xác nhận xóa</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
