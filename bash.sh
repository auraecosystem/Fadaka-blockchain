mkdir -p proofs

cat circuit.zkif | zkif_bellman setup
mv bellman-pk proofs/

cat computation.zkif | zkif_bellman prove
mv bellman-proof proofs/
git clone git@github.com:flashbots/rbuilder.git
cd rbuilder

# Run linter
make lint

# Run tests
make test

# Run benchmarks and open the report
make bench
make bench-report-open
# replaces '$HOME' with the actual value of "$HOME"
sed -i "s|\$HOME|$HOME|g" ./examples/config/rbuilder/config-playground.toml
./test-relay \
    --relay "https://boost-relay-hoodi.flashbots.net" \
    --validation-url "http://localhost:8545" \
    --cl-clients "http://localhost:5052" 
