import React, {useState} from 'react';
import RegisterProvider from './RegisterProvider.tsx';
import ProviderList from './ProviderList.tsx';
import ConnectWallet from "./ConnectWallet.tsx";

const ProviderPanel: React.FC = () => {
    const [isProvider, setIsProvider] = useState(true);
    const [connected, setConnected] = useState(false);

    const toggleView = () => {
        setIsProvider(!isProvider);
    };

    return (
        <div>
            {!connected && <>
                <p className="instructions">
                    Nasselle offers seamless, secure, and scalable network-attached storage management solutions.
                    Perfect for Tech Enthusiasts, Small to Medium Businesses, and anyone looking to enhance their data
                    management and security.
                </p>
                <ConnectWallet onConnected={() => {
                    setConnected(true);
                }}/>
            </>}
            {connected && <>
                {isProvider ? <ProviderList/> : <RegisterProvider/>}
                <br/>
                <button onClick={toggleView}>
                    {isProvider ? 'I am a requester' : 'I am a provider'}
                </button>
            </>}
        </div>
    );
};

export default ProviderPanel;
