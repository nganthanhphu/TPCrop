import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    MapPin,
    Sprout,
    Calendar,
    Check,
    Clock,
    AlertCircle,
    CheckCircle2,
    ListTodo,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import { getPlots } from "@/services/plotService";
import { getDetailedTasks, completeTask } from "@/services/taskService";
import type { TaskDetail } from "@/types/task";
import { formatDate } from "@/utils/formatDate";

export default function PlotTasks() {
    const { plotId } = useParams<{ plotId: string }>();
    const numericPlotId = Number(plotId);

    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [page, setPage] = useState(0);
    const [filterCropId, setFilterCropId] = useState<number | "">("");
    const [statusFilter, setStatusFilter] = useState<"uncompleted" | "completed" | "all">("uncompleted");
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const { data: plotsData, isLoading: isPlotLoading } = useQuery({
        queryKey: ["farmerPlots"],
        queryFn: async () => {
            const res = await getPlots({ size: 100 });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const plot = plotsData?.content?.find((p) => p.id === numericPlotId);

    const isCompletedParam = statusFilter === "uncompleted" ? false : statusFilter === "completed" ? true : undefined;

    const {
        data: tasksPageData,
        isLoading: isTasksLoading,
        isError: isTasksError,
        refetch: refetchTasks,
    } = useQuery({
        queryKey: ["plotTasks", numericPlotId, page, filterCropId, statusFilter],
        queryFn: async () => {
            if (!numericPlotId) return null;
            const res = await getDetailedTasks({
                plotId: numericPlotId,
                cropId: filterCropId ? Number(filterCropId) : undefined,
                isCompleted: isCompletedParam,
                page,
                size: pageSize,
            });
            return res.data;
        },
        enabled: isAuthenticated && !isNaN(numericPlotId),
    });

    const completeMutation = useMutation({
        mutationFn: async (taskId: number) => {
            if (!numericPlotId) return;
            return completeTask({ plotId: numericPlotId, taskId });
        },
        onSuccess: () => {
            toast.success("Đã hoàn thành công việc!");
            queryClient.invalidateQueries({
                queryKey: ["plotTasks", numericPlotId],
            });
            queryClient.invalidateQueries({
                queryKey: ["todayTasks"],
            });
        },
        onError: () => {
            toast.error("Không thể cập nhật trạng thái công việc. Vui lòng thử lại sau.");
        },
    });

    const tasks: TaskDetail[] = tasksPageData?.content || [];
    const totalPages = tasksPageData?.totalPages || 1;

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        to="/plots"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại danh sách mảnh đất</span>
                    </Link>

                    {isPlotLoading ? (
                        <div className="bg-white/80 rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    ) : plot ? (
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-lg shadow-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                                        {plot.address}
                                    </h1>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-900 shadow-xs">
                                        {plot.size} ha
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-1">
                                        Cây trồng:
                                    </span>
                                    {plot.crops && plot.crops.length > 0 ? (
                                        plot.crops.map((crop) => (
                                            <span
                                                key={crop.id}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80"
                                            >
                                                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                                                {crop.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">
                                            Chưa gán cây trồng
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                            <ListTodo className="w-6 h-6 text-emerald-600" />
                            <span>Danh sách nhiệm vụ</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Theo dõi và cập nhật tiến độ công việc canh tác trên mảnh đất này
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {plot?.crops && plot.crops.length > 0 && (
                            <select
                                value={filterCropId}
                                onChange={(e) => {
                                    setFilterCropId(e.target.value ? Number(e.target.value) : "");
                                    setPage(0);
                                }}
                                className="h-11 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                            >
                                <option value="">Tất cả cây trồng</option>
                                {plot.crops.map((crop) => (
                                    <option key={crop.id} value={crop.id}>
                                        {crop.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as "uncompleted" | "completed" | "all");
                                setPage(0);
                            }}
                            className="h-11 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                        >
                            <option value="uncompleted">Chưa hoàn thành</option>
                            <option value="completed">Đã hoàn thành</option>
                            <option value="all">Tất cả trạng thái</option>
                        </select>
                    </div>
                </div>

                {isTasksLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4"
                            >
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-6 bg-gray-200 rounded w-4/5" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-10 bg-gray-200 rounded-xl w-full pt-2" />
                            </div>
                        ))}
                    </div>
                ) : isTasksError ? (
                    <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-200 shadow-sm">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Không thể tải danh sách nhiệm vụ
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                        </p>
                        <button
                            onClick={() => refetchTasks()}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                        <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {statusFilter === "uncompleted"
                                ? "Tuyệt vời! Không còn nhiệm vụ nào chưa hoàn thành"
                                : statusFilter === "completed"
                                ? "Chưa có nhiệm vụ nào được hoàn thành"
                                : "Không có nhiệm vụ phù hợp"}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                            {filterCropId
                                ? "Không tìm thấy nhiệm vụ nào khớp với bộ lọc đã chọn."
                                : "Hiện không có công việc nào trong danh mục này."}
                        </p>
                        {(filterCropId || statusFilter !== "uncompleted") && (
                            <button
                                onClick={() => {
                                    setFilterCropId("");
                                    setStatusFilter("uncompleted");
                                    setPage(0);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex flex-col justify-between bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {task.season?.name || "Mùa vụ"}
                                            </span>

                                            {task.isCompleted ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700">
                                                    <Check className="w-3.5 h-3.5" />
                                                    Đã xong
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Chưa hoàn thành
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                                            {task.description}
                                        </h3>

                                        <p className="text-xs text-gray-500 mb-4">
                                            Thời gian: {formatDate(task.startDate)} - {formatDate(task.endDate)}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        {task.isCompleted ? (
                                            <div className="flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50/60 rounded-xl">
                                                <Check className="w-4 h-4" />
                                                <span>Đã hoàn thành</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => completeMutation.mutate(task.id)}
                                                disabled={completeMutation.isPending}
                                                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Check className="w-4 h-4" />
                                                <span>Đánh dấu hoàn thành</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            isLoading={isTasksLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
