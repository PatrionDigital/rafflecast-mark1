import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "../Breadcrumbs";

const EntrantDashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Breadcrumbs />
      <main className="dashboard-content">
        <Suspense fallback={<p>Loading...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
export default EntrantDashboardLayout;
