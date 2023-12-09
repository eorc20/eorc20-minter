import { bytesToHex, numberToBytes, Address, parseGwei, createPublicClient, http, parseAbi, PrivateKeyAccount, Chain } from 'viem'
import { eos } from 'viem/chains'
import { session } from './config.js'
import { Client, toTransactionId } from './evm.js'
import { AnyAction, Name, Session, UInt64 } from '@wharfkit/session'
import BN from 'bn.js';

// Chain specific
export const chain: Chain = eos;
export const client: Client = createPublicClient({chain, transport: http() })
export const gas = 125000n; // Gas Limit
export const gasPrice = parseGwei('150'); // Gas Price (Fixed to 150 Gwei)
export const abi = parseAbi([
    'function bridgeTransfer(address to, uint256 amount, string memo) returns (bool)',
])

export function convertFromAddress(address: `0x${string}`): Name  {
    const value = new BN(address.replace(/^0xbbbbbbbbbbbbbbbbbbbbbbbb/, ""), 16)
    return new Name(new UInt64(value));
}

export function convertToAddress(name: string): `0x${string}` {
    const { value } = Name.from(name).value;
    return `0xbbbbbbbbbbbbbbbbbbbbbbbb${value.toString(16,16)}`;
}

export function pushtx(serializedTransaction: Address): AnyAction {
    console.info("pushtx", {serializedTransaction});
    return {
        account: "eosio.evm",
        name: "pushtx",
        authorization: [session.permissionLevel],
        data: {
            miner: session.actor,
            rlptx: serializedTransaction.replace(/^0x/,""),
        }
    }
}

export function call(session: Session, to: Address, value: bigint, data?: Address): AnyAction {
    // console.info("call", {from: session.actor.toString(), to, value})
    const valueHex = bytesToHex(numberToBytes(value, {size: 32}), {size: 32}).replace(/^0x/,"");
    return {
        account: "eosio.evm",
        name: "call",
        authorization: [session.permissionLevel],
        data: {
            from: session.actor,
            to: to.replace(/^0x/,""),
            value: valueHex,
            data: data?.replace(/^0x/,"") ?? "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            gas_limit: gas,
        }
    }
}

export async function sign(nonce: number, account: PrivateKeyAccount, to: Address, value: bigint, data?: Address) {
    const serializedTransaction = await account.signTransaction({
        chainId: chain.id,
        gas,
        gasPrice,
        nonce,
        to,
        value,
        data,
    })
    const trx_id = toTransactionId(serializedTransaction);
    console.info("sign", {nonce, account: account.address, to, value, data, trx_id})
    return serializedTransaction;
}
