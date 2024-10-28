import { Button } from "@mui/material";
import {useDomain} from "./UseDomain.tsx";
import React, { useState } from 'react';
import { getAddress, kit, loadedPublicKey } from '../service/stellar-wallets-kit.ts';
import nasselle_contract from '../contracts/nasselle_contract';
import {vnasAction} from "../service/VNASService.ts";

// Update the ReserveButton to accept props
interface ReserveButtonProps {
    onChange?: () => void;
}

const CancelReservationButton: React.FC<ReserveButtonProps> = ({onChange}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const domain = useDomain().domain;

    const handleCancelClick = async (action:'cancel'|'delete'|'reboot'|'create'|'update') => {
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
            if(action === 'cancel') {
                const tx = await nasselle_contract.release_instance({
                    address: address,
                });

                await tx.signAndSend({
                    signTransaction: async (xdr: any) => {
                        const {signedTxXdr} = await kit.signTransaction(xdr);
                        return signedTxXdr;
                    },
                });
                action = 'delete';
            }

            if (onChange) {
                setTimeout(onChange, 5000);
            }

            await vnasAction(action);

            if (onChange) {
                setTimeout(onChange, 5000);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (<>
            {domain && <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={()=> handleCancelClick('cancel')}
                >

                    {loading ? 'Processing...' : `Cancel `}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={()=> handleCancelClick('delete')}
                >

                    {loading ? 'Processing...' : `Delete `}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={()=> handleCancelClick('create')}
                >
                    {loading ? 'Processing...' : `Re-create `}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={()=> handleCancelClick('reboot')}
                >

                    {loading ? 'Processing...' : `Reboot `}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={()=> handleCancelClick('update')}
                >

                    {loading ? 'Processing...' : `Update `}
                </Button>

            </div>}
        </>
    );
};

export default CancelReservationButton;
