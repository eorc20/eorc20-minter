import { Session, Chains } from "@wharfkit/session";
import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey";

// Wharfkit
if ( !process.env.ACTOR) throw new Error("ACTOR is required");
export const ACTOR = process.env.ACTOR
export const PERMISSION = process.env.PERMISSION ?? "active";
if ( !process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY is required");
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const VERBOSE = process.env.VERBOSE === "true";
export const MAX = parseInt(process.env.MAX ?? "50");

export const session = new Session({
    chain: Chains.EOS,
    actor: ACTOR,
    permission: PERMISSION,
    walletPlugin: new WalletPluginPrivateKey(PRIVATE_KEY),
})

export const publicKey = session.walletPlugin.data.privateKey.toPublic().toString();
