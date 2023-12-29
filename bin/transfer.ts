import { Address } from "viem";
import { transfer } from "../src/actions.js"
import { transact } from "../src/transact.js";
import { Chains, Session } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";

// CLI
const from = process.argv[2] as string;
const to = process.argv[3] as Address;
const amount = process.argv[4] as string;
const tick = process.argv[5] as string;

if ( !from || !to || !amount || !tick ) {
    console.error("Usage: bun transfer.ts <from>@active <to>,<to>... <amount> <tick>");
    process.exit(1);
}
if (!process.env.PRIVATE_KEY) {
    console.error("PRIVATE_KEY is required");
    process.exit(1);
}
let [actor, permission] = from.split("@");
if (!permission) permission = "active";

// Wharfkit Session
const session = new Session({
    chain: Chains.EOS,
    actor,
    permission,
    walletPlugin: new WalletPluginPrivateKey(process.env.PRIVATE_KEY),
})

// push transaction
const accounts = to.split(",") as Address[];
const actions = accounts.map(account => transfer(session, account, amount, tick));
await transact(session, actions);
