import { useUserIdentity } from "../App/user/UserIdentity";
import { useEffect, useState } from "react";
import { useDataProvider } from "react-admin";
import { ResourceKey } from "../App/UsersResource";
import { generateKeyPair, sign } from "../library/KeyLib";
import {useRefDomain} from "./UseRefDomain";

export function useProviderString(): {
    providerConfigString: string,
    regenerateKeyPair: () => Promise<void>,
    signature: string,
    publicKey: string,
    privateKeyTemp: string,
    setPrivateKeyTemp: (key: string) => void
} {
    const { data } = useUserIdentity();
    const domain = useRefDomain();
    const [signature, setSignature] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [privateKeyTemp, setPrivateKeyTemp] = useState((window as any).privkey || "");
    const dataProvider = useDataProvider();
    const userid = data?.id;

    const generateAndSetKeyPair = async (userid: string) => {
        let privkey = (window as any).privkey || privateKeyTemp;
        if (!privkey) {
            const keys = await generateKeyPair();
            (window as any).privkey = keys.priv;
            setPrivateKeyTemp(keys.priv);
            setPublicKey(keys.pub);
            await dataProvider.update(ResourceKey, { id: userid, data: { pubkey: keys.pub } } as any);
            console.log("Generated new key pair:", keys);
        }
    };

    const loadProviderDetails = async () => {
        if (userid) {
            try {
                const response = await dataProvider.getOne(ResourceKey, { id: userid });
                const { pubkey } = response.data || privateKeyTemp;
                setPublicKey(pubkey);
                let privkey = (window as any).privkey;
                if (!pubkey && !privkey) {
                    await generateAndSetKeyPair(userid);
                }
                if(privkey) {
                    setSignature(await sign(privkey, userid));
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
        providerConfigString: `https://${domain.serverDomain},${userid},${signature?signature:"<SIGNATURE>"}`,
        publicKey,
        privateKeyTemp,
        signature,
        regenerateKeyPair: async () => {
            (window as any).privkey = undefined;
            await generateAndSetKeyPair(userid);
            let privkey = (window as any).privkey;
            setPrivateKeyTemp(privkey);
            if(privkey) {
                setSignature(await sign(privkey, userid));
            }
        },
        setPrivateKeyTemp: (key: string) => {
            (window as any).privkey = key;
            setPrivateKeyTemp(key);
            loadProviderDetails();
        }
    };
}