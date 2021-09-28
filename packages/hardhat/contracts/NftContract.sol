//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftContract is ERC721URIStorage {
    
    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a nft
    ///  ownership is assigned
    // event Transfer(address from, address to, uint256 tokenId);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress; // marketplace address.

    mapping (uint256 => address) public nftIndexToOwner;

    constructor() ERC721("Loots", "LOOT") {
        // contractAddress = marketplaceAddress;
    }

    // int public counter = 0;

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);

        nftIndexToOwner[newItemId] = msg.sender;

        // _transfer(0, msg.sender, newItemId);

        return newItemId;
    }

    function tokensOfOwner(address _owner) public view returns(uint256[] memory ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalCats =  _tokenIds.current(); //contractAddress//totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all cats have IDs starting at 1 and increasing
            // sequentially up to the totalCat count.
            uint256 catId;

            for (catId = 1; catId <= totalCats; catId++) {
                if (nftIndexToOwner[catId] == _owner) {
                    result[resultIndex] = catId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}