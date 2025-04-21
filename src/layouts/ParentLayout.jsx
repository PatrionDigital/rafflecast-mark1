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
    <div className="app-wrapper min-h-screen min-v-screen flex flex-col">
      <Header title="SecondOrder.fun" navLinks={navLinks} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default ParentLayout;
