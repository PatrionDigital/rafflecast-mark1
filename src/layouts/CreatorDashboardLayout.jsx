// src/layouts/CreatorDashboardLayout.jsx
import { Suspense } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
//import { useProfile } from "@farcaster/auth-kit";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody, Button } from "@windmill/react-ui";
import {
  PlusIcon,
  ListBulletIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const CreatorDashboardLayout = () => {
  const location = useLocation();
  //const { isAuthenticated } = useProfile();
  const { isAuthenticated } = useAuth();

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="flex flex-grow container mx-auto px-4 py-6">
        <Card>
          <CardBody className="text-center p-8">
            <h2 className="text-2xl font-bold text-cochineal-red mb-4">
              Authentication Required
            </h2>
            <p className="mb-6">
              Please sign in with Warpcast to access the creator dashboard.
            </p>
            {/* Authentication button would go here */}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Actions Bar */}
      {location.pathname !== "/creator/create" && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button as={Link} to="/creator/create" iconLeft={PlusIcon}>
            Create Raffle
          </Button>
          <Button
            as={Link}
            to="/creator/raffles/manage"
            layout="outline"
            iconLeft={ListBulletIcon}
          >
            Manage Raffles
          </Button>
          <Button
            as={Link}
            to="/profile"
            layout="outline"
            iconLeft={UserCircleIcon}
          >
            My Profile
          </Button>
        </div>
      )}

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
