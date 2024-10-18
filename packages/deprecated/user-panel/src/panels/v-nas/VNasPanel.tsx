import React, {useEffect, useState} from 'react';
import {NameManagement} from '../../components/NameManagement';
import {KeyManagement} from '../../components/KeyManagement';
import {PageContainer} from "../../components/WrapperElement";
import {useDataProvider} from "react-admin";
import {useUserIdentity} from "../../App/user/UserIdentity";
import {ResourceKey} from "../../App/UsersResource";
import {CircularProgress} from "@mui/material";
import {EntryPointLink} from "../../components/EntryPointLink";
import {Intro} from "../../components/Intro";
import {GettingStartedHWNas} from "../hw-nas/GettingStartedHWNas";
import {GettingStartedVNas} from "./GettingStartedVNas";
import {VNasComponent} from "./VNasComponent";

export const VNasPanel = () => {
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
            {loading ? <CircularProgress/> : domainName ? <VNasComponent/> : <GettingStartedVNas/>}
        </PageContainer>
    );
};
