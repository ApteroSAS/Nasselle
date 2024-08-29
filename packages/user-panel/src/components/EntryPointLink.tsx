import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { useDataProvider } from 'react-admin';
import { useUserIdentity } from '../App/user/UserIdentity';
import { domainSuffix } from '../configuration/WorkConfiguration';
import { ResourceKey } from '../App/UsersResource';
import { GettingStarted } from '../components/GettingStarted';

export const EntryPointLink: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [domainName, setDomainName] = useState('');
    const dataProvider = useDataProvider();
    const identity = useUserIdentity();
    const dashboardUrl = `https://${domainName}.${domainSuffix}`;

    useEffect(() => {
        if (identity.isLoading) return;

        const fetchDomainName = async () => {
            try {
                const userData = await dataProvider.getOne<any>(ResourceKey, { id: identity.data.id } as any);
                setDomainName(userData.data.domainName);
            } finally {
                setLoading(false);
            }
        };

        fetchDomainName();
    }, [identity, dataProvider]);

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
        <Paper style={styles.paper}>
            {loading ? (
                <CircularProgress />
            ) : domainName ? (
                <div>
                    <Typography variant="h4" gutterBottom>
                        🌐 Your domain is set up! You can check your dashboard at:
                    </Typography>
                    <Box style={styles.domainBox}>
                        <Typography variant="h6" gutterBottom>
                            {dashboardUrl}
                        </Typography>
                    </Box>
                    <br />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            const newTab = window.open(dashboardUrl, '_blank');
                            if (newTab) {
                                newTab.focus();
                            }
                        }}
                    >
                        Visit Dashboard
                    </Button>
                </div>
            ) : (
                <GettingStarted />
            )}
        </Paper>
    );
};
