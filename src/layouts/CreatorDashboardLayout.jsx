// src/layouts/CreatorDashboardLayout.jsx
import { Suspense } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody, Button } from "@windmill/react-ui";
import {
  PlusIcon,
  ListBulletIcon,
  ArrowLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const CreatorDashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Check if we're on a specific page to adapt the UI
  const isCreatePage = location.pathname.includes("/creator/new");
  const isManagePage = location.pathname.includes("/creator/manage");
  const isSuccessPage = location.pathname.includes("/creator/success");

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardBody className="text-center p-8">
            <h2 className="text-2xl font-bold text-cochineal-red mb-4">
              Authentication Required
            </h2>
            <p className="mb-6 text-cement">
              Please sign in with Warpcast to access the creator dashboard.
            </p>
            {/* Authentication button would go here */}
          </CardBody>
        </Card>
      </div>
    );
  }

  // Go back to manage page or home
  const handleBack = () => {
    if (isCreatePage || isSuccessPage) {
      navigate("/creator/manage");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap gap-2 mb-6 justify-between items-center">
        {/* Left side - Back button or title */}
        <div>
          {isCreatePage || isSuccessPage ? (
            <Button
              layout="outline"
              onClick={handleBack}
              iconLeft={ArrowLeftIcon}
              className="text-cochineal-red hover:text-enamel-red"
            >
              Back to Raffles
            </Button>
          ) : (
            <h1 className="text-2xl font-bold text-cochineal-red">
              Creator Dashboard
            </h1>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex flex-wrap gap-2">
          {!isCreatePage && (
            <Link to="/creator/new">
              <Button
                iconLeft={PlusIcon}
                className="bg-cochineal-red hover:bg-enamel-red"
              >
                Create Raffle
              </Button>
            </Link>
          )}

          {!isManagePage && (
            <Link to="/creator/manage">
              <Button
                layout="outline"
                iconLeft={ListBulletIcon}
                className="text-cochineal-red border-cochineal-red hover:bg-cochineal-red hover:text-white"
              >
                Manage Raffles
              </Button>
            </Link>
          )}

          <Link to="/profile">
            <Button
              layout="outline"
              iconLeft={UserCircleIcon}
              className="text-asphalt border-asphalt hover:bg-asphalt hover:text-white"
            >
              My Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatorDashboardLayout;
