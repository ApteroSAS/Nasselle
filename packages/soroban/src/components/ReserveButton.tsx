import React, { useState } from 'react';
import { getAddress, kit, loadedPublicKey } from '../service/stellar-wallets-kit.ts';
import nasselle_contract from '../contracts/nasselle_contract';
import {createUser} from "../service/VNASService.ts";
import type {Provider} from "./Provider.tsx";

// Update the ReserveButton to accept props
interface ReserveButtonProps {
    provider: Provider;
    onProviderReserved?: (provider: Provider) => void;
    disabled?: boolean;
    name: string;
    price: number;
}

const ReserveButton: React.FC<ReserveButtonProps> = ({ name,provider,onProviderReserved,disabled,price }) => {
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async () => {
        if(loading) return;
        const publicKey = loadedPublicKey();
        const address = await getAddress();

        if (!publicKey) {
            alert('Please connect your wallet first');
            return;
        } else {
            nasselle_contract.options.publicKey = publicKey;
        }

        setLoading(true);

        try {
            await createUser(name, provider.provider_url);//TMP create web2 VNAS user

            const tx = await nasselle_contract.reserve_instance({
                caller_address: address,
                amount: BigInt(price), // value: price,
                provider_name: provider.provider_name, // Use provider name from props
                reserved_name: name, // Replace with actual reserved name if necessary
            });

            await tx.signAndSend({
                signTransaction: async (xdr: any) => {
                    const { signedTxXdr } = await kit.signTransaction(xdr);
                    return signedTxXdr;
                },
            });

            if (onProviderReserved) {
                onProviderReserved(provider);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button disabled={disabled} onClick={handleClick} aria-controls="current-value">
                {loading ? 'Processing...' : `Reserve `}
            </button>
        </div>
    );
};

export default ReserveButton;
