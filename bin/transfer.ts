import { Address } from "viem";
import { transfer } from "../src/actions.js"
import { session } from "../src/config.js";
import { transact } from "../src/transact.js";
import { toTransactionId } from "../src/evm.js";
import { AnyAction } from "@wharfkit/session";
// import { toTransactionId } from "../src/evm.js";

// const to = process.argv[2] as Address;
// const amount = process.argv[3];

// if ( !to || !amount ) {
//     console.error("Usage: bun transfer.ts <to> <amount>");
//     process.exit(1);
// }

const accounts: Address[] = [

]
const amount = 1000 * 10000;
const actions = accounts.map(to => transfer(session, to, amount));

await transact(session, actions)
// await sleep(1500);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// console.log(toTransactionId('0xf87b8351482f8522ecb25c008301e8489473a0592d780d6fcc016816930b9f55f48a9e05e3872386f26fc10000b843646174613a2c7b2270223a22656f72633230222c226f70223a227472616e73666572222c227469636b223a22656f7373222c22616d74223a223130303030303030227d1b808855318063a0000000'));