import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Sprout,
    Bot,
    BookOpen,
    ArrowRight,
    AlertCircle,
    FileText,
    Heart,
    MessageSquare,
    ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/AuthStore";
import { getArticles } from "@/services/articleService";
import type { Article } from "@/types/article";
import { formatDate } from "@/utils/formatDate";

export default function Home() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const {
        data: articlePage,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["topArticles"],
        queryFn: async () => {
            const res = await getArticles({ page: 0, size: 6, sortBy: "likeCount" });
            return res.data;
        },
    });

    const articles: Article[] = articlePage?.content || [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800">
            <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-emerald-100/60 bg-gradient-to-br from-emerald-900/90 via-emerald-800 to-green-950 text-white shadow-inner">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-400/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {isAuthenticated ? (
                            <div className="space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                    {(() => {
                                        const hour = new Date().getHours();
                                        if (hour < 12) return "Chào buổi sáng, ";
                                        if (hour < 18) return "Chào buổi chiều, ";
                                        return "Chào buổi tối, ";
                                    })()}, <span className="text-emerald-300">{user?.fullName || user?.username}</span>
                                </h1>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                    Quản lý mùa vụ & canh tác <br className="hidden sm:inline" />
                                    <span className="text-emerald-300">thông minh, hiệu quả</span>
                                </h1>

                                <p className="text-lg md:text-xl text-emerald-100/90 font-light max-w-2xl mx-auto">
                                    Tối ưu quy trình chăm sóc cây trồng, quản lý công việc theo mùa vụ và kết nối chia sẻ kinh nghiệm cùng cộng đồng nông dân hiện đại.
                                </p>

                                <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-400 text-emerald-950 font-bold shadow-lg shadow-emerald-950/30 hover:bg-emerald-300 hover:shadow-emerald-400/30 hover:-translate-y-0.5 transition-all duration-200 text-base"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/25 backdrop-blur-sm hover:-translate-y-0.5 transition-all duration-200 text-base"
                                    >
                                        Tạo tài khoản mới
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 hover:shadow-md transition-shadow">
                            <div className="p-3 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                                <Sprout className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Quản lý đất đai & mùa vụ cây trồng</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Theo dõi, lập kế hoạch canh tác, ghi nhận tiến độ hoàn thành công việc theo từng giai đoạn phát triển của từng mảnh đất, từng loại cây trồng.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 hover:shadow-md transition-shadow">
                            <div className="p-3 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Tư vấn & hỗ trợ</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Chatbot hỗ trợ giải đáp thắc mắc về các bệnh mà cây trồng gặp phải, đưa ra các giải pháp chữa trị, phòng trừ sâu bệnh và các vấn đề liên quan đến canh tác.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 hover:shadow-md transition-shadow">
                            <div className="p-3 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Kiến thức & kinh nghiệm</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Chia sẻ bài viết, trao đổi kỹ thuật bón phân, phòng trừ sâu bệnh từ các nhà nông khác.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                            Bài viết nổi bật
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Tổng hợp các bài viết và kinh nghiệm kỹ thuật được quan tâm nhiều nhất
                        </p>
                    </div>

                    <Link
                        to="/articles"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group transition-colors self-start sm:self-auto"
                    >
                        Xem tất cả bài viết
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between h-56">
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-6 bg-gray-200 rounded w-full" />
                                    <div className="h-6 bg-gray-200 rounded w-4/5" />
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                                    <div className="h-4 bg-gray-200 rounded w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-200">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium mb-4">
                            Không thể tải danh sách bài viết lúc này. Vui lòng thử lại sau.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
                            <FileText className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Chưa có bài viết nào</h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                            Hãy là người đầu tiên chia sẻ kiến thức hoặc kinh nghiệm canh tác hữu ích cùng mọi người!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/articles/${article.id}`}
                                className="group flex flex-col justify-between bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200/80 hover:-translate-y-1 transition-all duration-200"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        {article.user?.avatar ? (
                                            <img
                                                src={article.user.avatar}
                                                alt={article.user.fullName || article.user.username}
                                                className="w-9 h-9 rounded-full object-cover border border-emerald-100"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                                {(article.user?.fullName || article.user?.username || "U").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="text-xs">
                                            <p className="font-semibold text-gray-900 line-clamp-1">
                                                {article.user?.fullName || article.user?.username || "Tác giả"}
                                            </p>
                                            <p className="text-gray-400">
                                                {formatDate(article.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-3">
                                        {article.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                            <Heart className="w-4 h-4 text-red-500 fill-red-50" />
                                            <span className="font-medium text-gray-700">{article.likeCount ?? 0}</span>
                                        </span>

                                        <span className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
                                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                                            <span className="font-medium text-gray-700">{article.commentCount ?? 0}</span>
                                        </span>
                                    </div>

                                    <span className="text-emerald-600 font-semibold flex items-center gap-1 group-hover:underline">
                                        Đọc tiếp
                                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}