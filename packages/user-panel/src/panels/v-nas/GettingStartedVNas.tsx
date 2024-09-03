import {Box, Button, Paper, Typography} from "@mui/material";
import React from "react";
import {DockerSetup} from "../../components/DockerSetUp";
import {NameManagement} from "../../components/NameManagement";
import {KeyManagement} from "../../components/KeyManagement";
import {EntryPointLink} from "../../components/EntryPointLink";
import {VNasComponent} from "./VNasComponent";

const styles = {
    stepBox: {
        marginBottom: '1.5em',
        padding: '1em',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
    } as React.CSSProperties,
    stepTitle: {
        fontWeight: 'bold',
        marginBottom: '0.5em',
    } as React.CSSProperties,
    stepDescription: {
        color: '#555',
    } as React.CSSProperties,
    domainBox: {
        padding: '1em',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        marginTop: '1em',
        textAlign: 'center'
    } as React.CSSProperties,
};

export const GettingStartedVNas = () => {
    return (<>
        <Typography variant="h4" gutterBottom>
            Getting Started to create a V-NAS
        </Typography>
        <div style={{textAlign: 'center'}}>
            V-NAS (Virtual Network-Attached Storage) is a cloud-based service that provides NAS capabilities without
            the
            need for physical hardware. It allows users to securely access, store, and manage their data over the
            internet with enhanced features like VPN support, your own domain, and robust security protocols such as
            TLS
            and DDoS protection.
        </div>
        <VNasComponent/>
    </>);
}
