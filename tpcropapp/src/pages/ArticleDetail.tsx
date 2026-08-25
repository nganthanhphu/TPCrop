import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    ArrowLeft,
    Heart,
    MessageSquare,
    Send,
    CornerDownRight,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Loader2,
    Calendar,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import { useAuthStore } from "@/stores/AuthStore";
import {
    getArticleById,
    getArticleLikeStatus,
    likeArticle,
    unlikeArticle,
} from "@/services/articleService";
import { getComments, createComment } from "@/services/commentService";
import type { ArticleDetail as ArticleDetailType } from "@/types/article";
import type { Comment } from "@/types/comment";
import { fromNow } from "@/utils/formatDate";

interface CommentItemProps {
    comment: Comment;
    articleId: number;
    level?: number;
}

function CommentItem({ comment, articleId, level = 1 }: CommentItemProps) {
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    const [isRepliesOpen, setIsRepliesOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyPage, setReplyPage] = useState(0);
    const replyPageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const {
        data: childCommentsData,
        isLoading: isChildLoading,
    } = useQuery({
        queryKey: ["childComments", articleId, comment.id, replyPage],
        queryFn: async () => {
            const res = await getComments(articleId, {
                parentId: comment.id,
                page: replyPage,
                size: replyPageSize,
            });
            return res.data;
        },
        enabled: isRepliesOpen,
    });

    const replyMutation = useMutation({
        mutationFn: async (content: string) => {
            return createComment(articleId, {
                content,
                articleId,
                parentId: comment.id,
            });
        },
        onSuccess: () => {
            toast.success("Bình luận thành công!");
            setReplyText("");
            setIsReplying(false);
            setIsRepliesOpen(true);
            queryClient.invalidateQueries({
                queryKey: ["childComments", articleId, comment.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["article", articleId],
            });
        },
        onError: () => {
            toast.error("Không thể bình luận. Vui lòng thử lại sau.");
        },
    });

    const handleSendReply = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info("Vui lòng đăng nhập để phản hồi bình luận!");
            navigate("/login");
            return;
        }
        if (!replyText.trim()) return;
        replyMutation.mutate(replyText.trim());
    };

    const childComments: Comment[] = childCommentsData?.content || [];
    const childTotalPages = childCommentsData?.totalPages || 1;

    const levelContainerStyles =
        level === 1
            ? "bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:border-gray-200"
            : "bg-gray-50/80 rounded-xl p-3.5 sm:p-4 border border-gray-100 shadow-xs";

    return (
        <div className={`${levelContainerStyles} transition-colors`}>
            <div className="flex items-start gap-3">
                {comment.user?.avatar ? (
                    <img
                        src={comment.user.avatar}
                        alt={comment.user.fullName || comment.user.username}
                        className={`${
                            level === 1 ? "w-8 h-8 sm:w-9 sm:h-9" : "w-7 h-7 sm:w-8 sm:h-8"
                        } rounded-full object-cover border border-emerald-100 shrink-0`}
                    />
                ) : (
                    <div
                        className={`${
                            level === 1 ? "w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm" : "w-7 h-7 sm:w-8 sm:h-8 text-[11px]"
                        } rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0`}
                    >
                        {(comment.user?.fullName || comment.user?.username || "U").charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-gray-900">
                            {comment.user?.fullName || comment.user?.username || "Người dùng"}
                        </span>
                        <span className="text-[11px] sm:text-xs text-gray-400">
                            {fromNow(comment.createdAt)}
                        </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-4 mt-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    toast.info("Vui lòng đăng nhập để tham gia thảo luận!");
                                    navigate("/login");
                                    return;
                                }
                                setIsReplying(!isReplying);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                        >
                            <CornerDownRight className="w-3.5 h-3.5" />
                            <span>{isReplying ? "Hủy" : "Trả lời"}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsRepliesOpen((prev) => !prev)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                        >
                            {isRepliesOpen ? (
                                <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    <span>Ẩn bớt</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    <span>Xem thêm</span>
                                </>
                            )}
                        </button>
                    </div>

                    {isReplying && (
                        <form onSubmit={handleSendReply} className="mt-3.5 pt-3 border-t border-gray-100 flex items-start gap-2">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Trả lời ${comment.user?.fullName || comment.user?.username || "bình luận"}...`}
                                className="flex-1 h-9 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={replyMutation.isPending || !replyText.trim()}
                                className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer shrink-0"
                            >
                                {replyMutation.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Send className="w-3.5 h-3.5" />
                                )}
                                <span>Gửi</span>
                            </button>
                        </form>
                    )}

                    {isRepliesOpen && (
                        <div className="mt-4 pt-3 space-y-3 pl-3 sm:pl-4 border-l-2 border-emerald-100">
                            {isChildLoading ? (
                                <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                                    <span>Đang tải câu trả lời...</span>
                                </div>
                            ) : childComments.length === 0 ? (
                                <p className="text-xs text-gray-400 italic py-1">
                                    Chưa có câu trả lời nào.
                                </p>
                            ) : (
                                <>
                                    {childComments.map((child) => (
                                        <CommentItem
                                            key={child.id}
                                            comment={child}
                                            articleId={articleId}
                                            level={level + 1}
                                        />
                                    ))}

                                    <Pagination
                                        page={replyPage}
                                        totalPages={childTotalPages}
                                        onPageChange={setReplyPage}
                                        isLoading={isChildLoading}
                                        showInfo={false}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ArticleDetail() {
    const { articleId } = useParams<{ articleId: string }>();
    const numericArticleId = Number(articleId);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const [commentPage, setCommentPage] = useState(0);
    const [newCommentText, setNewCommentText] = useState("");
    const commentPageSize = Number(import.meta.env.VITE_PAGE_SIZE) || 10;

    const {
        data: article,
        isLoading: isArticleLoading,
        isError: isArticleError,
        refetch: refetchArticle,
    } = useQuery<ArticleDetailType>({
        queryKey: ["article", numericArticleId],
        queryFn: async () => {
            const res = await getArticleById(numericArticleId);
            return res.data;
        },
        enabled: !isNaN(numericArticleId),
    });

    const { data: likeStatus } = useQuery({
        queryKey: ["articleLikeStatus", numericArticleId],
        queryFn: async () => {
            const res = await getArticleLikeStatus(numericArticleId);
            return res.data;
        },
        enabled: isAuthenticated && !isNaN(numericArticleId),
    });

    const isLiked = likeStatus?.isLiked ?? false;

    const toggleLikeMutation = useMutation({
        mutationFn: async () => {
            if (isLiked) {
                return unlikeArticle(numericArticleId);
            } else {
                return likeArticle(numericArticleId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["articleLikeStatus", numericArticleId],
            });
            queryClient.invalidateQueries({
                queryKey: ["article", numericArticleId],
            });
        },
        onError: () => {
            toast.error("Không thể thao tác thích bài viết. Vui lòng thử lại sau.");
        },
    });

    const handleToggleLike = () => {
        if (!isAuthenticated) {
            toast.info("Vui lòng đăng nhập để thích bài viết!");
            navigate("/login");
            return;
        }
        toggleLikeMutation.mutate();
    };

    const {
        data: rootCommentsData,
        isLoading: isCommentsLoading,
    } = useQuery({
        queryKey: ["rootComments", numericArticleId, commentPage],
        queryFn: async () => {
            const res = await getComments(numericArticleId, {
                page: commentPage,
                size: commentPageSize,
            });
            return res.data;
        },
        enabled: !isNaN(numericArticleId),
    });

    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            return createComment(numericArticleId, {
                content,
                articleId: numericArticleId,
                parentId: null,
            });
        },
        onSuccess: () => {
            toast.success("Đã gửi bình luận!");
            setNewCommentText("");
            setCommentPage(0);
            queryClient.invalidateQueries({
                queryKey: ["rootComments", numericArticleId],
            });
            queryClient.invalidateQueries({
                queryKey: ["article", numericArticleId],
            });
        },
        onError: () => {
            toast.error("Không thể gửi bình luận. Vui lòng thử lại sau.");
        },
    });

    const handleSendRootComment = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info("Vui lòng đăng nhập để bình luận!");
            navigate("/login");
            return;
        }
        if (!newCommentText.trim()) return;
        addCommentMutation.mutate(newCommentText.trim());
    };

    const rootComments: Comment[] = rootCommentsData?.content || [];
    const rootTotalPages = rootCommentsData?.totalPages || 1;

    if (isArticleLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32" />
                                <div className="h-3 bg-gray-200 rounded w-24" />
                            </div>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isArticleError || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-16 px-4">
                <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Không tìm thấy bài viết
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Bài viết này có thể đã bị xóa hoặc đường dẫn không hợp lệ.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Link
                            to="/articles"
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-sm transition-all"
                        >
                            Về danh sách bài viết
                        </Link>
                        <button
                            onClick={() => refetchArticle()}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all cursor-pointer"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50 text-gray-800 py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <article className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-emerald-100/80 shadow-lg shadow-emerald-950/5 mb-8">
                    <h1 className="text-xl sm:text-xl lg:text-2xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                            {article.user?.avatar ? (
                                <img
                                    src={article.user.avatar}
                                    alt={article.user.fullName || article.user.username}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-100 shrink-0"
                                />
                            ) : (
                                <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                                    {(article.user?.fullName || article.user?.username || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-gray-900">
                                    {article.user?.fullName || article.user?.username || "Tác giả"}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                    <span className="inline-flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {fromNow(article.createdAt)}
                                    </span>
                                    {article.updatedAt && article.updatedAt !== article.createdAt && (
                                        <span>
                                            (Đã cập nhật: {fromNow(article.updatedAt)})
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleToggleLike}
                                disabled={toggleLikeMutation.isPending}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-xs ${
                                    isLiked
                                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/80"
                                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-red-500"
                                }`}
                            >
                                <Heart
                                    className={`w-4 h-4 transition-transform active:scale-125 ${
                                        isLiked ? "fill-red-500 text-red-500" : ""
                                    }`}
                                />
                                <span>{article.likeCount ?? 0}</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-8 text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap break-words space-y-4">
                        {article.content}
                    </div>
                </article>

                <section className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="w-5 h-5 text-emerald-600" />
                        <h2 className="text-xl font-extrabold text-gray-900">
                            Bình luận ({article.commentCount ?? 0})
                        </h2>
                    </div>

                    <form onSubmit={handleSendRootComment} className="mb-8">
                        <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                            <textarea
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                rows={3}
                                placeholder={
                                    isAuthenticated
                                        ? "Đặt câu hỏi hoặc nhận xét về bài viết..."
                                        : "Vui lòng đăng nhập để tham gia bình luận..."
                                }
                                className="w-full bg-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none resize-none"
                            />
                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200/80">
                                <span className="text-xs text-gray-400">
                                    {!isAuthenticated && "Đăng nhập để gửi bình luận"}
                                </span>
                                <button
                                    type="submit"
                                    disabled={addCommentMutation.isPending || !newCommentText.trim()}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                                >
                                    {addCommentMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    <span>Gửi</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {isCommentsLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-50 rounded-2xl p-5 border border-gray-100 animate-pulse space-y-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-200 rounded-full" />
                                        <div className="h-4 bg-gray-200 rounded w-28" />
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                </div>
                            ))}
                        </div>
                    ) : rootComments.length === 0 ? (
                        <div className="text-center py-12 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 font-medium">
                                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {rootComments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    articleId={numericArticleId}
                                    level={1}
                                />
                            ))}

                            <Pagination
                                page={commentPage}
                                totalPages={rootTotalPages}
                                onPageChange={setCommentPage}
                                isLoading={isCommentsLoading}
                            />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
