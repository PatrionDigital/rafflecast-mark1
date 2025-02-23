import PropTypes from "prop-types";
const RaffleCard = ({ raffle, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="raffle-card" onClick={onClick}>
      <h3>{raffle.title}</h3>
      <p>Creator FID: {raffle.creator}</p>
      <p>Closes: {formatDate(raffle.closingDate)}</p>
    </div>
  );
};

export default RaffleCard;

RaffleCard.propTypes = {
  raffle: PropTypes.shape({
    title: PropTypes.string.isRequired,
    creator: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    closingDate: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};
