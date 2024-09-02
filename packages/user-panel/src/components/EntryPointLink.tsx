import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography} from '@mui/material';
import {useDataProvider, useNotify} from 'react-admin';
import {useUserIdentity} from '../App/user/UserIdentity';
import {ResourceKey} from '../App/UsersResource';

export const EntryPointLink: React.FC = () => {
    const dataProvider = useDataProvider();
    const [refDomain, setRefDomain] = useState<string>("");
    const [vnas, setVnas] = useState<string>("");
    const notify = useNotify();
    const {data, isLoading, error} = useUserIdentity();
    const userid = data?.id;

    useEffect(() => {
        if (isLoading) return;
        if (!userid) return;
        const loadProviderDetails = async () => {
            try {
                const response = await dataProvider.getOne(ResourceKey, {id: userid});
                const {domainName, serverDomain,vnas} = response.data;
                if (domainName && serverDomain) {
                    setRefDomain(`${domainName}.${serverDomain}`);
                }
                setVnas(vnas);
            } catch (error) {
                console.error("Failed to fetch provider details:", error);
                notify('Failed to fetch provider details', {type: 'error'});
            }
        };

        loadProviderDetails();
    }, [userid, isLoading]);

    const styles = {
        paper: {
            padding: '2em',
            maxWidth: '800px',
            backgroundColor: '#fff',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
        } as React.CSSProperties,
        domainBox: {
            padding: '1em',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            marginTop: '1em',
            textAlign: 'center',
        } as React.CSSProperties,
    };

    return (<>{refDomain && <div>
            <Typography variant="h4" gutterBottom>
                🌐 Everything is ready! Access your dashboard
            </Typography>
            <Box style={styles.domainBox}>
                {vnas && vnas!="setup-ok" && <Typography variant="h6" gutterBottom>
                    Login : {vnas.split(':')[0]} <br/>
                    Password : {vnas.split(':')[1]}
                </Typography>}
                <Typography variant="h6" gutterBottom>
                    {refDomain}
                </Typography>
            </Box>
            <br/>
            <Button
                variant="contained"
                fullWidth
                color="primary"
                onClick={() => {
                    const newTab = window.open(`https://${refDomain}`, '_blank');
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
