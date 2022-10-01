const { ethers } = require("hardhat");
const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = ethers.utils;

async function main() {
  const accounts = await hre.ethers.getSigners();
  const whiteListAddresses = accounts.slice(0, 5);
  const notWhiteListAddresses = accounts.slice(6, 10);

  const leafNodes = whiteListAddresses.map((account) =>
    keccak256(account.address)
  );

  const merkleTreeRoot = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });
  const rootHash = merkleTreeRoot.getHexRoot();

  const MerkleTreeNFT = await hre.ethers.getContractFactory("MerkleTreeNFT");
  const merkleTree = await MerkleTreeNFT.deploy(rootHash, 0);
  await merkleTree.deployed();
  console.log("Address of Merkle Tree is ", rootHash);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
