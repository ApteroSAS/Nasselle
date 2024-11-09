export const collectionName = "nsl-router";

export interface NSLRouterData {
    serverDomain: string;
    domainName: string;
    publicKey: string;
    source?: string;

    //meta
    id?: string;
    createdate?: string;
    createdby?: string;
    lastupdate?: string;
    updatedby?: string;
}