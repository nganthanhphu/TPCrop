import React from "react";
import UnauthenticatedNav from "@/components/nav/UnauthenticatedNav";
import FarmerNav from "@/components/nav/FarmerNav";

const NAV_REGISTRY: Record<string, React.ComponentType> = {
    FARMER: FarmerNav,
    ROLE_FARMER: FarmerNav,
};

export function getNavByRole(role?: string | null, isAuthenticated?: boolean): React.ReactNode {
    if (!isAuthenticated || !role) {
        return <UnauthenticatedNav />;
    }

    const NavComponent = NAV_REGISTRY[role.toUpperCase()] ?? UnauthenticatedNav;
    return <NavComponent />;
}
