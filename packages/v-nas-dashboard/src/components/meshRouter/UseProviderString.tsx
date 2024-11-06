import {generateKeyPair, sign, useUserIdentity} from "dashboard-core";
import {useEffect, useState} from "react";
import {useRefDomain} from "./UseRefDomain";
import {getUserDomain, updateUserDomain} from "@/providers/mesh-router/MeshRouterAPI";

let signatureCache = "";
let publicKeyCache = "";

export function useProviderString(): {
    providerConfigString: string,
    regenerateKeyPair: () => Promise<void>,
    signature: string,
    publicKey: string,
    privateKeyTemp: string,
    isLoading: boolean,
    setPrivateKeyTemp: (key: string) => void
} {
    const { data } = useUserIdentity();
    const domain = useRefDomain();
    const [signature, setSignature] = useState(signatureCache);
    const [publicKey, setPublicKey] = useState(publicKeyCache);
    const [isLoading, setIsLoading] = useState(!publicKeyCache && !signatureCache);
    const [privateKeyTemp, setPrivateKeyTemp] = useState((window as any).privkey || "");
    const userid:string = data?.id || "";

    const generateAndSetKeyPair = async (userid: string) => {
        const privkey = (window as any).privkey || privateKeyTemp;
        if (!privkey) {
            const keys = await generateKeyPair();
            (window as any).privkey = keys.priv;
            setPrivateKeyTemp(keys.priv);
            setPublicKey(keys.pub);
            publicKeyCache = keys.pub;
            await updateUserDomain(userid, { publicKey: keys.pub });
            console.log("Generated new key pair:", keys);
        }
    };

    const loadProviderDetails = async () => {
        if (userid) {
            try {
                const { publicKey } = await getUserDomain(userid);
                setPublicKey(publicKey);
                publicKeyCache = publicKey;
                let privkey = (window as any).privkey;
                if (!publicKey && !privkey) {
                    await generateAndSetKeyPair(userid);
                }
                privkey = (window as any).privkey;
                if(privkey) {
                    const signature = await sign(privkey, userid);
                    setSignature(signature);
                    signatureCache = signature;
                }
            } catch (error) {
                console.error("Failed to fetch provider details:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        loadProviderDetails();
    }, [userid]);

    return {
        isLoading,
        providerConfigString: `https://${domain.serverDomain},${userid},${signature?signature:"<SIGNATURE>"}`,
        publicKey,
        privateKeyTemp,
        signature,
        regenerateKeyPair: async () => {
            (window as any).privkey = undefined;
            await generateAndSetKeyPair(userid);
            const privkey = (window as any).privkey;
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