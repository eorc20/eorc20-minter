import { HDNodeWallet } from 'ethers';

export function generateWallet(seed: string, pathIndex = 0) {
    return HDNodeWallet.fromSeed(seed).derivePath(
        `m/44'/60'/0'/0/${pathIndex}`
    );
}

export function generatePrivateKey(seed: string, pathIndex = 0) {
    return generateWallet(seed, pathIndex).privateKey as `0x${string}`
}

export function generatePublicKey(seed: string, pathIndex = 0) {
    return generateWallet(seed, pathIndex).publicKey as `0x${string}`
}
