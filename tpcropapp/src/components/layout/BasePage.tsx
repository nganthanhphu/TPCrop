import Header from "@/components/layout/Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function BasePage({ children, headerNav }: { children?: React.ReactNode, headerNav?: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header>
                {headerNav}
            </Header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )

}