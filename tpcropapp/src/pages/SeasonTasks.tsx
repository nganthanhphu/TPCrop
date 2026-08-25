import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    ListTodo,
    Plus,
    Pencil,
    Trash2,
    Calendar,
    Sprout,
    Clock,
    AlertCircle,
    Loader2,
    X,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import {
    getTasksByManager,
    addTask,
    updateTask,
    deleteTask,
} from "@/services/taskService";
import { getSeasonById } from "@/services/seasonService";
import type { Task } from "@/types/task";
import type { Season } from "@/types/season";
import { formatDate } from "@/utils/formatDate";

interface TaskFormData {
    description: string;
    startDate: string;
    endDate: string;
}

export default function SeasonTasks() {
    const { seasonId } = useParams<{ seasonId: string }>();
    const numericSeasonId = Number(seasonId);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [page, setPage] = useState(0);
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TaskFormData>({
        defaultValues: {
            description: "",
            startDate: "",
            endDate: "",
        },
    });

    const watchedStartDate = useWatch({ control, name: "startDate" });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const { data: seasonData, isLoading: isSeasonLoading } = useQuery({
        queryKey: ["seasonDetail", numericSeasonId],
        queryFn: async () => {
            if (!numericSeasonId) return null;
            const res = await getSeasonById(numericSeasonId);
            return res.data;
        },
        enabled: isAuthenticated && !isNaN(numericSeasonId),
    });

    const season: Season | undefined = seasonData || undefined;

    const {
        data: tasksData,
        isLoading: isTasksLoading,
        isError: isTasksError,
        refetch: refetchTasks,
    } = useQuery({
        queryKey: ["managerSeasonTasks", numericSeasonId, page],
        queryFn: async () => {
            if (!numericSeasonId) return null;
            const res = await getTasksByManager({
                seasonId: numericSeasonId,
                page,
                size: pageSize,
            });
            return res.data;
        },
        enabled: isAuthenticated && !isNaN(numericSeasonId),
    });

    const tasks: Task[] = tasksData?.content || [];
    const totalPages = tasksData?.totalPages || 1;

    const openAddModal = () => {
        setEditingTask(null);
        reset({
            description: "",
            startDate: "",
            endDate: "",
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        reset({
            description: task.description,
            startDate: task.startDate ? task.startDate.split("T")[0] : "",
            endDate: task.endDate ? task.endDate.split("T")[0] : "",
        });
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingTask(null);
        reset();
    };

    const saveMutation = useMutation({
        mutationFn: async (data: TaskFormData) => {
            if (editingTask) {
                return updateTask(editingTask.id, {
                    description: data.description.trim(),
                    startDate: data.startDate,
                    endDate: data.endDate,
                });
            } else {
                return addTask({
                    description: data.description.trim(),
                    startDate: data.startDate,
                    endDate: data.endDate,
                    seasonId: numericSeasonId,
                });
            }
        },
        onSuccess: () => {
            toast.success(
                editingTask
                    ? "Cập nhật nhiệm vụ thành công!"
                    : "Thêm nhiệm vụ mới thành công!"
            );
            closeFormModal();
            queryClient.invalidateQueries({
                queryKey: ["managerSeasonTasks", numericSeasonId],
            });
        },
        onError: () => {
            toast.error(
                editingTask
                    ? "Cập nhật nhiệm vụ thất bại. Vui lòng thử lại!"
                    : "Thêm nhiệm vụ thất bại. Vui lòng thử lại!"
            );
        },
    });

    const onSubmit = (data: TaskFormData) => {
        saveMutation.mutate(data);
    };

    const deleteMutation = useMutation({
        mutationFn: async (taskId: number) => {
            return deleteTask(taskId);
        },
        onSuccess: () => {
            toast.success("Đã xóa nhiệm vụ thành công!");
            setDeletingTask(null);
            queryClient.invalidateQueries({
                queryKey: ["managerSeasonTasks", numericSeasonId],
            });
        },
        onError: () => {
            toast.error("Không thể xóa nhiệm vụ. Vui lòng thử lại sau!");
        },
    });

    const confirmDelete = () => {
        if (deletingTask) {
            deleteMutation.mutate(deletingTask.id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        to="/seasons"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại danh sách mùa vụ</span>
                    </Link>

                    {isSeasonLoading ? (
                        <div className="bg-white/80 rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-emerald-100/80 shadow-lg shadow-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
                                        {season?.name || `Mùa vụ #${numericSeasonId}`}
                                    </h1>
                                    {season && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-100 text-emerald-900 shadow-xs">
                                            {season.startYear} - {season.endYear}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-1">
                                        Cây trồng:
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>{season?.crop?.name || "Cây trồng"}</span>
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={openAddModal}
                                className="h-11 inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Thêm nhiệm vụ mới</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md shadow-emerald-950/5 overflow-hidden">
                    {isTasksLoading ? (
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
                    ) : isTasksError ? (
                        <div className="text-center py-16 px-4">
                            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Không thể tải danh sách nhiệm vụ
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Đã xảy ra lỗi khi kết nối máy chủ. Vui lòng thử lại!
                            </p>
                            <button
                                onClick={() => refetchTasks()}
                                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                <ListTodo className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Chưa có nhiệm vụ nào trong mùa vụ này
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                Hãy thêm nhiệm vụ đầu tiên để lên kế hoạch canh tác cho mùa vụ.
                            </p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Thêm nhiệm vụ mới</span>
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Nội dung nhiệm vụ</th>
                                        <th className="py-4 px-6 text-center">Ngày bắt đầu</th>
                                        <th className="py-4 px-6 text-center">Ngày kết thúc</th>
                                        <th className="py-4 px-6 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-emerald-50/30 transition-colors group"
                                        >
                                            <td className="py-4.5 px-6 font-bold text-gray-900 leading-snug">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                                        <ListTodo className="w-4 h-4" />
                                                    </div>
                                                    <span className="group-hover:text-emerald-700 transition-colors leading-relaxed">
                                                        {task.description}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4.5 px-6 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/60">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{formatDate(task.startDate)}</span>
                                                </div>
                                            </td>

                                            <td className="py-4.5 px-6 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200/60">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{formatDate(task.endDate)}</span>
                                                </div>
                                            </td>

                                            <td className="py-4.5 px-6 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(task)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                        title="Chỉnh sửa nhiệm vụ"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingTask(task)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Xóa nhiệm vụ"
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

                    {!isTasksLoading && !isTasksError && tasks.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50/40">
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

            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <h2 className="text-xl font-extrabold text-gray-900">
                                {editingTask ? "Chỉnh sửa nhiệm vụ" : "Thêm nhiệm vụ mới"}
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
                                    Nội dung công việc <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Nhập nội dung công việc..."
                                    {...register("description", {
                                        required: "Nội dung nhiệm vụ không được để trống",
                                    })}
                                    className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none ${
                                        errors.description ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 mt-1.5 font-medium">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Ngày bắt đầu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        min={season ? `${season.startYear}-01-01` : undefined}
                                        max={season ? `${season.endYear}-12-31` : undefined}
                                        {...register("startDate", {
                                            required: "Ngày bắt đầu là bắt buộc",
                                            validate: (val) => {
                                                if (!val) return true;
                                                const year = Number(val.split("-")[0]);
                                                if (season && (year < season.startYear || year > season.endYear)) {
                                                    return `Năm bắt đầu phải nằm trong khoảng mùa vụ (${season.startYear} - ${season.endYear})`;
                                                }
                                                return true;
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer ${
                                            errors.startDate ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.startDate && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.startDate.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Ngày kết thúc <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        min={season ? `${season.startYear}-01-01` : undefined}
                                        max={season ? `${season.endYear}-12-31` : undefined}
                                        {...register("endDate", {
                                            required: "Ngày kết thúc là bắt buộc",
                                            validate: (val) => {
                                                if (!val) return true;
                                                const year = Number(val.split("-")[0]);
                                                if (season && (year < season.startYear || year > season.endYear)) {
                                                    return `Năm kết thúc phải nằm trong khoảng mùa vụ (${season.startYear} - ${season.endYear})`;
                                                }
                                                if (watchedStartDate && val < watchedStartDate) {
                                                    return "Ngày kết thúc phải sau hoặc cùng ngày bắt đầu";
                                                }
                                                return true;
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer ${
                                            errors.endDate ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.endDate && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.endDate.message}
                                        </p>
                                    )}
                                </div>
                            </div>

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
                                        {editingTask ? "Cập nhật nhiệm vụ" : "Thêm nhiệm vụ"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deletingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center">
                        <div className="w-14 h-14 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                            Xác nhận xóa nhiệm vụ?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn xóa nhiệm vụ{" "}
                            <span className="font-bold text-gray-800">
                                "{deletingTask.description}"
                            </span>
                            ? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingTask(null)}
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
                                <span>Xóa nhiệm vụ</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
