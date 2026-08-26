import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    isLoading?: boolean;
    hide?: boolean;
    showInfo?: boolean;
}

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    isLoading = false,
    hide = true,
    showInfo = true,
}: PaginationProps) {
    if (hide && totalPages <= 1) {
        return null;
    }

    const handlePrev = () => {
        if (page > 0 && !isLoading) {
            onPageChange(Math.max(0, page - 1));
        }
    };

    const handleNext = () => {
        if (page < totalPages - 1 && !isLoading) {
            onPageChange(Math.min(totalPages - 1, page + 1));
        }
    };

    return (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
            {showInfo ? (
                <p className="text-xs sm:text-sm text-gray-500">
                    Hiển thị trang {page + 1} / {totalPages}
                </p>
            ) : (
                <div />
            )}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={page === 0 || isLoading}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 px-2">
                    Trang {page + 1} / {totalPages}
                </span>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={page >= totalPages - 1 || isLoading}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
