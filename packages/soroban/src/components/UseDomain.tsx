import { useState, useEffect } from 'react';
import nasselle_contract from '../contracts/nasselle_contract';
import { getAddress } from "../service/stellar-wallets-kit.ts";

type ReservedInstanceInfo = {
    amount: number;
    id: number;
    provider_name: string;
    reserved_name: string;
};

type ProviderInfo = {
    provider_url: string;
    provider_name: string;
};

type DomainInfo = {
    domainName: string;
    serverDomain: string;
} | null;

export const useDomain = (): {
    domain : DomainInfo,
    refresh: () => void,
} => {
    const [domain, setDomain] = useState<DomainInfo>(null);

    const refresh = async () => {
        try {
            const address = await getAddress();
            const instance = await nasselle_contract.list_all_reserved();
            const instanceMap = new Map<string, ReservedInstanceInfo>(instance.result as any);
            if (instanceMap.has(address)) {
                const provider = instanceMap.get(address) as ReservedInstanceInfo;
                const providers = await nasselle_contract.list_providers();
                const providersMap = new Map<string, ProviderInfo>(providers.result as any);
                if (providersMap.has(provider.provider_name)) {
                    const providerEntry = providersMap.get(provider.provider_name);
                    if (providerEntry?.provider_url) {
                        setDomain({
                            domainName: provider.reserved_name,
                            serverDomain: providerEntry?.provider_url
                        });
                    } else {
                        setDomain(null);
                    }
                } else {
                    setDomain(null);
                }
            } else {
                setDomain(null);
            }
        } catch (e) {
            setDomain(null);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    return {
        domain,
        refresh: async () => {
            await refresh();
        }
    };
};