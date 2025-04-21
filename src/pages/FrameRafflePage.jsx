import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRaffleById } from "@/utils/tursoUtils";
import FrameMeta from "@/components/FrameMeta";

const FrameRafflePage = () => {
  const { raffleId } = useParams();
  const [raffle, setRaffle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "SecondOrder.fun Mini App";

    const fetchRaffle = async () => {
      try {
        console.log("Fetching Raffle Directly from Database:");
        console.log("Raffle ID from params:", raffleId);

        // Directly fetch from database
        const fetchedRaffle = await fetchRaffleById(raffleId);

        console.log("Directly Fetched Raffle:", fetchedRaffle);

        if (!fetchedRaffle) {
          throw new Error("Raffle not found in database");
        }

        setRaffle(fetchedRaffle);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching raffle:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [raffleId]);

  // Rendering logic with improved scrollability
  return (
    <>
      {/* Explicitly pass the raffle to FrameMeta */}
      <FrameMeta raffle={raffle} />

      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#820b8a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          padding: "20px",
          boxSizing: "border-box",
          overflow: "auto",
        }}
      >
        {loading ? (
          <div>
            <h1>SecondOrder.fun</h1>
            <p>Loading Raffle...</p>
          </div>
        ) : error ? (
          <div>
            <h1>SecondOrder.fun</h1>
            <p>Error: {error}</p>
          </div>
        ) : raffle ? (
          <div>
            <h1>SecondOrder.fun</h1>
            <p>Raffle: {raffle.title}</p>
            <p>Closes: {new Date(raffle.closingDate).toLocaleDateString()}</p>
          </div>
        ) : (
          <div>
            <h1>SecondOrder.fun</h1>
            <p>Unexpected state: No raffle found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FrameRafflePage;
