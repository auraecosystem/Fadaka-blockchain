# Security Policy

## Reporting

Do not publish exploit details, credentials, private keys, seed phrases, or
unpatched vulnerabilities in public issues. Report suspected vulnerabilities
privately to the repository maintainers.

## Secrets

- Never commit private keys, wallet files, seed phrases, API tokens, RPC URLs
  containing credentials, or production environment files.
- Load secrets from the process environment or an approved secret manager.
- Keep only redacted examples in source control.
- Rotate any credential that has ever been committed, even if the file is
  later deleted.
- Removing a secret from the current tree does not remove it from Git history,
  forks, caches, releases, or CI logs.

## Cryptographic code

- Do not implement cryptographic primitives from scratch for production use.
- Do not log, serialize, return, or expose private key material.
- Require independent review and test vectors before enabling signing,
  consensus, bridge, validator, or wallet functionality.
- Treat placeholder cryptography and simulated signatures as non-production.

## Network and node operation

- Bind administrative and wallet interfaces to loopback by default.
- Require explicit authentication and authorization for state-changing RPCs.
- Do not expose validator keys or unrestricted administrative RPC endpoints.
- Validate all peer messages and impose resource limits.
