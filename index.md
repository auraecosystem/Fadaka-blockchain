---
layout: default
title: Home
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fadaka Blockchain Wallet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 30px auto;
      padding: 20px;
      background: #f9f9f9;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #2c3e50;
    }
    button {
      padding: 10px 20px;
      margin: 5px 0;
      cursor: pointer;
      border: none;
      background-color: #3498db;
      color: white;
      font-size: 1em;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #2980b9;
    }
    input[type="text"], input[type="number"] {
      width: 100%;
      padding: 8px;
      margin: 5px 0 15px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 1em;
    }
    #log {
      background: #222;
      color: #eee;
      padding: 15px;
      height: 150px;
      overflow-y: auto;
      border-radius: 5px;
      font-family: monospace;
      margin-top: 20px;
    }
  </style>
</head>
<body>

  <h1>Fadaka Blockchain Wallet</h1>

  <button id="connectBtn">Connect Wallet</button>
  <button id="disconnectBtn" disabled>Disconnect Wallet</button>

  <div id="walletInfo" style="display:none;">
    <p><strong>Address:</strong> <span id="address"></span></p>
    <p><strong>Balance:</strong> <span id="balance">0</span> FAD</p>

    <h3>Send FadakaCoin</h3>
    <label for="toAddress">To Address:</label>
    <input type="text" id="toAddress" placeholder="0x..." />

    <label for="amount">Amount:</label>
    <input type="number" id="amount" min="0" step="0.01" placeholder="Amount to send" />

    <button id="sendBtn">Send</button>
  </div>

  <div id="log"></div>

<script>
  const fadakaABI = [/* Your contract ABI here */];
  const fadakaAddress = "0xYourContractAddressHere";

  let provider;
  let signer;
  let contract;

  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const walletInfo = document.getElementById("walletInfo");
  const addressSpan = document.getElementById("address");
  const balanceSpan = document.getElementById("balance");
  const toAddressInput = document.getElementById("toAddress");
  const amountInput = document.getElementById("amount");
  const sendBtn = document.getElementById("sendBtn");
  const logDiv = document.getElementById("log");

  function log(message) {
    const p = document.createElement("p");
    p.textContent = message;
    logDiv.appendChild(p);
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask or another Ethereum wallet extension required!");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      addressSpan.textContent = userAddress;
      walletInfo.style.display = "block";
      connectBtn.disabled = true;
      disconnectBtn.disabled = false;

      contract = new ethers.Contract(fadakaAddress, fadakaABI, signer);
      updateBalance();
      log("Wallet connected: " + userAddress);
    } catch (err) {
      log("Error connecting wallet: " + err.message);
    }
  }

  async function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    addressSpan.textContent = "";
    balanceSpan.textContent = "0";
    walletInfo.style.display = "none";
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    log("Wallet disconnected");
  }

  async function updateBalance() {
    if (!signer) return;
    try {
      const userAddress = await signer.getAddress();
      const balanceBigNumber = await contract.balanceOf(userAddress);
      const decimals = await contract.decimals();
      const balanceFormatted = ethers.utils.formatUnits(balanceBigNumber, decimals);
      balanceSpan.textContent = balanceFormatted;
    } catch (err) {
      log("Error fetching balance: " + err.message);
    }
  }

  async function sendTokens() {
    if (!contract) {
      alert("Please connect your wallet first.");
      return;
    }
    const to = toAddressInput.value.trim();
    const amount = amountInput.value.trim();
    if (!ethers.utils.isAddress(to)) {
      alert("Invalid recipient address.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Invalid amount.");
      return;
    }
    try {
      const decimals = await contract.decimals();
      const amountParsed = ethers.utils.parseUnits(amount, decimals);

      log(`Sending ${amount} FAD to ${to}...`);
      const tx = await contract.transfer(to, amountParsed);
      log("Transaction sent, waiting confirmation...");
      await tx.wait();
      log("Transaction confirmed! Hash: " + tx.hash);
      updateBalance();
      toAddressInput.value = "";
      amountInput.value = "";
    } catch (err) {
      log("Transaction failed: " + err.message);
    }
  }

  connectBtn.onclick = connectWallet;
  disconnectBtn.onclick = disconnectWallet;
  sendBtn.onclick = sendTokens;
</script>

<script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js" type="application/javascript"></script>

</body>
</html>
