import {Box, Typography} from "@mui/material";
import React from "react";
import {DockerSetup} from "../../components/DockerSetUp";
import {EntryPointLink} from "../../components/EntryPointLink";

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
            First, get your NAS and ensure that your NAS supports Docker, with Docker and Docker Compose installed. This
            is crucial for smooth running. NSL Router and Casa OS heavily rely on containers to work. You can install Docker
            Desktop by following the <a href="https://docs.docker.com/desktop/install/windows-install/">Docker Desktop installation guide</a> or
            install Docker Community Edition by following the <a href="https://docs.docker.com/engine/install/">Docker Community installation guide</a>.
        </Typography>
    </Box>
);

export const GettingStartedHWNas = () => {
    return (<>
        <Typography variant="h4" gutterBottom>
            Getting Started
        </Typography>
        <StepDockerInstall/>
        <Box style={styles.stepBox}>
            <Typography variant="h6" style={styles.stepTitle}>
                🐳 Setup NSL Router
            </Typography>
            <DockerSetup />
        </Box>
        <Box style={styles.stepBox}>
            <Typography variant="h6" style={styles.stepTitle}>
                🔑 Access Your NAS
            </Typography>
            <EntryPointLink editMode={true}/>
        </Box>
    </>);
}
