import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography} from '@mui/material';
import {useDataProvider, useNotify} from 'react-admin';
import {useUserIdentity} from '../App/user/UserIdentity';
import {ResourceKey} from '../App/UsersResource';

export const EntryPointLink: React.FC = () => {
    const dataProvider = useDataProvider();
    const [refDomain, setRefDomain] = useState("");
    const notify = useNotify();
    const {data, isLoading, error} = useUserIdentity();
    const userid = data?.id;

    useEffect(() => {
        if (isLoading) return;
        if (!userid) return;
        const loadProviderDetails = async () => {
            try {
                const response = await dataProvider.getOne(ResourceKey, {id: userid});
                const {domainName, serverDomain} = response.data;
                setRefDomain(`${domainName}.${serverDomain}`);
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

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                🌐 Your domain is set up! You can check your dashboard at:
            </Typography>
            <Box style={styles.domainBox}>
                <Typography variant="h6" gutterBottom>
                    {refDomain}
                </Typography>
            </Box>
            <br/>
            <Button
                variant="contained"
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
        </div>
    );
};
