import BasePage from "@/components/layout/BasePage";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <BasePage />,
    }
])