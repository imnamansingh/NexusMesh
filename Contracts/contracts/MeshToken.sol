// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MeshToken
 * @notice The utility token used for paying out data/wifi sessions within the NexusMesh ecosystem.
 */
contract MeshToken is ERC20, Ownable {

    /**
     * @constructor 
     * @param initialSupply The amount of tokens to mint initially (in whole tokens, e.g., 10000).
     */
    constructor(uint256 initialSupply) ERC20("NexusMesh", "MESH") Ownable(msg.sender) {
        // Automatically mints the initial supply to the deployer's wallet (developer account).
        // Multiplying by 10**decimals() accounts for standard 18 decimal places.
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @notice Optional: Allows the owner to mint more tokens later if needed for ecosystem rewards.
     * @param to The address receiving the newly minted tokens.
     * @param amount The amount of tokens to mint (in whole tokens).
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10 ** decimals());
    }
}