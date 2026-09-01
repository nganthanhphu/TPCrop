import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/AuthStore";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const userRole = user?.role?.toUpperCase();
    const isRoleAllowed = !allowedRoles || (userRole ? allowedRoles.includes(userRole) : false);

    useEffect(() => {
        if (isAuthenticated && !isRoleAllowed) {
            toast.error("Bạn không có quyền truy cập trang này");
        }
    }, [isAuthenticated, isRoleAllowed]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isRoleAllowed) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
