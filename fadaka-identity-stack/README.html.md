# Fadaka Keystore KMS

A lightweight Key Management System using PKCS#12 (.p12) keystores.

## Features
- Generate .p12 identities
- Export certificates
- Rotate cryptographic keys
- FastAPI control interface
- Ready for blockchain + TLS systems

## Run

```bash
bash src/generate.sh node1
uvicorn api.main:app --reload
```
```run
fadaka-identity-stack/
│
├── keystores/                  # .p12 identities (never commit real ones)
├── certs/
│
├── src/
│   ├── generate.sh
│   ├── rotate.sh
│   ├── list.sh
│   ├── export.sh
│
├── api/
│   ├── main.py                # FastAPI server
│   ├── signer.py             # signing logic
│   ├── verifier.py           # signature validation
│
├── crypto/
│   ├── p12_loader.py         # load .p12 keys
│   ├── sign.py               # cryptographic signing
│   ├── verify.py
│
├── node/
│   ├── identity.py           # node identity layer
│   ├── handshake.py          # TLS-style handshake logic
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│
├── tests/
│   ├── test_signing.py
│   ├── test_identity.py
│
├── .gitignore
├── README.md
└── requirements.txt
