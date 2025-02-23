import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";

export const ParentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="fixed top-0 left-0 right-0 z-50" />
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <Outlet />
      </main>
      <Footer className="fixed bottom-0 left-0 right-0" />
    </div>
  );
};
