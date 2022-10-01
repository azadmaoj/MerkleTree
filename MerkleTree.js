//Importing the required libraries
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

//Creating the whiteList addresses list
it("Should check the NFT Collection Function", async () => {});
const accounts = await hre.ethers.getSigners();
let whiteListAddresses = [
  accounts[0].address,
  accounts[1].address,
  accounts[2].address,
  accounts[3].address,
  accounts[4].address,
];

const leaves = whiteListAddresses.map((add) => keccak256(add));
console.log("leaf", leaves.toString());
const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log("Hash merkleTree: ", merkleTree.toString());

const buf2hex = (add) => "0x" + add.toString("hex");

let rootHash = buf2hex(merkleTree.getRoot());
console.log("Root hash is", rootHash);
