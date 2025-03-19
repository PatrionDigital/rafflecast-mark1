// src/frames/api/raffleImage.js
/**
 * Utility to generate raffle images for Frames meta tags
 * This simulates a server-side API that would render images for each raffle
 */

/**
 * Creates a data URL for a raffle image
 * @param {Object} raffleData Raffle data
 * @returns {string} Data URL of the image
 */
export const createRaffleImageDataUrl = (raffleData) => {
  // Create a canvas to draw the image
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#131313";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw border
  ctx.strokeStyle = "#ff47da";
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Draw title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  const title = raffleData?.title || "Rafflecast";
  ctx.fillText(title, canvas.width / 2, 150);

  // Draw description if available
  if (raffleData?.description) {
    ctx.font = "36px Arial";
    const description =
      raffleData.description.length > 80
        ? raffleData.description.substring(0, 77) + "..."
        : raffleData.description;
    ctx.fillText(description, canvas.width / 2, 230);
  }

  // Draw closing date if available
  if (raffleData?.closingDate) {
    ctx.font = "42px Arial";
    const closingDate = new Date(raffleData.closingDate).toLocaleDateString();
    ctx.fillText(`Closes: ${closingDate}`, canvas.width / 2, 350);
  }

  // Draw entry info
  ctx.font = "36px Arial";
  ctx.fillText("Like on Farcaster to enter", canvas.width / 2, 450);

  // Draw Rafflecast logo
  ctx.font = "bold 48px Arial";
  ctx.fillStyle = "#ff47da";
  ctx.fillText("RAFFLECAST", canvas.width / 2, canvas.height - 100);

  // Return the data URL
  return canvas.toDataURL("image/png");
};

/**
 * Creates SVG markup for a raffle image
 * @param {Object} raffleData Raffle data
 * @returns {string} SVG markup
 */
export const createRaffleSvgImage = (raffleData) => {
  const title = raffleData?.title || "Rafflecast";
  const description = raffleData?.description || "Enter to win";
  const closing = raffleData?.closingDate
    ? `Closes: ${new Date(raffleData.closingDate).toLocaleDateString()}`
    : "";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#131313" />
      <rect x="20" y="20" width="1160" height="590" fill="none" stroke="#ff47da" stroke-width="10" />
      
      <text x="600" y="150" font-family="Arial" font-size="60" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      
      <text x="600" y="230" font-family="Arial" font-size="36" fill="white" text-anchor="middle">${description}</text>
      
      <text x="600" y="350" font-family="Arial" font-size="42" fill="white" text-anchor="middle">${closing}</text>
      
      <text x="600" y="450" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Like on Farcaster to enter</text>
      
      <text x="600" y="530" font-family="Arial" font-size="48" font-weight="bold" fill="#ff47da" text-anchor="middle">RAFFLECAST</text>
    </svg>
  `;
};

/**
 * This would be a server API handler for raffle images
 * Since we're browser-only, we'll make a function that returns a data URL
 * @param {string} raffleId Raffle ID
 * @param {Function} getRaffleById Function to get raffle data
 * @returns {string} Image data URL
 */
export const getRaffleImageUrl = (raffleId, getRaffleById) => {
  try {
    const raffleData = getRaffleById(raffleId);
    if (!raffleData) {
      // Return default image for missing raffle
      return createRaffleImageDataUrl({ title: "Raffle Not Found" });
    }

    return createRaffleImageDataUrl(raffleData);
  } catch (error) {
    console.error("Error generating raffle image:", error);
    return createRaffleImageDataUrl({ title: "Error Loading Raffle" });
  }
};
