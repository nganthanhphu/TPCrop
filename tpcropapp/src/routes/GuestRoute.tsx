import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";

export default function GuestRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
