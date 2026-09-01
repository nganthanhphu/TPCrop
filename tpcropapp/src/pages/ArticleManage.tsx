import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    Heart,
    MessageSquare,
    AlertCircle,
    FileText,
    Loader2,
    Calendar,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
} from "@/services/articleService";
import type { Article, ArticleDetail } from "@/types/article";
import { fromNow } from "@/utils/formatDate";

interface ArticleFormData {
    title: string;
    content: string;
}

export default function ArticleManage() {
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const pageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
    const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ArticleFormData>({
        defaultValues: {
            title: "",
            content: "",
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
        data: articlesData,
        isLoading: isArticlesLoading,
        isError: isArticlesError,
        refetch: refetchArticles,
    } = useQuery({
        queryKey: ["myArticles", page, debouncedKeyword, user?.id],
        queryFn: async () => {
            const res = await getArticles({
                page,
                size: pageSize,
                keyword: debouncedKeyword.trim() || undefined,
                userId: user?.id,
            });
            return res.data;
        },
        enabled: isAuthenticated && !!user?.id,
    });

    const articles: Article[] = articlesData?.content || [];
    const totalPages = articlesData?.totalPages || 1;

    const openAddModal = () => {
        setEditingArticleId(null);
        reset({
            title: "",
            content: "",
        });
        setIsFormModalOpen(true);
    };

    const openEditModal = async (article: Article) => {
        setEditingArticleId(article.id);
        setIsLoadingDetail(true);
        setIsFormModalOpen(true);
        try {
            const res = await getArticleById(article.id);
            const detail: ArticleDetail = res.data;
            setValue("title", detail.title || "");
            setValue("content", detail.content || "");
        } catch {
            toast.error("Không thể tải chi tiết bài viết!");
            setIsFormModalOpen(false);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingArticleId(null);
        reset();
    };

    const saveMutation = useMutation({
        mutationFn: async (data: ArticleFormData) => {
            if (editingArticleId) {
                return updateArticle(editingArticleId, {
                    title: data.title.trim(),
                    content: data.content.trim(),
                });
            } else {
                return createArticle({
                    title: data.title.trim(),
                    content: data.content.trim(),
                    userId: user?.id || 0,
                });
            }
        },
        onSuccess: () => {
            toast.success(
                editingArticleId
                    ? "Cập nhật bài viết thành công!"
                    : "Đăng bài viết mới thành công!"
            );
            closeFormModal();
            queryClient.invalidateQueries({ queryKey: ["myArticles"] });
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        onError: () => {
            toast.error(
                editingArticleId
                    ? "Cập nhật bài viết thất bại. Vui lòng thử lại!"
                    : "Đăng bài viết thất bại. Vui lòng thử lại!"
            );
        },
    });

    const onSubmit = (data: ArticleFormData) => {
        saveMutation.mutate(data);
    };

    const deleteMutation = useMutation({
        mutationFn: async (articleId: number) => {
            return deleteArticle(articleId);
        },
        onSuccess: () => {
            toast.success("Đã xóa bài viết thành công!");
            setDeletingArticle(null);
            queryClient.invalidateQueries({ queryKey: ["myArticles"] });
            queryClient.invalidateQueries({ queryKey: ["articles"] });
        },
        onError: () => {
            toast.error("Không thể xóa bài viết. Vui lòng thử lại sau!");
        },
    });

    const confirmDelete = () => {
        if (deletingArticle) {
            deleteMutation.mutate(deletingArticle.id);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Link
                        to="/articles"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại trang bài viết</span>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Quản lý bài viết
                        </h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            Quản lý các bài viết của bạn
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="h-11 inline-flex items-center gap-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm</span>
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
                            placeholder="Tìm kiếm theo tiêu đề..."
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
                    {isArticlesLoading ? (
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
                    ) : isArticlesError ? (
                        <div className="text-center py-16 px-4">
                            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                Không thể tải danh sách bài viết
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Đã xảy ra lỗi khi kết nối máy chủ. Vui lòng thử lại!
                            </p>
                            <button
                                onClick={() => refetchArticles()}
                                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                {debouncedKeyword
                                    ? "Không tìm thấy bài viết phù hợp"
                                    : "Bạn chưa có bài viết nào"}
                            </h3>
                            {!debouncedKeyword && (
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Tạo mới</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Bài viết</th>
                                        <th className="py-4 px-6 text-center">Tương tác</th>
                                        <th className="py-4 px-6 text-center">Thời gian</th>
                                        <th className="py-4 px-6 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {articles.map((article) => (
                                        <tr
                                            key={article.id}
                                            className="hover:bg-emerald-50/30 transition-colors group"
                                        >
                                            <td className="py-4.5 px-6 max-w-md">
                                                <Link
                                                    to={`/articles/${article.id}`}
                                                    className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
                                                >
                                                    {article.title}
                                                </Link>
                                            </td>

                                            <td className="py-4.5 px-6 text-center">
                                                <div className="inline-flex items-center gap-4 text-xs font-semibold">
                                                    <span className="inline-flex items-center gap-1 text-gray-600">
                                                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-50" />
                                                        <span>{article.likeCount || 0}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-gray-600">
                                                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>{article.commentCount || 0}</span>
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4.5 px-6 text-center text-xs text-gray-400 whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {fromNow(article.createdAt)}
                                                </span>
                                            </td>

                                            <td className="py-4.5 px-6 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(article)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                        title="Chỉnh sửa bài viết"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingArticle(article)}
                                                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Xóa bài viết"
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

                    {!isArticlesLoading && !isArticlesError && articles.length > 0 && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50/40">
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

            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <h2 className="text-xl font-extrabold text-gray-900">
                                {editingArticleId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
                            </h2>
                            <button
                                type="button"
                                onClick={closeFormModal}
                                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoadingDetail ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                                <span className="text-sm text-gray-500 font-medium">
                                    Đang tải dữ liệu bài viết...
                                </span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto space-y-5 pr-1">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Tiêu đề bài viết <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tiêu đề bài viết..."
                                        {...register("title", {
                                            required: "Tiêu đề bài viết không được để trống",
                                            maxLength: {
                                                value: 255,
                                                message: "Tiêu đề không được vượt quá 255 ký tự",
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                                            errors.title ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Nội dung bài viết <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={8}
                                        placeholder="Nhập nội dung..."
                                        {...register("content", {
                                            required: "Nội dung bài viết không được để trống",
                                        })}
                                        className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y ${
                                            errors.content ? "border-red-400 bg-red-50/20" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.content && (
                                        <p className="text-xs text-red-500 mt-1.5 font-medium">
                                            {errors.content.message}
                                        </p>
                                    )}
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
                                            {editingArticleId ? "Cập nhật" : "Đăng"}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {deletingArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center">
                        <div className="w-14 h-14 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                            <Trash2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                            Xác nhận xóa bài viết?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Bạn có chắc chắn muốn xóa bài viết{" "}
                            <span className="font-bold text-gray-800">
                                "{deletingArticle.title}"
                            </span>
                            ? Toàn bộ lượt thích và bình luận thuộc bài viết này cũng sẽ bị gỡ bỏ.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingArticle(null)}
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
                                <span>Xóa bài viết</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
