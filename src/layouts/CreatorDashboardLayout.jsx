import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const CreatorDashboardLayout = () => {
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
export default CreatorDashboardLayout;
