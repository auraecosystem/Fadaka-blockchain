import { ethers } from "ethers";

// 1. Define Target Address and Minimal ERC-20 ABI
const TARGET_ADDRESS = "0x282BC57Bd84eeA8252dc86Fed1DE136F691DD35f";

const MINIMAL_ERC20_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function symbol() external view returns (string)",
    "function decimals() external view returns (uint8)"
];

// 2. Select Your Target Blockchain Provider (e.g., Ethereum Mainnet, BSC, Polygon)
// Swap this URL depending on the network you want to scan
const RPC_URL = "https://arc-mainnet.g.alchemy.com/v2/4aB6W9EnHEGFi_haCP1a4"; // Public Ethereum RPC
const provider = new ethers.JsonRpcProvider(https://arc-mainnet.g.alchemy.com/v2/4aB6W9EnHEGFi_haCP1a4);

async function checkBalances() {
    try {
        console.log(`📡 Querying network balances for: ${TARGET_ADDRESS}\n`);

        // --- Fetch Native Asset Balance (e.g., ETH) ---
        const nativeBalanceWei = await provider.getBalance(TARGET_ADDRESS);
        const nativeBalanceFormatted = ethers.formatEther(nativeBalanceWei);
        console.log(`🪙 Native Balance: ${nativeBalanceFormatted} ETH`);

        // --- Fetch Specific ERC-20 Token Balance (Optional Example) ---
        // Example: USDT Contract Address on Ethereum Mainnet
        const tokenContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; 
        
        const tokenContract = new ethers.Contract(tokenContractAddress, MINIMAL_ERC20_ABI, provider);
        
        // Execute queries in parallel
        const [tokenBalanceRaw, symbol, decimals] = await Promise.all([
            tokenContract.balanceOf(TARGET_ADDRESS),
            tokenContract.symbol(),
            tokenContract.decimals()
        ]);

        const tokenBalanceFormatted = ethers.formatUnits(tokenBalanceRaw, decimals);
        console.log(`🪙 Token Balance: ${tokenBalanceFormatted} ${symbol}`);

    } catch (error) {
        console.error("❌ Error fetching balances:", error);
    }
}

checkBalances();
