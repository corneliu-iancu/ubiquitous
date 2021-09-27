//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";

contract WyvernBase is Ownable {

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a wyvern
    ///  ownership is assigned.
    event Transfer(address from, address to, uint256 tokenId);

    struct Wyvern {
        // The timestamp from the block when 
        // this Wyvern came into existence.
        uint64 birthTime;
        uint16 generation;
    }

    Wyvern[] wyverns;

    /// @dev A mapping from cat IDs to the address that owns them. All cats have
    ///  some valid owner address, even gen0 cats are created with a non-zero owner.
    mapping (uint256 => address) public wyvernIndexToOwner;

    /// @dev A mapping from owner address to count of tokens that address owns.
    /// Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) ownershipTokenCount;

    /// @dev A mapping from KittyIDs to an address that has been approved to call
    ///  transferFrom(). Each Kitty can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public wyvernIndexToApproved;

    function _createWyvern(
        uint256 _generation
    ) internal returns (uint) {
        
        Wyvern memory _wyvern = Wyvern({
            birthTime: uint64(block.timestamp),
            generation: uint16(_generation)
        });

        wyverns.push(_wyvern);

        uint256 newKittenId = wyverns.length - 1;

        return newKittenId;
    }


}

contract WyvernCore is WyvernBase {

}