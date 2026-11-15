from web3 import Web3

# EVM addresses are type-hinted as strings in Python
target_address: str = "0x282BC57Bd84eeA8252dc86Fed1DE136F691DD35f"

# Check if structural layout matches and validate checksum integrity
is_valid = Web3.is_address(target_address)
is_checksum = Web3.is_checksum_address(target_address)

print(f"Address Valid: {is_valid}, Checksum Correct: {is_checksum}")
