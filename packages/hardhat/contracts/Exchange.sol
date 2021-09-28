//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Exchange is ReentrancyGuard { 
    using Counters for Counters.Counter;
    //Items that enters the market.
    Counters.Counter private _listingIds;
    //Items that have been sold withing the market.
    Counters.Counter private _listingsSold;

    mapping(uint256 => Listing) private marketplace;

    uint8 transactionFee; // % of the price that will be sent to the ceo.

    address payable ceo;
    address payable cfo;

    struct Listing {
        uint ligtingId;
        address contractAddress;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    /**
     * @dev 
     * params:
     * contractAddress - NFTcontract to be listed on the marketplace.
     * tokenId    - NFT id that will be listed on the marketplace.
     */
    function listNft(address contractAddress, uint256 tokenId, uint256 price) public nonReentrant {
        // @TODOs:
        // - msg.sender is the owner of the Current NFT.
        // - minimum listing price to be set at 1RON.
        _listingIds.increment();
        uint256 listingId = _listingIds.current();

        marketplace[listingId] = Listing(
            listingId,              // listing id. // internal id.
            contractAddress,        // nft contract
            tokenId,                // nft id
            payable(msg.sender),    // this is an address.
            payable(address(0)),    // Owner of the listing
            price,                  // Listing Price
            false                   // Sold Attribute
        );

        IERC721(contractAddress).transferFrom(msg.sender, address(this), tokenId);
        // Can emit event here.
    }

    function atomicMatch(
        uint256 listingId
    ) public payable nonReentrant {
        // require that the seller is still the owner of the nft. 
        Listing memory listing = marketplace[listingId];
        uint price = listing.price;
        uint tokenId = listing.tokenId;
        require(msg.value == price, "Please submit the asking price" );
        
        listing.seller.transfer(msg.value);
        IERC721(listing.contractAddress).transferFrom(address(this), msg.sender, tokenId);
        listing.owner = payable(msg.sender);
        listing.sold = true;
        _listingsSold.increment();
        // transfer the remaining of the value to the cfo address.
    }

    function getMarketItems() public view returns (Listing[] memory) {
        uint listingCount = _listingIds.current();
        uint unsoldListingCount = _listingIds.current() - _listingsSold.current();
        uint currentIndex = 0;

        Listing[] memory listings = new Listing[](unsoldListingCount);
        for(uint i = 0; i < listingCount ; i++) {
            if(marketplace[i+1].owner == address(0)) {
                Listing storage listing = marketplace[i+1];
                listings[currentIndex] = listing;
                currentIndex += 1;
            }
        }
        return listings;
    }
}

contract HydraExchange is Exchange {

}