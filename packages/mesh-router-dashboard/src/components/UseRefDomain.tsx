import {useDataProvider, useNotify} from "react-admin";
import {useUserIdentity} from "../App/user/UserIdentity";
import {useEffect, useState} from "react";
import {ResourceKey} from "../App/UsersResource";
import {aw} from "vitest/dist/chunks/reporters.C_zwCd4j";
import {app} from "../providers/firebaseAuthProvider";
import {doc, getFirestore, onSnapshot} from "firebase/firestore";
import {STORAGE_KEY} from "../configuration/NSLConfigResource";

export function useRefDomain(): {
    refDomain: string,
    serverDomain: string ,
    domainName: string,
    setDomainName: (domainName: string) => Promise<void>,
    setServerDomain: (serverDomain: string) => Promise<void>,
} {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const {data, isLoading} = useUserIdentity();
    const userid = data?.id;
    const [domainName, setDomainName] = useState("");
    const [serverDomain, setServerDomain] = useState("");

    useEffect(() => {
        if (isLoading) return;
        if (!userid) return;
        const db = getFirestore(app);
        const unsub = onSnapshot(doc(db, STORAGE_KEY, userid), (doc) => {
            if (doc.exists()) {
                const {domainName, serverDomain} = doc.data();
                if (domainName && serverDomain) {
                    setDomainName(domainName);
                    setServerDomain(serverDomain);
                }
            }
        });

        return () => unsub(); // Cleanup the listener when the component unmounts
    }, [userid, isLoading]);


    useEffect(() => {
        if (isLoading) return;
        if (!userid) return;
        const initialDomainName = (data as any).email ? (data as any).email.split('@')[0] : "";

        const loadProviderDetails = async () => {
            try {
                const response = await dataProvider.getOne(STORAGE_KEY, {id: userid});
                const {domainName, serverDomain} = response.data;
                if (domainName && serverDomain) {
                    setDomainName(domainName);
                    setServerDomain(serverDomain);
                } else {
                    await dataProvider.update(STORAGE_KEY, {id: userid, data: {domainName: initialDomainName, serverDomain: 'nsl.sh'}} as any);
                    setDomainName(initialDomainName);
                    setServerDomain('nsl.sh');
                }
            } catch (error) {
                console.error("Failed to fetch provider details:", error);
                notify('Failed to fetch provider details', {type: 'error'});
            }
        };

        loadProviderDetails();
    }, [userid, isLoading]);

    return {
        refDomain:`${domainName}.${serverDomain}`,
        serverDomain,
        domainName,
        setDomainName:async (domainName: string) => {
            await dataProvider.update(STORAGE_KEY, {id: userid, data: {domainName}} as any);
            setDomainName(domainName)
        },
        setServerDomain:async (serverDomain: string) => {
            await dataProvider.update(STORAGE_KEY, {id: userid, data: {serverDomain}} as any);
            setServerDomain(serverDomain)
        }
    };
}