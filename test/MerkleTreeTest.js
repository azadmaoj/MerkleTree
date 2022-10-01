const { ethers } = require("hardhat");
const { expect } = require("chai");
const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const { keccak256 } = ethers.utils;

describe("Test Cases of Merkle Tree NFT Collection", () => {
  before(async () => {
    accounts = await hre.ethers.getSigners();
    whiteListAddresses = [
      accounts[0].address,
      accounts[1].address,
      accounts[2].address,
      accounts[3].address,
      accounts[4].address,
    ];

    leaves = whiteListAddresses.map((add) => keccak256(add));

    merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    buf2hex = (add) => "0x" + add.toString("hex");

    rootHash = buf2hex(merkleTree.getRoot());

    leaf = keccak256(whiteListAddresses[0]);
    proof = merkleTree.getHexProof(leaf);

    const MerkleTreeNFT = await hre.ethers.getContractFactory("MerkleTreeNFT");
    merkleTreeNFT = await MerkleTreeNFT.deploy(rootHash, 0);
  });

  it("Should check the Name of NFT ", async () => {
    expect(await merkleTreeNFT.name()).to.be.equal("Merkle Root");
  });

  it("Should check the Symbol of NFT ", async () => {
    expect(await merkleTreeNFT.symbol()).to.be.equal("MerkleNFT");
  });

  it("Should check the token Id Before Minting ", async () => {
    expect(await merkleTreeNFT.tokenId()).to.be.equals(0);
  });

  it("Should Check the NFT Collection Function", async () => {
    await merkleTreeNFT.nftCollection(proof, "URI");
  });

  it("Should check the token Id After Minting ", async () => {
    expect(await merkleTreeNFT.tokenId()).to.be.equals(1);
  });

  it("Should Revert while using different address NFT Collection Function", async () => {
    await expect(
      merkleTreeNFT.connect(accounts[1]).nftCollection(proof, "URL")
    ).to.be.revertedWith("Merkle Proof is Invalid");
  });

  it("Should check the WhiteList with correct User", async () => {
    expect(
      await merkleTreeNFT.whiteListAddresses(accounts[0].address)
    ).to.be.equal(true);
  });

  it("Should check the WhiteList with Incorrect User", async () => {
    expect(
      await merkleTreeNFT.whiteListAddresses(accounts[1].address)
    ).to.be.equal(false);
  });

  it("Check the revert of Invalid Token ID", async () => {
    await expect(merkleTreeNFT.ownerOf(1)).to.be.revertedWith(
      "ERC721: invalid token ID"
    );
  });

  it("Check the revert of valid Token ID", async () => {
    expect(await merkleTreeNFT.ownerOf(0)).to.be.equal(accounts[0].address);
  });

  it("Check the balance of account ", async () => {
    expect(await merkleTreeNFT.balanceOf(accounts[0].address)).to.be.equal(1);
  });

  it("Should check the Token URI", async () => {
    expect(await merkleTreeNFT.tokenURI(0)).to.be.equal("URI");
  });
});
