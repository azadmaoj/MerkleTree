//SPDX-License-Identifier:UNLICENSE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MerkleTreeNFT is ERC721URIStorage {
    //Paste the Merkel Root here which we will get from MerkelTree.js
    bytes32 public immutable merkleRoot;

    //Token ID
    uint256 public tokenId;

    //Initializing the Contract
    constructor(bytes32 _merkleRoot, uint256 _tokenId)
        ERC721("Merkle Root", "MerkleNFT")
    {
        merkleRoot = _merkleRoot;
        tokenId = _tokenId;
    }

    //Mapping of White List claimed addresses
    mapping(address => bool) public whiteListAddresses;

    /**
    This function verify the account is white list or not , 
    then if account is white listed then it will allow account to mint NFT
    @dev Verifing the whitelist user with Merkle Proof before Mint
    @param _merkleProof is the method of verifing account is white listed or not
    @param _tokenURI is the string URI of Tokens
     */
    function nftCollection(
        bytes32[] calldata _merkleProof,
        string memory _tokenURI
    ) public returns (uint256) {
        require(!whiteListAddresses[msg.sender], "User is not White Listed ");

        whiteListAddresses[msg.sender] = true;

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Merkle Proof is Invalid"
        );
        uint256 newTokenId = tokenId;

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, _tokenURI);

        tokenId = tokenId + 1;

        return newTokenId;
    }
}
