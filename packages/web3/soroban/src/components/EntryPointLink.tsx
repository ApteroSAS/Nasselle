import React from 'react';
import {Typography} from '@mui/material';
import {useDomain} from "./UseDomain.tsx";

interface DockerSetupProps {
}

//TODO pool the id on the provider every second to check the state
// if instance then display the dashboard
export const EntryPointLink: React.FC<DockerSetupProps> = ({}) => {
    const domain = useDomain().domain;
    if (!domain) {
        return <>
            <Typography variant="h5" style={{fontSize:"2em"}}>Please wait...</Typography>
        </>;
    }else {
        const refDomain = `${domain.domainName}.${domain.serverDomain}`;
        return (<><div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Typography variant="h4" gutterBottom>
                    Everything is ready!
                </Typography>
                <Typography variant="h5" style={{fontSize: "2em"}}>{refDomain}</Typography>

                <button
                    style={{marginTop: '20px', width: '100%', height: '50px', fontSize: '1.5em'}}
                    aria-controls="current-value"
                    onClick={() => {
                        const newTab = window.open(`https://${refDomain}`, '_blank');
                        if (newTab) {
                            newTab.focus();
                        }
                    }}
                >
                    Visit Dashboard
                </button>
            </div></>
        );
    }
};
