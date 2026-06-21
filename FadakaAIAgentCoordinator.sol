// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FadakaAIAgentCoordinator
 * @dev Handles secure P2P validation rules between developers and autonomous neural cores.
 */
contract FadakaAIAgentCoordinator {
    
    address public contractOwner;
    address public trustedOracleLayer; // Points to the off-chain P2P AI oracle node network

    struct AIAgentTask {
        bytes32 modelId;          // Cryptographic hash representing the adaptive neural core
        address requestor;        // Account or autonomous agent triggering the process
        uint256 computationFee;   // Stake/Payment bound to the workflow execution
        bytes inputDataPayload;   // Input features or parameters routed to the off-chain model
        bytes32 verificationHash; // Cryptographic hash of the targeted neural state response
        bool isCompleted;         // Operational status indicator
    }

    // Mapping tracking unique Task IDs to their active AI Agent Workflows
    mapping(bytes32 => AIAgentTask) public activeWorkflows;

    event TaskInitiated(bytes32 indexed taskId, bytes32 indexed modelId, address indexed requestor);
    event TaskValidated(bytes32 indexed taskId, bytes32 verificationHash, bool success);

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Unauthorized: Caller is not the system owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == trustedOracleLayer, "Unauthorized: Caller is not a validated Fadaka P2P Oracle Node");
        _;
    }

    constructor(address _trustedOracle) {
        contractOwner = msg.sender;
        trustedOracleLayer = _trustedOracle;
    }

    /**
     * @notice Dispatches an input payload to a specific AI model ID.
     * @param _modelId The hash designation of the target neural core.
     * @param _inputPayload The compressed parameters or tokens sent to the off-chain engine.
     */
    function requestAIInference(bytes32 _modelId, bytes calldata _inputPayload) external payable returns (bytes32 taskId) {
        require(msg.value > 0, "Execution fee required to provision off-chain compute resources");
        
        // Generate unique identifier using on-chain state components
        taskId = keccak256(abi.encodePacked(block.timestamp, msg.sender, _modelId));
        
        activeWorkflows[taskId] = AIAgentTask({
            modelId: _modelId,
            requestor: msg.sender,
            computationFee: msg.value,
            inputDataPayload: _inputPayload,
            verificationHash: bytes32(0),
            isCompleted: false
        });

        emit TaskInitiated(taskId, _modelId, msg.sender);
        return taskId;
    }

    /**
     * @notice Enforces completion rules upon receiving verified computation proofs from the P2P layer.
     * @param _taskId The specific task record being finalized.
     * @param _neuralOutputProof Cryptographic state hash resulting from off-chain AI model execution.
     */
    function fulfillAIInference(bytes32 _taskId, bytes32 _neuralOutputProof) external onlyOracle {
        AIAgentTask storage task = activeWorkflows[_taskId];
        require(!task.isCompleted, "Process Lifecycle: Selected transaction is already finalized");
        require(task.requestor != address(0), "Process Lifecycle: Task record not found");

        task.verificationHash = _neuralOutputProof;
        task.isCompleted = true;

        // Automatically settles payment to the decentralized validating oracle node
        payable(msg.sender).transfer(task.computationFee);

        emit TaskValidated(_taskId, _neuralOutputProof, true);
    }
}
