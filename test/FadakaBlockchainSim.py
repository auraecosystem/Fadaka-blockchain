import hashlib
import time
import json

class FadakaBlockchainSim:
    def __init__(self, oracle_address):
        self.contract_owner = "0xOwnerAddress77777777777777777777777"
        self.trusted_oracle_layer = oracle_address
        self.active_workflows = {}
        print(f"[Contract Deployed] Owner: {self.contract_owner}")
        print(f"[Oracle Registered] Approved Node: {self.trusted_oracle_layer}\n" + "-"*60)

    def request_ai_inference(self, requestor, model_id, input_payload, payment_fee):
        if payment_fee <= 0:
            raise ValueError("Execution fee required to provision off-chain compute resources.")
        
        # Generate a unique on-chain Task ID (simulating keccak256)
        raw_seed = f"{time.time()}{requestor}{model_id}".encode()
        task_id = "0x" + hashlib.sha256(raw_seed).hexdigest()

        # Write data to the simulated blockchain state mapping
        self.active_workflows[task_id] = {
            "model_id": model_id,
            "requestor": requestor,
            "computation_fee": payment_fee,
            "input_payload": input_payload,
            "verification_hash": None,
            "is_completed": False
        }
        
        print(f"🤖 [EVENT: TaskInitiated] -> Task ID: {task_id}")
        print(f"    Requestor: {requestor} allocated {payment_fee} FADAKA tokens.")
        print(f"    Payload routed to Model: {model_id}")
        return task_id

    def fulfill_ai_inference(self, caller, task_id, neural_output_proof):
        # Enforce smart contract access control modifiers
        if caller != self.trusted_oracle_layer:
            return "❌ ERROR: Unauthorized: Caller is not a validated Fadaka P2P Oracle Node."
        
        task = self.active_workflows.get(task_id)
        if not task:
            return "❌ ERROR: Process Lifecycle: Task record not found."
        if task["is_completed"]:
            return "❌ ERROR: Process Lifecycle: Selected transaction is already finalized."

        # State updates
        task["verification_hash"] = neural_output_proof
        task["is_completed"] = True
        
        print(f"\n✅ [EVENT: TaskValidated] -> Task ID: {task_id}")
        print(f"    Cryptographic Proof Saved: {neural_output_proof}")
        print(f"    💸 Payment of {task['computation_fee']} FADAKA tokens successfully transferred to Oracle Node: {caller}.")
        return "SUCCESS: Transaction Confirmed on Ledger"


# ==========================================
# RUNNING THE SIMULATION WORKFLOW
# ==========================================
if __name__ == "__main__":
    # Define addresses representing our entities
    oracle_node_address = "0xOracleNode9999999999999999999999"
    user_wallet_address = "0xUserWallet111111111111111111111"
    
    # Define our target neural core model identifier
    target_model_id = "0xAdaptiveNeuralCore_GPT_V4"

    # 1. Initialize the Local Ledger State
    fadaka_network = FadakaBlockchainSim(oracle_address=oracle_node_address)

    # 2. User/Agent initiates an inference transaction call
    user_payload = {"prompt": "Analyze market neural anomalies.", "max_tokens": 128}
    payload_str = json.dumps(user_payload)
    
    active_task_id = fadaka_network.request_ai_inference(
        requestor=user_wallet_address,
        model_id=target_model_id,
        input_payload=payload_str,
        payment_fee=50 # 50 simulated tokens
    )

    print("\n... [Off-Chain Syncing] P2P Oracle picks up event, runs model inference ...")
    # Simulated model inference creates an immutable output hash proof string
    simulated_ai_output_data = "Target trend stable. No anomalies detected."
    simulated_proof_hash = "0x" + hashlib.sha256(simulated_ai_output_data.encode()).hexdigest()

    # 3. Malicious actor tries to intercept and forge execution
    hacker_attempt = fadaka_network.fulfill_ai_inference(
        caller="0xHackerWalletAddress6666666",
        task_id=active_task_id,
        neural_output_proof=simulated_proof_hash
    )
    print(f"\n🛡️ [Security Test] A malicious actor tries to resolve the contract: {hacker_attempt}")

    # 4. Valid Oracle Node submits the true verification hash to settle the contract
    final_status = fadaka_network.fulfill_ai_inference(
        caller=oracle_node_address,
        task_id=active_task_id,
        neural_output_proof=simulated_proof_hash
    )
    print(f"🏁 Final System State: {final_status}")
