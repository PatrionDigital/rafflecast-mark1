import { Outlet, useMatches, useRouteError } from "react-router-dom";
import Header from "../../components/Header";
import { Footer } from "../../components/Footer";
import ErrorBoundary from "../../components/ErrorBoundary";
import MessageDisplay from "../../components/MessageDisplay";
import { MessageProvider } from "../../context/MessageContext";

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
    <MessageProvider>
      <div className="flex flex-col min-h-screen">
        <Header title="Rafflecast" navLinks={navLinks} />
        <MessageDisplay />
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MessageProvider>
  );
};

export default ParentLayout;
