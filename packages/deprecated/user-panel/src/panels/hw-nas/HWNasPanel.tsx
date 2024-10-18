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
import {GettingStartedHWNas} from "./GettingStartedHWNas";

export const HWNasPanel = () => {

    return (
        <PageContainer>
            <GettingStartedHWNas/>
        </PageContainer>
    );
};
