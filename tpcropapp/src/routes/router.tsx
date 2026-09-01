import BasePage from "@/components/layout/BasePage";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Plots from "@/pages/Plots";
import PlotTasks from "@/pages/PlotTasks";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import ArticleManage from "@/pages/ArticleManage";
import Seasons from "@/pages/Seasons";
import SeasonTasks from "@/pages/SeasonTasks";
import Crops from "@/pages/Crops";
import Profile from "@/pages/Profile";
import Users from "@/pages/Users";
import Analytics from "@/pages/Analytics";
import ProtectedRoute from "@/routes/ProtectedRoute";
import GuestRoute from "@/routes/GuestRoute";
import NotFoundRedirect from "@/routes/NotFoundRedirect";
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
                path: "articles",
                element: <Articles />,
            },
            {
                path: "articles/:articleId",
                element: <ArticleDetail />,
            },
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: "login",
                        element: <Login />,
                    },
                    {
                        path: "register",
                        element: <Register />,
                    },
                ],
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                    {
                        path: "articles/manage",
                        element: <ArticleManage />,
                    },
                ],
            },
            {
                element: <ProtectedRoute allowedRoles={["FARMER"]} />,
                children: [
                    {
                        path: "plots",
                        element: <Plots />,
                    },
                    {
                        path: "plots/:plotId/tasks",
                        element: <PlotTasks />,
                    },
                ],
            },
            {
                element: <ProtectedRoute allowedRoles={["MANAGER"]} />,
                children: [
                    {
                        path: "crops",
                        element: <Crops />,
                    },
                    {
                        path: "seasons",
                        element: <Seasons />,
                    },
                    {
                        path: "seasons/:seasonId/tasks",
                        element: <SeasonTasks />,
                    },
                    {
                        path: "users",
                        element: <Users />,
                    },
                    {
                        path: "analytics",
                        element: <Analytics />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFoundRedirect />,
            },
        ],
    },
]);