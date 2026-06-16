#cline
forge init eip-7702-project
cd eip-7702-project

git clone https://github.com/quiknode-labs/qn-guide-examples.git
cd qn-guide-examples/ethereum/eip-7702
i
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-
git clone --recursive https://github.com/argotorg/solidity.git
cd solidity
# Use last commit timestamp as the build date
$ export SOURCE_DATE_EPOCH=$(git log -1 --pretty=%ct)

# build #1
$ rm -rf target/
$ cargo build --release
$ sha256sum target/release/rbuilder
d92ac33b94e16ed4a035b9dd52108fe78bd9bb160a91fced8e439f59b84c3207  target/release/rbuilder

# build #2
$ rm -rf target/
$ cargo build --release
$ sha256sum target/release/rbuilder
d92ac33b94e16ed4a035b9dd52108fe78bd9bb160a91fced8e439f59b84c3207  target/release/rbuilder
