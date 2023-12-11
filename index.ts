import { ACTOR, MAX, VERBOSE, publicKey, session } from "./src/config.js";
import { inscribe, noop } from "./src/actions.js";
import Queue from "p-queue";
import { convertToAddress } from "./src/evm.eos.js";
import { AnyAction } from "@wharfkit/session";
import { toTransactionId } from "./src/evm.js";

console.info(`EOS session: ${session.actor}@${session.permission} [${publicKey}]`)
console.info(`EVM address: ${convertToAddress(ACTOR)}`);

const queue = new Queue({concurrency: 1});
if ( MAX === 0 ) process.exit(0);

function generateActions(): AnyAction[] {
    const actions: AnyAction[] = [noop(session)]
    for ( const _ of Array(MAX).keys() ) {
        actions.push(inscribe(session));
    }
    return actions;
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addToQueue() {
    queue.add(async () => {
        const actions = generateActions();
        try {
            const response = await session.transact({actions});
            if ( response.response ) {
                const trx_id = response.response.transaction_id;
                if (VERBOSE) {
                    console.info(`EOS\t${new Date().toISOString()}\t${trx_id}`);
                }
                const { action_traces } = response.response.processed;
                for ( const action_trace of action_traces ) {
                    const rlptx = action_trace.act.data.rlptx;
                    if ( rlptx && VERBOSE ) {
                        console.info(`EVM\t${new Date().toISOString()}\t${toTransactionId(rlptx)}`);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        await timeout(500);
        addToQueue();
    });
}

addToQueue();
