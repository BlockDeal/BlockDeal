// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title BlockDeal Token
 * @dev Implementation of the BlockDeal platform token
 */
contract BlockDealToken is ERC20, Ownable, Pausable {
    // Token parameters
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant MINT_AMOUNT = 10_000 * 10**18; // 10,000 tokens per mint
    
    // Staking parameters
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod;
        uint256 rewards;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public stakingRewardRate = 100; // 1% per year
    uint256 public constant REWARD_DENOMINATOR = 10000;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("BlockDeal Token", "BDT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    // Token functions
    function mint(address to) external onlyOwner whenNotPaused {
        require(totalSupply() + MINT_AMOUNT <= MAX_SUPPLY, "Max supply reached");
        _mint(to, MINT_AMOUNT);
        emit TokensMinted(to, MINT_AMOUNT);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    // Staking functions
    function stake(uint256 amount, uint256 lockPeriod) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(lockPeriod >= 30 days && lockPeriod <= 365 days, "Lock period must be between 30 and 365 days");
        
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount == 0, "Already staking");
        
        _transfer(msg.sender, address(this), amount);
        
        userStake.amount = amount;
        userStake.startTime = block.timestamp;
        userStake.lockPeriod = lockPeriod;
        userStake.rewards = 0;
        
        emit Staked(msg.sender, amount, lockPeriod);
    }
    
    function unstake() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake found");
        require(block.timestamp >= userStake.startTime + userStake.lockPeriod, "Lock period not ended");
        
        uint256 amount = userStake.amount;
        uint256 rewards = calculateRewards(msg.sender);
        
        userStake.amount = 0;
        userStake.startTime = 0;
        userStake.lockPeriod = 0;
        userStake.rewards = 0;
        
        _transfer(address(this), msg.sender, amount);
        
        if (rewards > 0) {
            _mint(msg.sender, rewards);
        }
        
        emit Unstaked(msg.sender, amount);
        if (rewards > 0) {
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    function claimRewards() external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake found");
        
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards available");
        
        userStake.rewards = 0;
        userStake.startTime = block.timestamp;
        
        _mint(msg.sender, rewards);
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    // View functions
    function calculateRewards(address user) public view returns (uint256) {
        Stake storage userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - userStake.startTime;
        uint256 rewards = (userStake.amount * timeStaked * stakingRewardRate) / (365 days * REWARD_DENOMINATOR);
        
        return rewards;
    }
    
    function getStakeInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 lockPeriod,
        uint256 rewards
    ) {
        Stake storage userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.lockPeriod,
            userStake.rewards
        );
    }
    
    // Admin functions
    function setStakingRewardRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Rate too high"); // Max 10%
        stakingRewardRate = _newRate;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
} 