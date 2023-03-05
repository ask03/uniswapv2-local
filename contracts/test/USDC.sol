pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor(string memory _name, string memory _symbol, uint256 _amount) ERC20(_name, _symbol){
        _mint(msg.sender, _amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }
}