import { MerkleTree } from "merkletreejs";
// eslint-disable-next-line no-unused-vars
import { keccak256, toUtf8Bytes } from "ethers";

// Hash function using SHA-256
const hashFn = (data) => {
  //return keccak256(toUtf8Bytes(data));
  return keccak256(data);
};

/**
 * Generate a Merkle tree from a list of addresses
 * @param {string[]} addresses - Array of Ethereum addresses.
 * @returns {Object} - Object containing the Merkle tree and its root.
 */
const generateMerkleTree = (addresses) => {
  // Hash the addresses to create leave of the Merkle tree
  const leaves = addresses.map((addr) => hashFn(addr));
  // Create the Merkle tree
  const tree = new MerkleTree(leaves, hashFn, { sortPairs: true });

  // Get the Merkle root as a hex string
  const root = tree.getHexRoot();

  return {
    tree,
    root,
  };
};

/** Generate a Merkle proof for a given address.
 * @param {Object} tree - The Merkle tree.
 * @param {string} address - The address to generate the proof for.
 * @returns {string[]} - Array of hex strings representing the Merkle proof.
 */
const generateMerkleProof = (tree, address) => {
  const leaf = hashFn(address);
  const proof = tree.getHexProof(leaf);
  return proof;
};
export { generateMerkleTree, generateMerkleProof };
