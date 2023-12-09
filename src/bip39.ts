import { mnemonicToSeedSync } from "bip39";

export function generateSeed(mnemonic: string, password: string) {
    return "0x" + mnemonicToSeedSync(mnemonic, password).toString('hex');
}
