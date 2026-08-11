// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NexusMeshLedger
 * @notice Handles node registrations and direct token transfers from users to nodes upon session completion.
 */
contract NexusMeshLedger is Ownable {
    
    IERC20 public immutable meshToken;
    address public ledgerService;

    struct NodeInfo {
        address walletAddress;
        string ipAddress;
        uint256 registeredAt;
        bool isRegistered;
    }

    // Public mapping automatically generates a free read-only getter `nodes(address)`
    // used off-chain by the Orchestrator/Ledger Service (e.g. checkNodeOnChain).
    mapping(address => NodeInfo) public nodes;

    event NodeRegistered(address indexed nodeAddress, string ipAddress);
    event FundsTransferred(
        bytes32 indexed sessionId,
        address indexed user,
        address indexed node,
        uint256 tokenCost
    );

    modifier onlyLedgerService() {
        require(msg.sender == ledgerService, "NexusMesh: Caller is not Ledger Service");
        _;
    }

    constructor(address _tokenAddress, address _ledgerService) Ownable(msg.sender) {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_ledgerService != address(0), "Invalid ledger service address");
        meshToken = IERC20(_tokenAddress);
        ledgerService = _ledgerService;
    }

    /**
     * @notice Function 1: Node Registration
     * @dev Called directly on-chain by the independent router daemon process.
     */
    function registerNode(string calldata _ipAddress) external {
        require(!nodes[msg.sender].isRegistered, "Node already registered");

        nodes[msg.sender] = NodeInfo({
            walletAddress: msg.sender,
            ipAddress: _ipAddress,
            registeredAt: block.timestamp,
            isRegistered: true
        });

        emit NodeRegistered(msg.sender, _ipAddress);
    }

    /**
     * @notice Function 2: Direct Funds Transfer / Settlement
     * @dev Called by the Ledger Service to transfer 100% of the session cost to the router node.
     */
    function transferFunds(
        bytes32 _sessionId,
        address _user,
        address _node,
        uint256 _tokenCost
    ) external onlyLedgerService {
        require(nodes[_node].isRegistered, "Destination node is not registered");
        require(_tokenCost > 0, "Token cost must be greater than zero");

        // Transfer 100% of the session cost from User directly to the Router Node wallet
        require(
            meshToken.transferFrom(_user, _node, _tokenCost),
            "Direct token transfer failed. Verify user token approval."
        );

        emit FundsTransferred(_sessionId, _user, _node, _tokenCost);
    }

    /**
     * @notice Allows admin to update Ledger Service address if the service is re-deployed.
     */
    function setLedgerService(address _newLedgerService) external onlyOwner {
        require(_newLedgerService != address(0), "Invalid address");
        ledgerService = _newLedgerService;
    }
}