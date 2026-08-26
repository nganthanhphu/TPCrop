import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Search,
    X,
    Heart,
    MessageSquare,
    AlertCircle,
    FileText,
    SlidersHorizontal,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { getArticles } from "@/services/articleService";
import type { Article } from "@/types/article";
import { fromNow } from "@/utils/formatDate";

export default function Articles() {
    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 6;

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
        data: articlesData,
        isLoading: isArticlesLoading,
        isError: isArticlesError,
        refetch: refetchArticles,
    } = useQuery({
        queryKey: ["articles", page, debouncedKeyword, sortBy],
        queryFn: async () => {
            const res = await getArticles({
                page,
                size: pageSize,
                keyword: debouncedKeyword.trim() || undefined,
                sortBy: sortBy || undefined,
            });
            return res.data;
        },
    });

    const articles: Article[] = articlesData?.content || [];
    const totalPages = articlesData?.totalPages || 1;

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Kiến thức & Kinh nghiệm
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Tổng hợp các bài viết chia sẻ kỹ thuật canh tác, phòng trừ sâu bệnh và kinh nghiệm nông nghiệp
                        </p>
                    </div>

                    <Link
                        to="/articles/manage"
                        className="h-11 inline-flex items-center gap-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto shrink-0"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Quản lý bài viết</span>
                    </Link>
                </div>

                <div className="flex justify-end items-center mb-8">
                    <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
                        <div className="relative flex items-center min-w-[240px] sm:min-w-[280px]">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm bài viết..."
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

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(0);
                            }}
                            className="h-11 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                        >
                            <option value="createdAt">Mới nhất</option>
                            <option value="likeCount">Độ yêu thích</option>
                            <option value="commentCount">Độ thảo luận</option>
                        </select>
                    </div>
                </div>

                {isArticlesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between h-56"
                            >
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
                ) : isArticlesError ? (
                    <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-200 shadow-sm">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            Không thể tải danh sách bài viết
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.
                        </p>
                        <button
                            onClick={() => refetchArticles()}
                            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20 px-4 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                        <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {debouncedKeyword ? "Không tìm thấy bài viết phù hợp" : "Chưa có bài viết nào"}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                            {debouncedKeyword
                                ? `Không có bài viết nào khớp với từ khóa "${debouncedKeyword}".`
                                : "Hiện chưa có bài viết nào được chia sẻ trong danh mục này."}
                        </p>
                        {debouncedKeyword && (
                            <button
                                onClick={() => {
                                    setKeyword("");
                                    setDebouncedKeyword("");
                                    setPage(0);
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                            >
                                <span>Xem tất cả bài viết</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    to={`/articles/${article.id}`}
                                    className="flex flex-col justify-between bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 group"
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
                                                    {fromNow(article.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-3">
                                            {article.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 text-xs text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 text-gray-600">
                                                <Heart className="w-4 h-4 text-red-500 fill-red-50" />
                                                <span className="font-semibold">{article.likeCount ?? 0}</span>
                                            </span>

                                            <span className="flex items-center gap-1.5 text-gray-600">
                                                <MessageSquare className="w-4 h-4 text-emerald-600" />
                                                <span className="font-semibold">{article.commentCount ?? 0}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            isLoading={isArticlesLoading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
