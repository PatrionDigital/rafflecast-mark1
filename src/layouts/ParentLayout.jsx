// src/layouts/ParentLayout.jsx
import { Outlet, useMatches, useRouteError } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

// Helper function to check if we should skip the layout
const useSkipLayout = () => {
  const matches = useMatches();
  // Skip the parent layout for frame routes or if specified in route handle
  return matches.some(
    (match) => match.pathname.startsWith("/frame") || match.handle?.skipLayout
  );
};

const ParentLayout = () => {
  const matches = useMatches();
  const error = useRouteError();
  const skipLayout = useSkipLayout();

  // If there's an error, render the error boundary
  if (error) {
    return <ErrorBoundary />;
  }

  // Skip the layout for specified routes (frames or custom routes)
  if (skipLayout) {
    return <Outlet />;
  }

  // Get navigation links from the route's handle
  const navLinks = matches[0]?.handle?.navLinks || [];

  return (
    <div className="min-h-screen flex flex-col bg-black text-cement">
      <Header title="SecondOrder.fun" navLinks={navLinks} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ParentLayout;
