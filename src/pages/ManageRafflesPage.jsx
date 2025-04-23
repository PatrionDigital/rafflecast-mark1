// src/pages/ManageRafflesPage.jsx - Refactored with Tailwind
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody, Button } from "@windmill/react-ui";
import { PlusIcon } from "@heroicons/react/24/outline";

import Pagination from "@/components/Pagination";
import RaffleCard from "@/components/RaffleCard";
import RaffleEntriesModal from "@/components/RaffleManagement/RaffleEntriesModal";
import RaffleDetailsPanel from "@/components/RaffleDetailsPanel";
import { useRaffle } from "@/hooks/useRaffle";
import { settleRaffle } from "@/utils/raffleUtils";

// Main Component
const ManageRafflesPage = () => {
  const { raffleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const { getRafflesByCreator, getEntriesByRaffleId, getRaffleById } =
    useRaffle();
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Entries modal state
  const [entries, setEntries] = useState([]);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [showEntriesModal, setShowEntriesModal] = useState(false);

  // Details panel state
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  // Responsive layout adjustments
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setItemsPerPage(4); // 4 columns on large screens
      } else if (width >= 960) {
        setItemsPerPage(3); // 3 columns on medium screens
      } else if (width >= 640) {
        setItemsPerPage(2); // 2 columns on small screens
      } else {
        setItemsPerPage(1); // 1 column on mobile
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Parse JSON string fields in raffles
  const parseRaffleData = (raffleData) => {
    // Create a copy to avoid mutating the original data
    const parsedRaffles = raffleData.map((raffle) => {
      const parsedRaffle = { ...raffle };

      // Parse ticketToken if it's a string
      if (
        typeof parsedRaffle.ticketToken === "string" &&
        parsedRaffle.ticketToken
      ) {
        try {
          parsedRaffle.ticketToken = JSON.parse(parsedRaffle.ticketToken);
        } catch (error) {
          console.error(
            `Error parsing ticketToken for raffle ${parsedRaffle.id}:`,
            error
          );
          // Keep the original string if parsing fails
        }
      }

      // Parse prize if it's a string
      if (typeof parsedRaffle.prize === "string" && parsedRaffle.prize) {
        try {
          parsedRaffle.prize = JSON.parse(parsedRaffle.prize);
        } catch (error) {
          console.error(
            `Error parsing prize for raffle ${parsedRaffle.id}:`,
            error
          );
          // Keep the original string if parsing fails
        }
      }

      return parsedRaffle;
    });

    return parsedRaffles;
  };

  // Load raffles when component mounts
  useEffect(() => {
    const loadRaffles = async () => {
      if (!isAuthenticated || !profile?.fid) return;

      setLoading(true);
      try {
        const fetchedRaffles = getRafflesByCreator(profile.fid);
        // Parse JSON string fields
        const parsedRaffles = parseRaffleData(fetchedRaffles);
        setRaffles(parsedRaffles);

        // If there's a raffleId in the URL, open the details panel for that raffle
        if (raffleId) {
          const targetRaffle = parsedRaffles.find((r) => r.id === raffleId);
          if (targetRaffle) {
            setSelectedRaffle(targetRaffle);
            setShowDetailsPanel(true);
          }
        }
      } catch (error) {
        console.error("Error fetching raffles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRaffles();
  }, [isAuthenticated, profile, getRafflesByCreator, raffleId]);

  const handleCheckEntries = async (raffleId) => {
    setFetchingEntries(true);
    setShowEntriesModal(true);

    try {
      const fetchedEntries = await getEntriesByRaffleId(raffleId);
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setFetchingEntries(false);
    }
  };

  const handleCloseEntriesModal = () => {
    setShowEntriesModal(false);
    setEntries([]);
  };

  const handleViewDetails = (raffleId) => {
    // Instead of just showing the modal, update the URL without reloading the page
    navigate(`/creator/manage/${raffleId}`, { replace: true });

    // Find the raffle in our already parsed collection
    const raffle = raffles.find((r) => r.id === raffleId);
    if (raffle) {
      setSelectedRaffle(raffle);
      setShowDetailsPanel(true);
    }
  };

  const handleCloseDetailsPanel = () => {
    // When closing the panel, navigate back to the manage page without the raffleId
    navigate("/creator/manage", { replace: true });
    setShowDetailsPanel(false);
    setSelectedRaffle(null);
  };

  const handleSettleRaffle = async (raffleId) => {
    if (!raffles || raffles.length === 0) {
      console.log("No raffles available to settle.");
      return;
    }

    try {
      const raffle = raffles.find((r) => r.id === raffleId);
      const entriesForRaffle = await getEntriesByRaffleId(raffleId);
      const result = await settleRaffle(raffle, entriesForRaffle);

      if (result.success) {
        console.log(`Raffle ${raffleId} has been settled.`);

        // Update the local state
        const updatedRaffles = raffles.map((r) =>
          r.id === raffleId ? { ...r, phase: "Settled" } : r
        );
        setRaffles(updatedRaffles);
      } else {
        console.log(result.error || "Error settling raffle");
      }
    } catch (error) {
      console.log(error.message || "Error settling raffle");
    }
  };

  const handleRaffleClick = (raffle) => {
    handleViewDetails(raffle.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center p-8">
            <h2 className="text-2xl font-bold text-cochineal-red mb-4">
              Authentication Required
            </h2>
            <p className="text-cement mb-6">
              Please sign in with Warpcast to manage your raffles.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="w-16 h-16 border-4 border-t-cochineal-red border-b-cochineal-red rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-cement">Loading your raffles...</p>
      </div>
    );
  }

  // Pagination for current raffles
  const indexOfLastRaffle = currentPage * itemsPerPage;
  const indexOfFirstRaffle = indexOfLastRaffle - itemsPerPage;
  const currentRaffles = raffles.slice(indexOfFirstRaffle, indexOfLastRaffle);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-2xl font-bold text-cochineal-red mb-4 md:mb-0">
          Manage Your Raffles
        </h3>
      </div>

      {!raffles.length ? (
        <Card className="text-center p-8">
          <CardBody>
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-3 text-asphalt">
                No Raffles Yet
              </h3>
              <p className="text-cement mb-6">
                You haven&apos;t created any raffles yet. Get started by
                creating your first raffle!
              </p>
              <Link to="/creator/new">
                <Button className="bg-cochineal-red hover:bg-enamel-red">
                  Create Your First Raffle
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentRaffles.map((raffle) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                onClick={() => handleRaffleClick(raffle)}
              />
            ))}
          </div>

          <Pagination
            totalItems={raffles.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Entries Modal */}
      {showEntriesModal && (
        <RaffleEntriesModal
          entries={entries}
          isLoading={fetchingEntries}
          onClose={handleCloseEntriesModal}
        />
      )}

      {/* Raffle Details Panel */}
      {showDetailsPanel && selectedRaffle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <RaffleDetailsPanel
              raffle={selectedRaffle}
              onClose={handleCloseDetailsPanel}
              isInFrame={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRafflesPage;
