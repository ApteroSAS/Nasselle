import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Paper, Typography} from '@mui/material';
import {useDataProvider} from 'react-admin';
import {useUserIdentity} from '../../App/user/UserIdentity';
import {domainSuffix} from '../../configuration/WorkConfiguration';
import {ResourceKey} from '../../App/UsersResource';
import {GettingStartedHWNas} from '../hw-nas/GettingStartedHWNas';
import {EntryPointLink} from "../../components/EntryPointLink";
import {PageContainer} from "../../components/WrapperElement";
import {Intro} from "../../components/Intro";

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [domainName, setDomainName] = useState('');
    const dataProvider = useDataProvider();
    const identity = useUserIdentity();

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
                {loading ? <CircularProgress/> : domainName ? <EntryPointLink/> : <Intro/>}
        </PageContainer>
    );
};
