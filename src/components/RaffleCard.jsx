import PropTypes from "prop-types";
const RaffleCard = ({ raffle, onClick }) => {
  return (
    <div className="raffle-card" onClick={onClick}>
      <h3>{raffle.title}</h3>
      <p>Creator FID: {raffle.creator}</p>
      <p>Start Date: {new Date(raffle.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(raffle.closingDate).toLocaleDateString()}</p>
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
