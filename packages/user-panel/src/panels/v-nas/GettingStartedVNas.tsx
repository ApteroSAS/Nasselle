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

const StepDockerInstall = () => (
    <Box style={styles.stepBox}>
        <Typography variant="h6" style={styles.stepTitle}>
            🐳 Docker
        </Typography>
        <Typography style={styles.stepDescription}>
            First, find a NAS and ensure that your NAS supports Docker, with Docker and Docker Compose installed. This
            is crucial for smooth running. Nasselle and Casa OS heavily rely on containers to work.
        </Typography>
    </Box>
);

const StepNameClaim = () => (
    <Box style={styles.stepBox}>
        <Typography variant="h6" style={styles.stepTitle}>
            🌐 Claim a Name
        </Typography>
        <Typography style={styles.stepDescription}>
            Register to claim your exclusive subdomain <b>name.domain</b>. This will be your gateway to
            accessing
            and managing your NAS online.
        </Typography>
        <NameManagement/>
    </Box>
);

const StepAPISetup = () => (
    <Box style={styles.stepBox}>
        <Typography variant="h6" style={styles.stepTitle}>
            🐳 create API token
        </Typography>
        <KeyManagement/>
    </Box>
);

const StepDockerSetup = () => (
    <Box style={styles.stepBox}>
        <Typography variant="h6" style={styles.stepTitle}>
            🐳 Setup Nasselle
        </Typography>
        <DockerSetup/>
    </Box>
);

const StepAccess = () => (
    <Box style={styles.stepBox}>
        <Typography variant="h6" style={styles.stepTitle}>
            🔑 Access Your NAS
        </Typography>
        <EntryPointLink/>
    </Box>
);

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
