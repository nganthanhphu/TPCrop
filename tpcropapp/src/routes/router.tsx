import BasePage from "@/components/layout/BasePage";
import UnauthenticatedNav from "@/components/nav/UnauthenticatedNav";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <BasePage headerNav={<UnauthenticatedNav />} />,
        children: [
            {
                index: true,
                element: <Home />,
            }
        ]
    }
])