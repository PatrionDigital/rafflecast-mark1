import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const EntrantDashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <main className="dashboard-content">
        <Suspense fallback={<p>Loading...</p>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
export default EntrantDashboardLayout;
