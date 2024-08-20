import type {PeerId} from "@libp2p/interface";
import * as crypto from "@libp2p/crypto";
import {peerIdFromKeys} from "@libp2p/peer-id";
import {base36} from 'multiformats/bases/base36'

export async function createPeerId(): Promise<PeerId> {
    const privateKey = await crypto.keys.generateKeyPair('Ed25519', 256);
    return await peerIdFromKeys(privateKey.public.bytes, privateKey.bytes);
}

/** Generate a new key pair base 36 string Ed25519 256 */
export async function generateKeyPair(): Promise<{pub:string,priv:string}> {
    const peerId = await createPeerId();
    const pub = peerId.toCID().toString(base36); //k5.. (IPNS)
    //const pub = peerId.toCID().toString(); //bafz...
    //const pub = peerId.toString(); //12D...
    const priv = base36.encode(peerId.privateKey);
    return {pub,priv};
}