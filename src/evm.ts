import { encodeFunctionData, keccak256, Address, parseAbi, PrivateKeyAccount, Chain, Transport, PublicClient } from 'viem'

export type Client = PublicClient<Transport, Chain>

export const abi = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) returns (uint256)',
])

export async function getBalanceOf(client: Client, account: Address, address: Address) {
  const balance = await client.readContract({
      address,
      abi,
      args: [account],
      functionName: "balanceOf" as never,
  }) as bigint;
  console.info("getBalanceOf", {chainId: client.chain.id, account, address, balance})
  return balance;
}

export async function getBalance(client: Client, address: Address) {
  const balance = await client.getBalance({address});
  console.info("getBalance", {chainId: client.chain.id, address, balance});
  return balance;
}

export function toTransactionId(rlptx: Address) {
  const value = Buffer.from(rlptx.replace(/^0x/,""), "hex");
  return keccak256(value);
}

// Transfers
export async function transferData(from: PrivateKeyAccount, receiver: Address, token: Address, amount: bigint) {
  console.info("transferData", {from: from.address, receiver, token, amount});
  return encodeFunctionData({abi, args: [receiver, amount], functionName: "transfer"});
}

export async function getNonce(client: Client, address: Address) {
  const nonce = await client.getTransactionCount({
    address,
  })
  console.info("getNonce", {chainId: client.chain.id, address, nonce});
  return nonce;
}
