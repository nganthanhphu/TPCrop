import BasePage from "@/components/layout/BasePage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Plots from "@/pages/Plots";
import PlotTasks from "@/pages/PlotTasks";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <BasePage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "plots",
                element: <Plots />,
            },
            {
                path: "plots/:plotId/tasks",
                element: <PlotTasks />,
            }
        ]
    }
]);