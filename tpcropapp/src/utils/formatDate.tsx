export function formatDate(dateStr?: string): string {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}
