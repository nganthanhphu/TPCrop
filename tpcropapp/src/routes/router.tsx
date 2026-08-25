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
import Crops from "@/pages/Crops";
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
            },
            {
                path: "crops",
                element: <Crops />,
            },
            {
                path: "seasons",
                element: <Seasons />,
            },
            {
                path: "articles",
                element: <Articles />,
            },
            {
                path: "articles/manage",
                element: <ArticleManage />,
            },
            {
                path: "articles/:articleId",
                element: <ArticleDetail />,
            }
        ]
    }
]);