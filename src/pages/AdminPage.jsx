import { useRaffle } from "../context/useRaffle";

const AdminPage = () => {
  const { raffles, updateRaffle } = useRaffle();

  // Hardcoded creator address
  const creatorAddress = "0x75Ec16c8944CA40542750C9D406dDb8Fb1F445E9";

  const creatorRaffles = raffles.filter(
    (raffle) => raffle.creator === creatorAddress
  );

  const moveToNewPhase = (raffle) => {
    const nextPhase = {
      Active: "Settled",
      Settled: "Finalized",
      Finalized: "Finalaized",
    };

    const updatedRaffle = {
      ...raffle,
      phase: nextPhase[raffle.phase] || "Finalized",
    };
    updateRaffle(raffle.id, updatedRaffle);
  };

  // Separate raffles by phase
  const activeRaffles = creatorRaffles.filter(
    (raffle) => raffle.phase === "Active"
  );
  const settledRaffles = creatorRaffles.filter(
    (raffle) => raffle.phase === "Settled"
  );
  const finalizedRaffles = creatorRaffles.filter(
    (raffle) => raffle.phase === "Finalized"
  );

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>
        This page is for managing all raffles and handling administrative tasks.
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/** Active Raffles */}
        <div style={{ width: "30%" }}>
          <h2>Active</h2>
          <ul>
            {activeRaffles.length > 0 ? (
              activeRaffles.map((raffle) => (
                <li key={raffle.id}>
                  <strong>{raffle.name}</strong> - Closing Date:{" "}
                  {raffle.closingDate}
                  <button onClick={() => moveToNewPhase(raffle)}>
                    Move to Settled
                  </button>
                </li>
              ))
            ) : (
              <p>No active raffles</p>
            )}
          </ul>
        </div>
        {/** Settled Raffles */}
        <div style={{ width: "30%" }}>
          <h2>Settled</h2>
          <ul>
            {settledRaffles.length > 0 ? (
              settledRaffles.map((raffle) => (
                <li key={raffle.id}>
                  <strong>{raffle.name}</strong>
                  <button onClick={() => moveToNewPhase(raffle)}>
                    Move to Finalized
                  </button>
                </li>
              ))
            ) : (
              <p>No settled raffles</p>
            )}
          </ul>
        </div>
        {/** Finalized Raffles */}
        <div style={{ width: "30%" }}>
          <h2>Finalized</h2>
          <ul>
            {finalizedRaffles.length > 0 ? (
              finalizedRaffles.map((raffle) => (
                <li key={raffle.id}>
                  <strong>{raffle.name}</strong>
                </li>
              ))
            ) : (
              <p>No finalized raffles.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
