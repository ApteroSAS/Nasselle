import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Paper, Typography} from '@mui/material';
import {useDataProvider} from 'react-admin';
import {useUserIdentity} from '../../App/user/UserIdentity';
import {domainSuffix} from '../../configuration/WorkConfiguration';
import {ResourceKey} from '../../App/UsersResource';
import {GettingStarted} from '../../components/GettingStarted';
import {EntryPointLink} from "../../components/EntryPointLink";
import {PageContainer} from "../../components/WrapperElement";

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [domainName, setDomainName] = useState('');
    const dataProvider = useDataProvider();
    const identity = useUserIdentity();
    const dashboardUrl = `https://${domainName}.${domainSuffix}`;

    useEffect(() => {
        if (identity.isLoading) return;

        const fetchDomainName = async () => {
            try {
                const userData = await dataProvider.getOne<any>(ResourceKey, {id: identity.data.id} as any);
                setDomainName(userData.data.domainName);
            } finally {
                setLoading(false);
            }
        };

        fetchDomainName();
    }, [identity.isLoading]);

    return (
        <PageContainer>
                {loading ? <CircularProgress/> : domainName ? <EntryPointLink/> : <GettingStarted/>}
        </PageContainer>
    );
};
