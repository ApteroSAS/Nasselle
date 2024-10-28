import nasselle_contract from "../contracts/nasselle_contract.ts";
import type {Provider} from "../components/Provider.tsx";


export type ProviderListType = Map<string, Provider>; // Array of tuple, where the first value is a string (ID), and the second is a Provider object

export async function listProviders() {
    let res: ProviderListType = new Map<string, Provider>();

    const response = await nasselle_contract.list_providers();
    // Explicitly type-check the result to avoid runtime issues
    if (response && Array.isArray(response.result)) {
        let req = new Map<string, Provider>(response.result);
        for (let [key, value] of req) {
            res.set(key, value);
        }
    }
    return res;
}