import { Bytes, Checksum256, KeyType, PrivateKey, AnyAction } from '@wharfkit/antelope';
import { session } from './config.js';

export function generatePrivateKey(seed: string) {
    return new PrivateKey(
        KeyType.K1,
        Bytes.from(Checksum256.hash(Bytes.from(seed, 'utf8')))
    );
}

export function generatePublicKey(seed: string) {
    return generatePrivateKey(seed).toPublic();
}

export async function transact(route: string, actions: AnyAction[]) {
    try {
        const response = await session.transact({ actions });
        if ( !response.response ) return console.warn("No response", 500);
        const { transaction_id } = response.response;
        console.info(`${route}::transact:response`, {transaction_id});
        return console.log(transaction_id);
    } catch (e: any) {
        console.error(`${route}::transact:error`, {message: e.message});
        return console.error(e.message, 400);
    }
}