/**
 * Generates a base64 encoded SVG image for Farcaster Frames
 * with raffle ticket-style perforated edges
 *
 * @param {Object} raffle - Raffle data object
 * @returns {string} Base64 encoded data URL for the SVG image
 */
export const generateBase64FrameImage = (raffle) => {
  if (!raffle) {
    raffle = {
      title: "Rafflecast",
      description: "Enter to win prizes on Farcaster",
      closingDate: new Date().toISOString(),
    };
  }

  // Sanitize text for XML
  const sanitize = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  // Helper to truncate text to fit
  const truncate = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };

  const title = sanitize(truncate(raffle.title, 40));
  const description = sanitize(truncate(raffle.description, 80));
  const closingDate = raffle.closingDate
    ? `Closes: ${new Date(raffle.closingDate).toLocaleDateString()}`
    : "";

  // Generate a bright random color for the accent
  const getRandomAccentColor = () => {
    // Use the raffle ID to generate a predictable but random-seeming color
    const seed = raffle.id
      ? raffle.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
      : Math.random() * 1000;

    // Generate a bright, saturated color
    const hue = seed % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  // Generate perforated edge circles
  const generatePerforations = (side) => {
    const numPerforations = 25; // Number of perforation circles
    const spacing = 630 / numPerforations;
    let perforations = "";

    const x = side === "left" ? 60 : 1140; // X position for left or right side

    for (let i = 0; i < numPerforations; i++) {
      const y = spacing / 2 + i * spacing;
      perforations += `<circle cx="${x}" cy="${y}" r="8" fill="${backgroundColor}" stroke="${accentColor}" stroke-width="1.5" />`;
    }

    return perforations;
  };

  const accentColor = getRandomAccentColor();
  const textColor = "#ffffff";
  const backgroundColor = "#131313";
  const borderColor = accentColor;

  // Create an SVG image with the raffle info and perforated edges
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <!-- Background -->
      <rect width="1200" height="630" fill="${backgroundColor}" />
      
      <!-- Main Ticket Shape -->
      <rect x="80" y="20" width="1040" height="590" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="4" rx="15" />

      <!-- Inner border for ticket effect -->
      <rect x="100" y="40" width="1000" height="550" fill="none" stroke="${borderColor}" stroke-width="2" stroke-opacity="0.5" rx="10" />
      
      <!-- Left perforated edge -->
      ${generatePerforations("left")}
      
      <!-- Right perforated edge -->
      ${generatePerforations("right")}
      
      <!-- Accent Circles -->
      <circle cx="200" cy="100" r="30" fill="${accentColor}" fill-opacity="0.2" />
      <circle cx="1000" cy="100" r="30" fill="${accentColor}" fill-opacity="0.2" />
      <circle cx="200" cy="530" r="30" fill="${accentColor}" fill-opacity="0.2" />
      <circle cx="1000" cy="530" r="30" fill="${accentColor}" fill-opacity="0.2" />
      
      <!-- Ticket Number - simulate a real ticket stub -->
      <text x="150" y="70" font-family="monospace" font-size="18" fill="${accentColor}" text-anchor="middle">#${
    Math.floor(Math.random() * 9000) + 1000
  }</text>
      
      <!-- Content -->
      <g>
        <!-- Title with background -->
        <rect x="200" y="100" width="800" height="100" rx="15" fill="${accentColor}" fill-opacity="0.8" />
        <text x="600" y="165" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${title}</text>
        
        <!-- Description -->
        <text x="600" y="250" font-family="Arial, sans-serif" font-size="30" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${description}</text>
        
        <!-- Closing date with background -->
        <rect x="400" y="300" width="400" height="60" rx="30" fill="${accentColor}" fill-opacity="0.6" />
        <text x="600" y="340" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${closingDate}</text>
        
        <!-- Call to action -->
        <text x="600" y="420" font-family="Arial, sans-serif" font-size="32" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">Like on Farcaster to enter this raffle!</text>
        
        <!-- Logo & Branding -->
        <rect x="400" y="480" width="400" height="70" rx="35" fill="${accentColor}" />
        <text x="600" y="530" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">RAFFLECAST</text>
        
        <!-- Validation Stub Effect - Creates a horizontal perforated line -->
        <line x1="200" y1="400" x2="1000" y2="400" stroke="${borderColor}" stroke-width="2" stroke-dasharray="6,3" />
      </g>
    </svg>
  `;

  // Convert SVG to a base64 data URL
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

export default generateBase64FrameImage;
