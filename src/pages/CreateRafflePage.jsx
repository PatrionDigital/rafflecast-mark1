import { useRaffle } from "../context/useRaffle";

const CreateRafflePage = () => {
  const { addRaffle } = useRaffle();
  const handleAddRaffle = () => {
    const testRaffle = {
      creator: "0x75Ec16c8944CA40542750C9D406dDb8Fb1F445E9",
      name: "Test Raffle",
      linkedCast: "https://warpcase.com/test",
      closingDate: "2024-12-31",
      challengePeriod: "2025-01-07",
    };
    addRaffle(testRaffle);
  };
  return (
    <div>
      <h1>Create Raffle</h1>
      <button onClick={handleAddRaffle}>Add Test Raffle</button>
      <p>Here, the raffle creator will set conditions and closing date.</p>
    </div>
  );
};

export default CreateRafflePage;
