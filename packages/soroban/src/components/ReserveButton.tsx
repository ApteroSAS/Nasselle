import React, { useState, useEffect } from 'react';
import { getAddress, kit, loadedPublicKey } from './stellar-wallets-kit';
import nasselle_contract from '../contracts/nasselle_contract';

// Define the provider prop type
type Provider = {
    provider_name: string;
    provider_url: string;
};

// Update the ReserveButton to accept props
interface ReserveButtonProps {
    provider: Provider;
}

const ReserveButton: React.FC<ReserveButtonProps> = ({ provider }) => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchContractData = async () => {
            try {
                const providers = await nasselle_contract.list_providers();
                const reserved = await nasselle_contract.list_reserved({ provider_name: provider.provider_name });
                console.log('list_providers ', providers.result);
                console.log('list_reserved ', reserved.result);
            } catch (e) {
                console.error(e);
            }
        };

        fetchContractData();
    }, [provider.provider_name]);

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
            const tx = await nasselle_contract.reserve_instance({
                caller_address: address,
                amount: 1000000000n, // Ensure this is the correct value
                provider_name: provider.provider_name, // Use provider name from props
                reserved_name: 'test', // Replace with actual reserved name if necessary
            });

            await tx.signAndSend({
                signTransaction: async (xdr: any) => {
                    const { signedTxXdr } = await kit.signTransaction(xdr);
                    return signedTxXdr;
                },
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleClick} aria-controls="current-value">
                {loading ? 'Processing...' : `Reserve `}
            </button>
        </div>
    );
};

export default ReserveButton;
