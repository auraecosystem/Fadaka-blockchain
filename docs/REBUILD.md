# Fadaka repository rebuild

## Goal

Rebuild this repository into one maintainable Fadaka blockchain project.
The canonical repository remains `auraecosystem/Fadaka-blockchain`.
This work is an independent implementation; third-party code is not to be
copied into or linked as project-owned implementation.

## Current assessment

The existing tree contains multiple competing prototypes and build systems.
The root Go module is a placeholder, the root CMake project identifies itself
as libsecp256k1, the root Dockerfile references a missing `cpp/` directory
and a missing `cmd/fadaka` target, and the Rust WASM signing example is a
simulation rather than cryptographic signing. The Homebrew formulae also point
to a different repository and contain placeholder checksums.

These components are not a coherent, validated Layer 1 implementation.
Do not advertise the network, consensus, wallet, bridge, or WASM execution
features as production-ready until their implementations and tests exist.

## Target architecture

```text
fadaka/
  apps/
    node/                 # Node process and lifecycle
    cli/                  # Operator and developer CLI
  crates/
    primitives/           # Hashes, addresses, fixed-width amounts, codecs
    transactions/         # Transaction model, signatures, validation
    ledger/               # State, balances, deterministic transitions
    consensus/            # Validator set, proposals, votes, finality
    execution/             # Deterministic execution interface
    storage/              # Durable blocks and state
    networking/           # Peer protocol and synchronization
    rpc/                  # Versioned, authenticated RPC
    wallet/               # Key custody and transaction signing
  contracts/              # Only contracts with a defined Fadaka role
  configs/                # Safe public defaults; no credentials
  docs/
  tests/
    vectors/
    integration/
    security/
  packaging/
    homebrew/
    containers/
  tools/
    engineering/          # Formatting, static analysis, coverage, release
```

## Rebuild rules

1. Inventory every tracked path and classify it as core, dependency,
   application/UI, documentation, generated output, secret, archive, or
   unknown before moving or deleting it.
2. Preserve useful Fadaka code and its history. Do not delete unknown code
   until references, licenses, tests, and ownership have been checked.
3. Select one authoritative implementation per subsystem. Keep other
   prototypes isolated until they pass compatibility and security review.
4. Establish reproducible builds and tests before changing consensus or
   token economics.
5. Use canonical serialization, domain-separated hashes, checked integer
   arithmetic, explicit transaction validation, and deterministic state
   transitions.
6. Keep private keys out of source control and build artifacts.
7. Treat the 1,000,000,000 FDAK supply as a protocol invariant to verify
   against genesis allocation, token contracts, issuance, fees, and tests.
   Do not silently change supply or minting rules.
8. Do not claim BFT finality, staking, slashing, bridges, WASM execution,
   or production security until the code and adversarial tests prove them.

## Work sequence

- Phase 0: secure the repository, inventory files, identify ownership and
  licenses, and define the authoritative core.
- Phase 1: select the canonical language/runtime and create a minimal
  reproducible build with unit tests.
- Phase 2: implement primitives, transactions, signatures, ledger rules,
  genesis, and complete state/block validation.
- Phase 3: implement storage, mempool, node lifecycle, and versioned RPC.
- Phase 4: implement and test peer networking and the chosen consensus
  protocol, including restart and Byzantine/fault scenarios.
- Phase 5: integrate wallet, execution, contracts, bridges, and SDKs only
  after their interfaces and threat models are defined.
- Phase 6: restore packaging, CI, release automation, and operational docs.

## Current status

This document records the rebuild direction. It does not claim that the
target architecture has been implemented or that the existing repository
builds successfully.
