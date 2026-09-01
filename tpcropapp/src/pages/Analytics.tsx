import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
    Users,
    Layers,
    Grid,
    Calendar,
    AlertCircle,
    Loader2,
} from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
    type ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAuthStore } from "@/stores/AuthStore";
import { getCrops } from "@/services/cropService";
import { getSeasonProgress, getUserStats } from "@/services/statsService";
import type { Crop } from "@/types/crop";
import type { SeasonProgress, UserStatistic } from "@/types/statistic";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const currentYear = dayjs().year();
const AVAILABLE_YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function Analytics() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedCropId, setSelectedCropId] = useState<number | null>(null);

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

    const selectedCrop = selectedCropId !== null
        ? crops.find((c) => c.id === selectedCropId) || null
        : null;

    const {
        data: userStatsData,
        isLoading: isUserStatsLoading,
        isError: isUserStatsError,
        refetch: refetchUserStats,
    } = useQuery({
        queryKey: ["userStats", selectedYear, selectedCropId],
        queryFn: async () => {
            const res = await getUserStats({
                year: selectedYear,
                cropId: selectedCropId ?? undefined,
            });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const userStats: UserStatistic = userStatsData || {
        year: selectedYear,
        totalNewUsers: 0,
        totalPlots: 0,
        totalArea: 0,
    };

    const {
        data: seasonProgressData,
        isLoading: isSeasonProgressLoading,
        isError: isSeasonProgressError,
        refetch: refetchSeasonProgress,
    } = useQuery({
        queryKey: ["seasonProgress", selectedCropId, selectedYear],
        queryFn: async () => {
            const res = await getSeasonProgress({
                cropId: selectedCropId ?? undefined,
                year: selectedYear,
            });
            return res.data;
        },
        enabled: isAuthenticated,
    });

    const seasonProgressList: SeasonProgress[] = seasonProgressData || [];

    const barChartData: ChartData<"bar"> = {
        labels: seasonProgressList.map((s) => s.season),
        datasets: [
            {
                data: seasonProgressList.map((s) =>
                    Number((s.progress || 0).toFixed(2))
                ),
                backgroundColor: seasonProgressList.map((s) => {
                    const val = s.progress || 0;
                    if (val >= 80) return "rgba(16, 185, 129, 0.85)";
                    if (val >= 50) return "rgba(59, 130, 246, 0.85)";
                    if (val >= 25) return "rgba(245, 158, 11, 0.85)";
                    return "rgba(239, 68, 68, 0.85)";
                }),
                borderRadius: 8,
                maxBarThickness: 36,
            },
        ],
    };

    const barChartOptions: ChartOptions<"bar"> = {
        indexAxis: "x",
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 750,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function (val) {
                        const label = this.getLabelForValue(val as number);
                        return label.length > 20
                            ? label.substring(0, 18) + "..."
                            : label;
                    }
                },
            },
            y: {
                grid: {
                    display: true,
                    color: "rgba(243, 244, 246, 0.8)",
                },
                border: {
                    dash: [4, 4],
                },
                min: 0,
                max: 100,
                ticks: {
                    callback: (val) => `${val}%`,
                },
            },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Báo cáo & Thống kê
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500">
                            Theo dõi tiến độ hoàn thành các mùa vụ canh tác và số liệu người dùng
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-gray-200/90 shadow-sm">
                        <div className="flex items-center gap-2 pl-2">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="h-9 pr-8 pl-1 text-sm font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
                            >
                                {AVAILABLE_YEARS.map((yr) => (
                                    <option key={yr} value={yr}>
                                        Năm {yr}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                        <div className="flex items-center gap-2 pl-2">
                            <select
                                value={selectedCropId ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedCropId(val === "" ? null : Number(val));
                                }}
                                disabled={isCropsLoading}
                                className="h-9 pr-8 pl-1 text-sm font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer min-w-[140px]"
                            >
                                <option value="">Tất cả cây trồng</option>
                                {crops.map((crop) => (
                                    <option key={crop.id} value={crop.id}>
                                        {crop.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {isUserStatsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[1, 2, 3].map((idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md animate-pulse flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                                    <div className="w-28 h-4 bg-gray-200 rounded" />
                                </div>
                                <div className="w-20 h-8 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : isUserStatsError ? (
                    <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-red-700 flex flex-col items-center gap-3">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <p className="text-sm font-semibold">
                            Không thể tải số liệu thống kê.
                        </p>
                        <button
                            type="button"
                            onClick={() => refetchUserStats()}
                            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-500 transition-all cursor-pointer"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md shadow-emerald-950/5 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Người dùng mới
                                </p>
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {Number(userStats.totalNewUsers || 0).toLocaleString()}
                            </h3>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md shadow-emerald-950/5 hover:border-blue-200 hover:shadow-lg transition-all duration-200 group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Grid className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Tổng số thửa đất
                                </p>
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {Number(userStats.totalPlots || 0).toLocaleString()}
                            </h3>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md shadow-emerald-950/5 hover:border-amber-200 hover:shadow-lg transition-all duration-200 group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    Tổng diện tích
                                </p>
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {Number(userStats.totalArea || 0).toLocaleString()} {"m²"}
                            </h3>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md shadow-emerald-950/5 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                                Tiến độ hoàn thành theo mùa vụ
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                Tỷ lệ hoàn thành công việc theo từng mùa vụ {selectedCrop ? `của cây ${selectedCrop.name}` : "của tất cả cây trồng"} trong năm {selectedYear}
                            </p>
                        </div>
                        {!isSeasonProgressLoading && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                                Tổng số mùa vụ: {seasonProgressList.length}
                            </span>
                        )}
                    </div>

                    <div className="mt-6">
                        {isSeasonProgressLoading ? (
                            <div className="h-80 sm:h-96 w-full flex flex-col items-center justify-center gap-3 text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                                <p className="text-sm font-medium">Đang tải biểu đồ tiến độ mùa vụ...</p>
                            </div>
                        ) : isSeasonProgressError ? (
                            <div className="py-16 text-center">
                                <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-2" />
                                <h3 className="text-base font-bold text-gray-800 mb-1">
                                    Không thể tải dữ liệu tiến độ mùa vụ
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Đã có lỗi xảy ra trong quá trình truy vấn dữ liệu từ máy chủ.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => refetchSeasonProgress()}
                                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all cursor-pointer"
                                >
                                    Thử lại
                                </button>
                            </div>
                        ) : seasonProgressList.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                                    <AlertCircle className="w-7 h-7" />
                                </div>
                                <h3 className="text-base font-bold text-gray-700">
                                    Không có dữ liệu mùa vụ
                                </h3>
                                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                                    Chưa có mùa vụ nào được ghi nhận {selectedCrop ? `cho cây ${selectedCrop.name}` : "trong hệ thống"} trong năm {selectedYear}.
                                </p>
                            </div>
                        ) : (
                            <div className="h-80 sm:h-96 w-full">
                                <Bar data={barChartData} options={barChartOptions} />
                            </div>
                        )}
                    </div>

                </div>

                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md shadow-emerald-950/5 overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-gray-100">
                        <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                            Danh sách chi tiết mùa vụ
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Xem chi tiết chỉ số tiến độ hoàn thành công việc của từng mùa vụ
                        </p>
                    </div>

                    {isSeasonProgressLoading ? (
                        <div className="p-8 space-y-4">
                            {[1, 2, 3].map((idx) => (
                                <div
                                    key={idx}
                                    className="h-16 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-between px-6"
                                >
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                </div>
                            ))}
                        </div>
                    ) : seasonProgressList.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 text-sm font-medium">
                            Chưa có dữ liệu chi tiết mùa vụ.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Tên mùa vụ</th>
                                        <th className="py-4 px-6 text-center">Cây trồng</th>
                                        <th className="py-4 px-6 text-center">Niên vụ</th>
                                        <th className="py-4 px-6 min-w-[200px]">Tiến độ hoàn thành</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {seasonProgressList.map((item) => {
                                        const rawProgress = item.progress || 0;
                                        const progressVal = Number(rawProgress.toFixed(2));
                                        const isDone = progressVal >= 100;
                                        const isHigh = progressVal >= 70;
                                        const isMid = progressVal >= 40 && progressVal < 70;

                                        const progressColor = isDone
                                            ? "bg-emerald-600"
                                            : isHigh
                                                ? "bg-emerald-500"
                                                : isMid
                                                    ? "bg-blue-500"
                                                    : "bg-amber-500";

                                        return (
                                            <tr
                                                key={item.seasonId}
                                                className="hover:bg-emerald-50/30 transition-colors group"
                                            >
                                                <td className="py-4 px-6 font-bold text-gray-900">
                                                    <div className="flex items-center gap-2.5 text-gray-900">
                                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                            <Calendar className="w-4 h-4" />
                                                        </div>
                                                        <span>{item.season}</span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                                                        {item.crop}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-center text-xs font-semibold text-gray-600 whitespace-nowrap">
                                                    {item.startYear} - {item.endYear}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                                                style={{ width: `${Math.min(100, progressVal)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-800 w-12 text-right whitespace-nowrap">
                                                            {progressVal}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
