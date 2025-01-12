import axios from "axios";

const FARCASTER_HTTP_API_ENDPOINT = "https://hoyt.farcaster.xyz:2281";

/**
 * Generic function to check user reactions (Like or Recast) on a specific Cast.
 * @param {number} fid - Farcaster ID of the user.
 * @param {number} reactionType - 1 for Like, 2 for Recast.
 * @param {string} targetHash - Hash of the Cast to check reactions for.
 * @param {number} targetFid - Farcaster ID of the Cast's creator.
 * @returns {boolean} - True if the user has reacted, otherwise False.
 */
const checkUserReaction = async (
  fid,
  reactionType,
  targetHash /*, targetFid*/
) => {
  try {
    const url = `${FARCASTER_HTTP_API_ENDPOINT}/v1/reactionsByFid`;

    const response = await axios.get(url, {
      params: {
        fid,
        reaction_type: reactionType,
      },
    });

    // Check if the reaction list contains any results
    const reactions = response.data?.messages || [];
    // Search if the reactions list contains the target hash:
    const foundReaction = reactions.find(
      (message) => message.data.reactionBody.targetCastId.hash === targetHash
    );
    console.log("Found:", foundReaction);
    return foundReaction ? true : false;
  } catch (error) {
    console.error(
      "Error checking user reaction:",
      error.response?.data || error.message
    );
    return false;
  }
};

/**
 * Check if a user has liked a specific Cast.
 * @param {number} fid - Farcaster ID of the user.
 * @param {string} targetHash - Hash of the Cast to check.
 * @param {number} targetFid - Farcaster ID of the Cast's creator.
 * @returns {boolean} - True if the user has liked the Cast, otherwise False.
 */
const checkLikeCondition = async (fid, targetHash, targetFid) => {
  const hasLiked = await checkUserReaction(fid, 1, targetHash, targetFid); // reaction_type = 1: LIKE
  if (!hasLiked) {
    console.log("User has not liked the linked Cast.");
    return false;
  }

  console.log("User has successfully liked the linked Cast.");
  return true;
};

/**
 * Check if a user has recast a specific Cast.
 * @param {number} fid - Farcaster ID of the user.
 * @param {string} targetHash - Hash of the Cast to check.
 * @param {number} targetFid - Farcaster ID of the Cast's creator.
 * @returns {boolean} - True if the user has recast the Cast, otherwise False.
 */
const checkRecastCondition = async (fid, targetHash, targetFid) => {
  const hasRecast = await checkUserReaction(fid, 2, targetHash, targetFid); // reaction_type = 2: RECAST
  if (!hasRecast) {
    console.log("User has not recast the linked Cast.");
    return false;
  }

  console.log("User has successfully recast the linked Cast.");
  return true;
};

export { checkLikeCondition, checkRecastCondition };
