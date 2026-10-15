import test from "node:test";
import assert from "node:assert/strict";
import { checkEntryPoint, ENTRYPOINT_V07 } from "../scripts/erc4337-entrypoint-preflight.mjs";

function fakeFetch(results) {
  const calls = [];
  const fetchImpl = async (_url, options) => {
    const request = JSON.parse(options.body);
    calls.push(request);
    const next = results.shift();
    if (next instanceof Error) throw next;
    return {
      ok: true,
      status: 200,
      json: async () => next,
    };
  };
  return { fetchImpl, calls };
}

test("checks chain ID and detects deployed EntryPoint bytecode", async () => {
  const { fetchImpl, calls } = fakeFetch([
    { jsonrpc: "2.0", id: 1, result: "0x539" },
    { jsonrpc: "2.0", id: 1, result: "0x60016000" },
  ]);
  const result = await checkEntryPoint({ rpcUrl: "http://localhost:8545", fetchImpl });
  assert.equal(result.chainId, "1337");
  assert.equal(result.entryPoint, ENTRYPOINT_V07);
  assert.equal(result.deployed, true);
  assert.equal(result.bytecodeBytes, 4);
  assert.equal(calls[0].method, "eth_chainId");
  assert.deepEqual(calls[1].params, [ENTRYPOINT_V07, "latest"]);
});

test("reports missing deployment without pretending it is ready", async () => {
  const { fetchImpl } = fakeFetch([
    { jsonrpc: "2.0", id: 1, result: "0x7a69" },
    { jsonrpc: "2.0", id: 1, result: "0x" },
  ]);
  const result = await checkEntryPoint({ rpcUrl: "http://localhost:8545", fetchImpl });
  assert.equal(result.chainId, "31337");
  assert.equal(result.deployed, false);
  assert.equal(result.bytecodeBytes, 0);
});

test("rejects unexpected chain IDs", async () => {
  const { fetchImpl, calls } = fakeFetch([
    { jsonrpc: "2.0", id: 1, result: "0x1" },
  ]);
  await assert.rejects(
    checkEntryPoint({ rpcUrl: "http://localhost:8545", expectedChainId: "31337", fetchImpl }),
    /Chain ID mismatch/,
  );
  assert.equal(calls.length, 1);
});

test("rejects JSON-RPC errors", async () => {
  const { fetchImpl } = fakeFetch([
    { jsonrpc: "2.0", id: 1, error: { code: -32601, message: "Method not found" } },
  ]);
  await assert.rejects(
    checkEntryPoint({ rpcUrl: "http://localhost:8545", fetchImpl }),
    /Method not found/,
  );
});

test("requires an RPC URL", async () => {
  await assert.rejects(checkEntryPoint({}), /FADAKA_RPC_URL is required/);
});
