import { useUserIdentity } from "../App/user/UserIdentity";
import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { ResourceKey } from "../App/UsersResource";
import { generateKeyPair, sign } from "../library/KeyLib";
import {useRefDomain} from "./UseRefDomain";

export function useProviderString(): { str: string, regenerateKeyPair: () => Promise<void>, signature: string } {
    const { data } = useUserIdentity();
    const domain = useRefDomain();
    const [signature, setSignature] = useState("<SIGNATURE>");
    const dataProvider = useDataProvider();
    const userid = data?.id;

    const generateAndSetKeyPair = async (userid: string) => {
        let privkey = (window as any).privkey;
        if (!privkey) {
            const keys = await generateKeyPair();
            (window as any).privkey = keys.priv;
            privkey = keys.priv;
            await dataProvider.update(ResourceKey, { id: userid, data: { pubkey: keys.pub } } as any);
            console.log("Generated new key pair:", keys);
        }
        setSignature(await sign(privkey, userid));
    };

    const loadProviderDetails = async () => {
        if (userid) {
            try {
                const response = await dataProvider.getOne(ResourceKey, { id: userid });
                const { pubkey } = response.data;
                if (!pubkey) {
                    await generateAndSetKeyPair(userid);
                }
            } catch (error) {
                console.error("Failed to fetch provider details:", error);
            }
        }
    };

    useEffect(() => {
        loadProviderDetails();
    }, [userid]);

    return {
        str: `https://${domain.serverDomain},${userid},${signature}`,
        signature,
        regenerateKeyPair: async () => {
            await generateAndSetKeyPair(userid);
        }
    };
}