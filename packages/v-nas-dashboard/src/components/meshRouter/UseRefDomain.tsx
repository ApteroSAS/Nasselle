import {useGetIdentity, useNotify} from "react-admin";
import {useEffect, useState} from "react";
import {getUserDomain, updateUserDomain} from "@/providers/mesh-router/MeshRouterAPI";

let domainNameCache = "";
let serverDomainCache = "";

export function useRefDomain(): {
    refDomain: string,
    serverDomain: string ,
    domainName: string,
    isLoading: boolean,
    setDomainName: (domainName: string) => Promise<void>,
    setServerDomain: (serverDomain: string) => Promise<void>,
} {
    const notify = useNotify();
    const {data, isLoading } = useGetIdentity();
    const userid:string = ""+data?.id;
    const [domainName, setDomainName] = useState(domainNameCache);
    const [isDomainLoading, setDomainLoading] = useState(!domainNameCache && !serverDomainCache);
    const [serverDomain, setServerDomain] = useState(serverDomainCache);

    useEffect(() => {
        if (isLoading) return;
        if (!userid) return;

        const loadProviderDetails = async () => {
            try {
                const {domainName, serverDomain} = await getUserDomain(userid);
                if (domainName && serverDomain) {
                    setDomainName(domainName);
                    domainNameCache = domainName;
                    setServerDomain(serverDomain);
                    serverDomainCache = serverDomain;
                }
                setDomainLoading(false);
            } catch (error) {
                console.error("Failed to fetch provider details:", error);
                notify('Failed to fetch provider details', {type: 'error'});
            }
        };

        loadProviderDetails();
    }, [userid, isLoading]);

    return {
        isLoading:isDomainLoading,
        refDomain:`${domainName}.${serverDomain}`,
        serverDomain,
        domainName,
        setDomainName:async (domainName: string) => {
            await updateUserDomain(userid, {domainName});
            domainNameCache = domainName;
            setDomainName(domainName);
        },
        setServerDomain:async (serverDomain: string) => {
            await updateUserDomain(userid, {serverDomain});
            serverDomainCache = serverDomain;
            setServerDomain(serverDomain)
        }
    };
}

/**
 *
 */