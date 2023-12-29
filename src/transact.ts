import { AnyAction, Session } from "@wharfkit/session";
import { toTransactionId } from "./evm.js";
import { VERBOSE } from "./config.js";

export async function transact(session: Session, actions: AnyAction[]) {
    const response = await session.transact({actions});
    if ( response.response ) {
        const trx_id = response.response.transaction_id;
        if (VERBOSE) {
            console.info(`EOS\t${new Date().toISOString()}\thttps://eos.eosq.eosnation.io/tx/${trx_id}`);
        }
        const { action_traces } = response.response.processed;
        for ( const action_trace of action_traces ) {
            const rlptx = action_trace.act.data.rlptx;
            if ( rlptx && VERBOSE ) {
                console.info(`EVM\t${new Date().toISOString()}\thttps://explorer.evm.eosnetwork.com/tx/${toTransactionId(rlptx)}`);
            }
        }
    }
}