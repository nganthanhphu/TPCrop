import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Calendar,
    Plus,
    Pencil,
    Trash2,
    AlertCircle,
    AlertTriangle,
    Loader2,
    X,
    CalendarRange,
    ListTodo,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import {
    getSeasons,
    addSeason,
    updateSeason,
    deleteSeason,
} from "@/services/seasonService";
import { getCrops } from "@/services/cropService";
import type { Season } from "@/types/season";
import type { Crop } from "@/types/crop";

interface SeasonFormData {
    name: string;
    cropId: number;
    startYear: number;
    endYear: number;
}

export default function Seasons() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [page, setPage] = useState(0);
    const [userSelectedCropId, setUserSelectedCropId] = useState<number | null>(null);
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingSeason, setEditingSeason] = useState<Season | null>(null);
    const [deletingSeason, setDeletingSeason] = useState<Season | null>(null);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SeasonFormData>({
        defaultValues: {
            name: "",
            cropId: 0,
            startYear: new Date().getFullYear(),
            endYear: new Date().getFullYear(),
        },
    });

    const watchedStartYear = useWatch({ control, name: "startYear" });
    const watchedEndYear = useWatch({ control, name: "endYear" });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const {
        data: cropsData,
        isLoading: isCropsLoading,
    } = useQuery({
        queryKey: ["allCrops"],
        queryFn: async () => {
            const res = await getCrops({ page: 0, size: 100 });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const crops: Crop[] = cropsData?.content || [];
    const selectedCropId = userSelectedCropId ?? (crops.length > 0 ? crops[0].id : null);

    const {
        data: seasonsData,
        isLoading: isSeasonsLoading,
        isError: isSeasonsError,
        refetch: refetchSeasons,
    } = useQuery({
        queryKey: ["seasons", selectedCropId, page],
        queryFn: async () => {
            if (!selectedCropId) return null;
            const res = await getSeasons({
                cropId: selectedCropId,
                page,
                size: pageSize,
            });
            return res.data;
        },
        enabled: isAuthenticated && selectedCropId !== null,
    });

    const seasons: Season[] = seasonsData?.content || [];
    const totalPages = seasonsData?.totalPages || 1;

    const openAddModal = () => {
        setEditingSeason(null);
        reset({
            name: "",
            cropId: selectedCropId || (crops[0]?.id ?? 0),
            startYear: new Date().getFullYear(),
            endYear: new Date().getFullYear(),
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (season: Season) => {
        setEditingSeason(season);
        reset({
            name: season.name,
            cropId: season.crop?.id || selectedCropId || 0,
            startYear: season.startYear,
            endYear: season.endYear,
        });
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingSeason(null);
        reset();
    };

    const saveMutation = useMutation({
        mutationFn: async (data: SeasonFormData) => {
            if (editingSeason) {
                return updateSeason(editingSeason.id, {
                    name: data.name.trim(),
                    startYear: Number(data.startYear),
                    endYear: Number(data.endYear),
                });
            } else {
                return addSeason({
                    name: data.name.trim(),
                    cropId: Number(data.cropId),
                    startYear: Number(data.startYear),
                    endYear: Number(data.endYear),
                });
            }
        },
        onSuccess: () => {
            toast.success(
                editingSeason
                    ? "Cập nhật mùa vụ thành công!"
                    : "Thêm mùa vụ mới thành công!"
            );
            closeFormModal();
            queryClient.invalidateQueries({ queryKey: ["seasons"] });
        },
        onError: () => {
            toast.error(
                editingSeason
                    ? "Cập nhật mùa vụ thất bại. Vui lòng thử lại!"
                    : "Thêm mùa vụ thất bại. Vui lòng thử lại!"
            );
        },
    });

    const onSubmit = (data: SeasonFormData) => {
        saveMutation.mutate(data);
    };

    const deleteMutation = useMutation({
        mutationFn: async (seasonId: number) => {
            return deleteSeason(seasonId);
        },
        onSuccess: () => {
            toast.success("Đã xóa mùa vụ thành công!");
            setDeletingSeason(null);
            queryClient.invalidateQueries({ queryKey: ["seasons"] });
        },
        onError: () => {
            toast.error("Không thể xóa mùa vụ. Vui lòng thử lại sau!");
        },
    });

    const confirmDelete = () => {
        if (deletingSeason) {
            deleteMutation.mutate(deletingSeason.id);
        }
    };

    const isYearModified =
        editingSeason &&
        (Number(watchedStartYear) !== editingSeason.startYear ||
            Number(watchedEndYear) !== editingSeason.endYear);

    const selectedCropName =
        crops.find((c) => c.id === selectedCropId)?.name || "Cây trồng";

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Quản lý mùa vụ
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Quản lý danh sách các mùa vụ canh tác theo từng loại cây trồng
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        disabled={crops.length === 0}
                        className="h-11 inline-flex items-center gap-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm mùa vụ mới</span>
                    </button>
                </div>

                <div className="flex justify-end items-center mb-6">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={selectedCropId ?? ""}
                            onChange={(e) => {
                                setUserSelectedCropId(Number(e.target.value));
                                setPage(0);
                            }}
                            disabled={isCropsLoading || crops.length === 0}
                            className="h-11 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer hover:border-gray-300 transition-colors w-full sm:w-64"
                        >
                            {isCropsLoading ? (
                                <option value="">Đang tải danh sách cây trồng...</option>
                            ) : crops.length === 0 ? (
                                <option value="">Chưa có cây trồng nào</option>
                            ) : (
                                crops.map((crop) => (
                                    <option key={crop.id} value={crop.id}>
                                        {crop.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md shadow-emerald-950/5 overflow-hidden">
                    {isSeasonsLoading || isCropsLoading ? (
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
                    ) : isSeasonsError ? (
                        <div className="text-center py-16 px-4">
                            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Không thể tải danh sách mùa vụ
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Đã xảy ra lỗi khi kết nối máy chủ. Vui lòng thử lại!
                            </p>
                            <button
                                onClick={() => refetchSeasons()}
                                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : seasons.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                <CalendarRange className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Chưa có mùa vụ nào cho {selectedCropName}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                Hãy tạo mùa vụ đầu tiên cho loại cây trồng này để bắt đầu lập kế hoạch.
                            </p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Thêm mùa vụ mới</span>
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Tên mùa vụ</th>
                                        <th className="py-4 px-6 text-center">Cây trồng</th>
                                        <th className="py-4 px-6 text-center">Năm bắt đầu</th>
                                        <th className="py-4 px-6 text-center">Năm kết thúc</th>
                                        <th className="py-4 px-6 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {seasons.map((season) => (
                                        <tr
                                            key={season.id}
                                            className="hover:bg-emerald-50/30 transition-colors group"
                                        >
                                            <td className="py-4.5 px-6 font-bold text-gray-900 leading-snug">
                                                <Link
                                                    to={`/seasons/${season.id}/tasks`}
                                                    className="flex items-center gap-2.5 group/name"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover/name:bg-emerald-600 group-hover/name:text-white transition-colors">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <span className="group-hover/name:text-emerald-700 hover:underline transition-colors">
                                                        {season.name}
                                                    </span>
                                                </Link>
                                            </td>

                                            <td className="py-4.5 px-6 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                                                    {season.crop?.name || selectedCropName}
                                                </span>
                                            </td>

                                            <td className="py-4.5 px-6 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                {season.startYear}
                                            </td>

                                            <td className="py-4.5 px-6 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                {season.endYear}
                                            </td>

                                            <td className="py-4.5 px-6 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/seasons/${season.id}/tasks`}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer inline-flex items-center"
                                                        title="Quản lý nhiệm vụ mùa vụ"
                                                    >
                                                        <ListTodo className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(season)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                        title="Chỉnh sửa mùa vụ"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingSeason(season)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Xóa mùa vụ"
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

                    {!isSeasonsLoading && !isSeasonsError && seasons.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50/40">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                isLoading={isSeasonsLoading}
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
                                {editingSeason ? "Chỉnh sửa mùa vụ" : "Thêm mùa vụ mới"}
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
                                    Tên mùa vụ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên mùa vụ"
                                    {...register("name", {
                                        required: "Tên mùa vụ không được để trống",
                                        maxLength: {
                                            value: 100,
                                            message: "Tên mùa vụ không được vượt quá 100 ký tự",
                                        },
                                    })}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.name ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {!editingSeason && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Cây trồng <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register("cropId", {
                                            required: "Vui lòng chọn loại cây trồng",
                                            valueAsNumber: true,
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer ${errors.cropId ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                            }`}
                                    >
                                        {crops.map((crop) => (
                                            <option key={crop.id} value={crop.id}>
                                                {crop.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.cropId && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.cropId.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Năm bắt đầu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Nhập năm bắt đầu"
                                        {...register("startYear", {
                                            required: "Năm bắt đầu là bắt buộc",
                                            valueAsNumber: true,
                                            min: {
                                                value: 1900,
                                                message: "Năm bắt đầu không hợp lệ",
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.startYear ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                            }`}
                                    />
                                    {errors.startYear && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.startYear.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Năm kết thúc <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Nhập năm kết thúc"
                                        {...register("endYear", {
                                            required: "Năm kết thúc là bắt buộc",
                                            valueAsNumber: true,
                                            validate: (val) => {
                                                const start = Number(watchedStartYear);
                                                if (val < start) {
                                                    return "Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu";
                                                }
                                                return true;
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${errors.endYear ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                            }`}
                                    />
                                    {errors.endYear && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.endYear.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {isYearModified && (
                                <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs sm:text-sm animate-in fade-in duration-200">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Cảnh báo</p>
                                        <p className="text-amber-700 mt-0.5 leading-relaxed text-xs">
                                            Việc thay đổi năm bắt đầu hoặc năm kết thúc có thể làm sai lệch thời gian của các nhiệm vụ thuộc mùa vụ này.
                                        </p>
                                    </div>
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
                                        {editingSeason ? "Cập nhật" : "Thêm"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingSeason && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center">
                        <div className="w-14 h-14 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                            Xác nhận xóa mùa vụ?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn xóa mùa vụ{" "}
                            <span className="font-bold text-gray-800">
                                {deletingSeason.name}
                            </span>
                            ? Tất cả các nhiệm vụ thuộc mùa vụ này cũng bị xóa.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingSeason(null)}
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
                                <span>Xóa</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
