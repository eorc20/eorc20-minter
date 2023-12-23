import { Bytes, Checksum256, KeyType, PrivateKey, AnyAction } from '@wharfkit/antelope';

export function generatePrivateKey(seed: string) {
    return new PrivateKey(
        KeyType.K1,
        Bytes.from(Checksum256.hash(Bytes.from(seed, 'utf8')))
    );
}

export function generatePublicKey(seed: string) {
    return generatePrivateKey(seed).toPublic();
}
