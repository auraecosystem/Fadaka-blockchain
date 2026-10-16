#!/usr/bin/env node

/**
 * Read-only preflight for ERC-4337 EntryPoint v0.7.0 on a Fadaka RPC.
 * This script never sends transactions or deploys contracts.
 */
export const ENTRYPOINT_V07 = "0x0000000071727de22e5e9d8baf0edac6f37da032";

async function rpcCall(rpcUrl, method, params = [], fetchImpl = fetch) {
  const response = await fetchImpl(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status} for ${method}`);
  const payload = await response.json();
  if (payload.error) {
    throw new Error(`RPC ${method} failed: ${payload.error.message ?? "unknown error"}`);
  }
  if (!Object.hasOwn(payload, "result")) {
    throw new Error(`RPC ${method} response has no result`);
  }
  return payload.result;
}

export async function checkEntryPoint({
  rpcUrl,
  expectedChainId,
  fetchImpl = fetch,
}) {
  if (!rpcUrl) throw new Error("FADAKA_RPC_URL is required");
  const chainId = await rpcCall(rpcUrl, "eth_chainId", [], fetchImpl);
  if (typeof chainId !== "string" || !/^0x[0-9a-f]+$/i.test(chainId)) {
    throw new Error("eth_chainId returned an invalid hexadecimal chain ID");
  }
  const normalizedChainId = BigInt(chainId).toString(10);
  if (expectedChainId && normalizedChainId !== String(BigInt(expectedChainId))) {
    throw new Error(
      `Chain ID mismatch: RPC reports ${normalizedChainId}, expected ${expectedChainId}`,
    );
  }

  const code = await rpcCall(
    rpcUrl,
    "eth_getCode",
    [ENTRYPOINT_V07, "latest"],
    fetchImpl,
  );
  if (typeof code !== "string" || !/^0x(?:[0-9a-f]{2})*$/i.test(code)) {
    throw new Error("eth_getCode returned malformed bytecode");
  }
  if (code === "0x") {
    return {
      chainId: normalizedChainId,
      entryPoint: ENTRYPOINT_V07,
      deployed: false,
      bytecodeBytes: 0,
    };
  }
  return {
    chainId: normalizedChainId,
    entryPoint: ENTRYPOINT_V07,
    deployed: true,
    bytecodeBytes: (code.length - 2) / 2,
  };
}

if (import.meta.url === new URL(process.argv[1] ?? "", "file:").href) {
  try {
    const result = await checkEntryPoint({
      rpcUrl: process.env.FADAKA_RPC_URL,
      expectedChainId: process.env.FADAKA_EXPECTED_CHAIN_ID,
    });
    console.log(JSON.stringify(result, null, 2));
    if (!result.deployed) {
      console.error("EntryPoint v0.7.0 is not deployed at the canonical address on this chain.");
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(`ERC-4337 preflight failed: ${error.message}`);
    process.exitCode = 1;
  }
}
