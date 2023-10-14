// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed to, uint256 amount, address indexed sender, bytes32 indexed transactionHash);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract USDTTransfer {
    address public owner;
    IERC20 public usdtToken;

    event Deposit(address indexed from, uint256 amount);
    event Transfer(address indexed to, uint256 amount, address indexed sender, bytes32 transactionHash);

    constructor(address _usdtToken) {
        owner = msg.sender;
        usdtToken = IERC20(_usdtToken);
    }

    // Deposit USDT into the contract
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Deposit(msg.sender, amount);
    }

    // Transfer USDT to a specified recipient
    function transfer(address recipient, uint256 amount) external {
    require(msg.sender == owner, "Only the owner can transfer");
    require(amount > 0, "Amount must be greater than 0");
    require(usdtToken.transfer(recipient, amount), "Transfer failed");
    emit Transfer(recipient, amount, msg.sender, keccak256(abi.encodePacked(recipient, amount, msg.sender, block.timestamp)));
}

    // Check the balance and initiate transfer if balance is greater than zero
    function checkBalanceAndTransfer(address recipient) external {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(balance > 0, "Balance is not greater than zero");

        uint256 amount = balance;
        require(usdtToken.transfer(recipient, amount), "Transfer failed");

        emit Transfer(recipient, amount, address(this), blockhash(block.number));
    }

    // Get the contract's USDT balance
    function getBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }
}
