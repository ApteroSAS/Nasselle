import React, {useState} from 'react';
import RegisterProvider from './RegisterProvider.tsx';
import ProviderList from './ProviderList.tsx';
import ConnectWallet from "./ConnectWallet.tsx";
import {EntryPointLink} from "./EntryPointLink.tsx";
import {useDomain} from "./UseDomain.tsx";
import VNASControl from "./VNASControl.tsx";

const ProviderPanel: React.FC = () => {
    const [isProvider, setIsProvider] = useState(false);
    const [connected, setConnected] = useState(false);
    const {domain,refresh} = useDomain();

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
                {isProvider ? <RegisterProvider/> : <>
                    {domain && <>
                        <EntryPointLink/>
                        <br/>
                        <VNASControl onChange={() => {
                            refresh()
                        }}/>
                        <br/>
                    </>}
                    {!domain && <ProviderList onProvided={() => {refresh()}}/>}
                    </>}
                <br/>
                <button onClick={toggleView}>
                    {isProvider ? 'I am a requester' : 'I am a provider'}
                </button>
            </>}
        </div>
    );
};

export default ProviderPanel;
