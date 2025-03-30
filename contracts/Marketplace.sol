// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title BlockDeal Marketplace
 * @dev A decentralized marketplace for buying and selling items
 */
contract Marketplace is ReentrancyGuard, Pausable, Ownable {
    using Counters for Counters.Counter;

    // Structs
    struct Item {
        uint256 id;
        address seller;
        uint256 price;
        bool sold;
        bool exists;
    }

    struct Auction {
        uint256 id;
        address seller;
        uint256 startingPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
        bool exists;
    }

    // State variables
    Counters.Counter private _itemIds;
    Counters.Counter private _auctionIds;
    
    mapping(uint256 => Item) public items;
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256[]) public userItems;
    mapping(address => uint256[]) public userAuctions;
    
    uint256 public platformFee = 25; // 0.25%
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Events
    event ItemListed(uint256 indexed id, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed id, address indexed seller, address indexed buyer, uint256 price);
    event AuctionCreated(uint256 indexed id, address indexed seller, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed id, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed id, address indexed winner, uint256 amount);

    // Modifiers
    modifier itemExists(uint256 _id) {
        require(items[_id].exists, "Item does not exist");
        _;
    }

    modifier auctionExists(uint256 _id) {
        require(auctions[_id].exists, "Auction does not exist");
        _;
    }

    modifier notSold(uint256 _id) {
        require(!items[_id].sold, "Item already sold");
        _;
    }

    modifier auctionNotEnded(uint256 _id) {
        require(!auctions[_id].ended, "Auction already ended");
        require(block.timestamp < auctions[_id].endTime, "Auction ended");
        _;
    }

    // Functions
    function listItem(uint256 _price) external whenNotPaused {
        require(_price > 0, "Price must be greater than 0");
        
        _itemIds.increment();
        uint256 newItemId = _itemIds.current();
        
        items[newItemId] = Item({
            id: newItemId,
            seller: msg.sender,
            price: _price,
            sold: false,
            exists: true
        });
        
        userItems[msg.sender].push(newItemId);
        
        emit ItemListed(newItemId, msg.sender, _price);
    }

    function buyItem(uint256 _id) external payable itemExists(_id) notSold(_id) nonReentrant {
        Item storage item = items[_id];
        require(msg.value >= item.price, "Insufficient payment");
        
        uint256 fee = (item.price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerPayment = item.price - fee;
        
        item.sold = true;
        
        (bool success, ) = item.seller.call{value: sellerPayment}("");
        require(success, "Transfer failed");
        
        emit ItemSold(_id, item.seller, msg.sender, item.price);
    }

    function createAuction(uint256 _startingPrice, uint256 _duration) external whenNotPaused {
        require(_startingPrice > 0, "Starting price must be greater than 0");
        require(_duration > 0 && _duration <= 7 days, "Duration must be between 0 and 7 days");
        
        _auctionIds.increment();
        uint256 newAuctionId = _auctionIds.current();
        
        auctions[newAuctionId] = Auction({
            id: newAuctionId,
            seller: msg.sender,
            startingPrice: _startingPrice,
            highestBid: 0,
            highestBidder: address(0),
            endTime: block.timestamp + _duration,
            ended: false,
            exists: true
        });
        
        userAuctions[msg.sender].push(newAuctionId);
        
        emit AuctionCreated(newAuctionId, msg.sender, _startingPrice, block.timestamp + _duration);
    }

    function placeBid(uint256 _id) external payable auctionExists(_id) auctionNotEnded(_id) nonReentrant {
        Auction storage auction = auctions[_id];
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");
        
        if (auction.highestBidder != address(0)) {
            (bool success, ) = auction.highestBidder.call{value: auction.highestBid}("");
            require(success, "Refund failed");
        }
        
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        
        emit BidPlaced(_id, msg.sender, msg.value);
    }

    function endAuction(uint256 _id) external auctionExists(_id) nonReentrant {
        Auction storage auction = auctions[_id];
        require(!auction.ended, "Auction already ended");
        require(block.timestamp >= auction.endTime, "Auction not ended");
        
        auction.ended = true;
        
        if (auction.highestBidder != address(0)) {
            uint256 fee = (auction.highestBid * platformFee) / FEE_DENOMINATOR;
            uint256 sellerPayment = auction.highestBid - fee;
            
            (bool success, ) = auction.seller.call{value: sellerPayment}("");
            require(success, "Transfer failed");
            
            emit AuctionEnded(_id, auction.highestBidder, auction.highestBid);
        }
    }

    // Admin functions
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 500, "Fee too high"); // Max 5%
        platformFee = _newFee;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getItem(uint256 _id) external view returns (Item memory) {
        return items[_id];
    }

    function getAuction(uint256 _id) external view returns (Auction memory) {
        return auctions[_id];
    }

    function getUserItems(address _user) external view returns (uint256[] memory) {
        return userItems[_user];
    }

    function getUserAuctions(address _user) external view returns (uint256[] memory) {
        return userAuctions[_user];
    }
} 