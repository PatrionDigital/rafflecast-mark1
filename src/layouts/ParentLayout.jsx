import { Outlet, useMatches, useRouteError } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

// Helper function to check if we should skip the layout
const useSkipLayout = () => {
  const matches = useMatches();
  return matches.some((match) => match.handle?.skipLayout);
};

const ParentLayout = () => {
  const matches = useMatches();
  const error = useRouteError();
  const skipLayout = useSkipLayout();

  // If there's an error, render the error boundary
  if (error) {
    return <ErrorBoundary />;
  }

  // Skip the layout for frame routes
  if (skipLayout) {
    return <Outlet />;
  }

  // We want the root route's navLinks, not the deepest match
  const navLinks = matches[0]?.handle?.navLinks || [];

  return (
    <div className="app-wrapper">
      <Header title="SecondOrder.fun" navLinks={navLinks} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ParentLayout;
