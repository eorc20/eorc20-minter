import { AnyAction, Session } from "@wharfkit/session"
import { call, convertToAddress } from "./evm.eos.js"
import { Address, parseUnits, toHex } from "viem"

export function mine(session: Session): AnyAction {
    return {
        account: "fast.sx",
        name: "mine",
        authorization: [session.permissionLevel],
        data: {
            executor: session.actor,
            nonce: Math.floor(Math.random() * 1000000000),
        }
    }
}

export function noop(session: Session): AnyAction {
    return {
        account: "cpu.sx",
        name: "noop",
        authorization: [session.permissionLevel],
        data: {
            nonce: Math.floor(Math.random() * 1000000000),
        }
    }
}

export function inscribe(session: Session): AnyAction {
    const valueHex = "0x646174613a2c7b2270223a22656f72633230222c226f70223a226d696e74222c227469636b223a22656f7373222c22616d74223a223130303030227d"
    return call(session, convertToAddress(session.actor.toString()), parseUnits("0", 0), valueHex)
}

export function transfer(session: Session, to: Address, amount: number|string, tick: string): AnyAction {
    const data = `data:,{"p":"eorc20","op":"transfer","tick":"${tick}","amt":"${amount}"}`
    return call(session, to, parseUnits("0.01", 18), toHex(data))
}