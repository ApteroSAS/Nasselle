import React from 'react';
import {Button, Typography} from '@mui/material';
import {NameManagement} from "./NameManagement";
import {useRefDomain} from "./UseRefDomain";

interface DockerSetupProps {
    editMode: boolean;
}

export const EntryPointLink: React.FC<DockerSetupProps> = ({editMode}) => {
    const domain = useRefDomain();
    return (<>{domain.refDomain && <div>
            <Typography variant="h4" gutterBottom>
                🌐 Everything is ready!
            </Typography>
            <NameManagement editMode={editMode}/>
            <Button
                variant="contained"
                fullWidth
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={() => {
                    const newTab = window.open(`https://${domain.refDomain}`, '_blank');
                    if (newTab) {
                        newTab.focus();
                    }
                }}
            >
                Visit Dashboard
            </Button>
        </div>}</>
    );
};
