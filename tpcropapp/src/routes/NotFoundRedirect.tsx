import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function NotFoundRedirect() {
    useEffect(() => {
        toast.error("Trang bạn yêu cầu không tồn tại");
    }, []);

    return <Navigate to="/" replace />;
}
