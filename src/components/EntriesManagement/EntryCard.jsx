// src/components/EntriesManagement/EntryCard.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useRaffle } from "../../hooks/useRaffle";

const EntryCard = ({ entry, onClick = () => {} }) => {
  const { getRaffleById, tokenPrices } = useRaffle();
  const [raffleTitle, setRaffleTitle] = useState("");
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the raffle title and token information when the component mounts
  useEffect(() => {
    const fetchRaffleData = async () => {
      if (!entry.raffleId) return;
      
      setLoading(true);
      try {
        const raffle = getRaffleById(entry.raffleId);
        
        if (raffle) {
          // Set raffle title
          setRaffleTitle(raffle.title || `Raffle #${entry.raffleId}`);
          
          // Parse token data if it exists
          if (raffle.ticketToken) {
            const tokenData = typeof raffle.ticketToken === 'string' 
              ? JSON.parse(raffle.ticketToken) 
              : raffle.ticketToken;
            
            // Get token price if available in context
            const price = tokenData.contractAddress && tokenPrices 
              ? tokenPrices[tokenData.contractAddress] 
              : null;
            
            // Set token info with mock balance for now
            setTokenInfo({
              name: tokenData.name,
              symbol: tokenData.symbol,
              contractAddress: tokenData.contractAddress,
              balance: 100, // Mock balance, will be replaced with actual data later
              price: price?.price || "0.000001", // Default price if not available
              change24h: price?.change24h || "0",
              value: (100 * parseFloat(price?.price || 0.000001)).toFixed(2)
            });
          }
        } else {
          setRaffleTitle(`Raffle #${entry.raffleId}`); // Fallback if title not found
        }
      } catch (error) {
        console.error("Error fetching raffle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffleData();
  }, [entry.raffleId, getRaffleById, tokenPrices]);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Determine status class for color coding
  const getStatusClass = (status) => {
    if (!status) return "status-unknown";

    status = status.toLowerCase();
    if (status.includes("active") || status.includes("open"))
      return "status-active";
    if (status.includes("win") || status.includes("success"))
      return "status-success";
    if (status.includes("closed") || status.includes("ended"))
      return "status-closed";
    return "status-unknown";
  };

  // Get price change indicator and class
  const getPriceChangeIndicator = () => {
    if (!tokenInfo?.change24h) return null;
    
    const change = parseFloat(tokenInfo.change24h);
    const isPositive = change >= 0;
    
    return {
      symbol: isPositive ? "↑" : "↓",
      class: isPositive ? "text-green-500" : "text-red-500",
      value: Math.abs(change).toFixed(2) + "%"
    };
  };

  const priceChange = getPriceChangeIndicator();

  return (
    <div className="entry-card cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <h3 className="font-semibold text-lg mb-2">{raffleTitle}</h3>

      <div className="entry-details space-y-1">
        <p data-label="Entered:">
          <span>{formatDate(entry.enteredAt)}</span>
        </p>

        <p data-label="Status:">
          <span className={`status-badge ${getStatusClass(entry.status)}`}>
            {entry.status || "Unknown"}
          </span>
        </p>

        {entry.ticketCount && (
          <p data-label="Tickets:">
            <span>{entry.ticketCount}</span>
          </p>
        )}

        {entry.prizeWallet && (
          <p data-label="Prize Wallet:">
            <span className="prize-wallet font-mono text-xs">
              {entry.prizeWallet.substring(0, 6)}...
              {entry.prizeWallet.substring(entry.prizeWallet.length - 4)}
            </span>
          </p>
        )}
        
        {/* New Token Position Information */}
        {tokenInfo && (
          <div className="mt-3 pt-2 border-t border-enamel-red/20">
            <div className="p-2 rounded-md bg-asphalt/50 border-l-2 border-cochineal-red">
              <p className="text-sm font-medium mb-1">
                Token Position: {tokenInfo.symbol}
              </p>
              <div className="flex justify-between items-center text-xs">
                <span>Balance: {tokenInfo.balance}</span>
                {tokenInfo.price && (
                  <span>
                    Price: ${parseFloat(tokenInfo.price).toFixed(6)}
                    {priceChange && (
                      <span className={`ml-1 ${priceChange.class}`}>
                        {priceChange.symbol} {priceChange.value}
                      </span>
                    )}
                  </span>
                )}
              </div>
              <div className="text-right text-xs font-medium mt-1">
                Value: ${tokenInfo.value}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card-footer mt-3 pt-2 border-t border-enamel-red/20 flex justify-end">
        <button className="text-sm px-3 py-1 bg-cochineal-red text-white rounded hover:bg-enamel-red transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

EntryCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    raffleId: PropTypes.string.isRequired,
    enteredAt: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    status: PropTypes.string,
    ticketCount: PropTypes.number,
    prizeWallet: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default EntryCard;