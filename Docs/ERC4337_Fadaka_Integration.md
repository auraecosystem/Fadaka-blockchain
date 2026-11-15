# ERC-4337 on Fadaka — integration gate

## Status

**Preflight only; deployment is not verified.** This change adds a read-only RPC check for the canonical ERC-4337 EntryPoint v0.7.0 address:

`0x0000000071727de22e5e9d8baf0edac6f37da032`

It does not deploy contracts, submit transactions, or claim that this address is deployed on Fadaka. A source-code reference to an EntryPoint or a smart-wallet contract is not proof of a live deployment.

## Run the preflight

Use Node.js 20 or newer (the script uses the built-in `fetch` API):

```sh
FADAKA_RPC_URL="https://your-fadaka-rpc.example" node scripts/erc4337-entrypoint-preflight.mjs
```

Optionally pin the expected decimal chain ID once the canonical value is confirmed:

```sh
FADAKA_RPC_URL="https://your-fadaka-rpc.example" \
FADAKA_EXPECTED_CHAIN_ID="12345" \
node scripts/erc4337-entrypoint-preflight.mjs
```

The example chain ID above is a placeholder, not a claim about Fadaka. The check calls only `eth_chainId` and `eth_getCode`. Exit code 0 means bytecode exists at the address and the optional chain-ID check passed; exit code 2 means no code was found; exit code 1 means configuration or RPC validation failed. Bytecode presence alone does **not** prove the contract is the audited v0.7.0 implementation.

## Required before enabling ERC-4337

1. Confirm Fadaka's canonical chain ID and the intended RPC endpoint from node configuration or an operator-controlled endpoint.
2. Confirm that the endpoint serves standard EVM JSON-RPC and that contract creation, `eth_call`, logs, receipts, and transaction semantics are EVM-compatible.
3. Deploy or identify the exact EntryPoint v0.7.0 implementation on a disposable local network or Fadaka testnet. Verify its runtime bytecode against a reproducible build and record the deployment transaction and address.
4. Test the account implementation against the selected EntryPoint version. The repository contains `src/CoinbaseSmartWallet.sol`, which imports the legacy `UserOperation` interface; do not assume this is compatible with EntryPoint v0.7.0's packed UserOperation interface without checking its pinned dependency and build.
5. Choose a compatible bundler and verify simulation, nonce handling, paymaster rules (if used), gas estimation, and failed UserOperation handling.
6. Add integration tests against a local node, then a testnet. Never point automated tests at mainnet or use a production signer.
7. Only after review, publish the verified EntryPoint address, chain ID, bundler endpoint, supported account implementation, and deployment provenance.

## Security boundary

- Never commit private keys, seed phrases, API tokens, or RPC credentials.
- Do not deploy from CI as part of this preflight.
- Do not copy the Ethereum mainnet deployment assumption to Fadaka.
- Keep production deployment behind a separate, explicit approval workflow.
