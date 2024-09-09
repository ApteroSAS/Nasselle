import React, { useState } from 'react';
import { kit, setPublicKey } from './stellar-wallets-kit';

interface ConnectComponentProps {
    onConnected?: (publicKey: string) => void;
}

const ConnectComponent: React.FC<ConnectComponentProps> = ({ onConnected }) => {
    const [publicKey, setPublicKeyState] = useState<string | null>(null);
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const setLoggedIn = (publicKey: string) => {
        setPublicKeyState(publicKey);
        if (onConnected) {
            onConnected(publicKey);  // Invoke the callback with the public key
        }
    };

    const handleConnect = async () => {
        setButtonDisabled(true);

        try {
            await kit.openModal({
                onWalletSelected: async (option: any) => {
                    try {
                        kit.setWallet(option.id);
                        const { address } = await kit.getAddress();
                        setPublicKey(address);
                        setLoggedIn(address);  // Call setLoggedIn to trigger the callback
                    } catch (e) {
                        console.error(e);
                    }
                },
            });
        } catch (e) {
            console.error(e);
        }

        setButtonDisabled(false);
    };

    return (
        <div id="connect-wrap" className="wrap" aria-live="polite">
            <div className="ellipsis" title={publicKey || ''}>
                {publicKey ? `Signed in as ${publicKey}` : <button data-connect onClick={handleConnect} disabled={isButtonDisabled}>Connect</button>}
            </div>

            <style>{`
        .wrap {
          text-align: center;
        }

        .ellipsis {
          line-height: 2.7rem;
          margin: auto;
          max-width: 12rem;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          white-space: nowrap;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default ConnectComponent;
