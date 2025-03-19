// src/pages/layouts/ParentLayout.jsx

import { Outlet, useMatches, useRouteError } from "react-router-dom";
import Header from "../../components/Header";
import { Footer } from "../../components/Footer";
import ErrorBoundary from "../../components/ErrorBoundary";
import "../../styles/parent-layout.css";

const ParentLayout = () => {
  const matches = useMatches();
  const error = useRouteError();

  // If there's an error, render the error boundary
  if (error) {
    return <ErrorBoundary />;
  }

  // We want the root route's navLinks, not the deepest match
  const navLinks = matches[0]?.handle?.navLinks || [];

  return (
    <div className="app-wrapper">
      <Header title="Rafflecast" navLinks={navLinks} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ParentLayout;
