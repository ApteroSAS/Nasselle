import React, { useState} from "react";
import {Box, Button, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {Code, ContentCopy, Refresh, ViewModule} from "@mui/icons-material"; // Added Refresh icon
import {useNotify} from "react-admin";
import {useUserIdentity} from "../App/user/UserIdentity";
import {useProviderString} from "./UseProviderString";
import {useRefDomain} from "./UseRefDomain";

const styles = {
    stepDescription: {
        color: '#555',
    } as React.CSSProperties,
    preStyle: {
        whiteSpace: 'pre-wrap',  // Enables word wrap
        wordWrap: 'break-word',  // Breaks long words to fit into the container
        overflowX: 'auto',       // Adds a horizontal scrollbar if needed
        background: '#f4f4f4',
        padding: '10px',
        borderRadius: '4px',
    } as React.CSSProperties,
};

interface DockerSetupProps {
}

export const DockerSetup: React.FC<DockerSetupProps> = ({ }) => {
    const [deploymentMethod, setDeploymentMethod] = useState('docker');
    const [isRegenerating, setIsRegenerating] = useState(false); // Added state for regenerating process
    const notify = useNotify();
    const {data, isLoading, error} = useUserIdentity();
    const userid = data?.id;
    const provider = useProviderString();
    const domain = useRefDomain();

    const dockerLineConfig = `docker network create nasselle && docker run -d --cap-add NET_ADMIN -e PROVIDER="${provider.str}" --network nasselle --name mesh-router-nsl.sh nasselle/mesh-router && docker run -d -e DATA_ROOT=/c/DATA -e REF_NET=nasselle -e REF_DOMAIN=${domain.refDomain} -v C:\\DATA:/DATA --network nasselle -v /var/run/docker.sock:/var/run/docker.sock --name casaos nasselle/casa-img`;
    const dockerComposeConfig = `
services:
  mesh-router:
    image: nasselle/mesh-router
    cap_add:
      - NET_ADMIN
    environment:
      - PROVIDER=${provider.str}
    networks:
      - nasselle

  casaos:
    image: nasselle/casa-img
    environment:
      - DATA_ROOT=/c/DATA
      - REF_NET=nasselle
      - REF_DOMAIN=${domain.refDomain}
    volumes:
      - C:\\DATA:/DATA
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - nasselle

networks:
  nasselle:
    driver: bridge
    name: nasselle
`;

    const handleDeploymentMethodChange = (
        event: React.MouseEvent<HTMLElement>,
        newMethod: string | null
    ) => {
        if (newMethod !== null) {
            setDeploymentMethod(newMethod);
        }
    };

    const handleCopyToClipboard = () => {
        let config;
        if (deploymentMethod === 'docker') {
            config = dockerLineConfig;
        } else {
            config = dockerComposeConfig;
        }

        navigator.clipboard.writeText(config.trim());
        notify('Configuration copied to clipboard!');
    };

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error: {error.message}</Typography>;

    const regenerateKeyPair = async () => {
        if (!userid) return;
        setIsRegenerating(true); // Indicate the regeneration process has started
        try {
            await provider.regenerateKeyPair();
            notify('Key pair regenerated successfully!', {type: 'success'});
        } catch (error) {
            console.error("Failed to regenerate key pair:", error);
            notify('Failed to regenerate key pair', {type: 'error'});
        } finally {
            setIsRegenerating(false); // Reset regenerating state
        }
    };

    return (
        <>
            <ToggleButtonGroup
                value={deploymentMethod}
                exclusive
                onChange={handleDeploymentMethodChange}
                aria-label="deployment method"
                style={{marginBottom: '1em'}}
            >
                <ToggleButton value="docker" aria-label="docker">
                    <Code/> Docker
                </ToggleButton>
                <ToggleButton value="docker-compose" aria-label="docker compose">
                    <ViewModule/> Docker Compose
                </ToggleButton>
            </ToggleButtonGroup>

            {deploymentMethod === 'docker' ? (
                <Typography style={styles.stepDescription}>
                    Deploy the NSL containers using Docker. Here are the commands:
                    <Box style={styles.preStyle}>
                        {dockerLineConfig}
                    </Box>
                </Typography>
            ) : (
                <Typography style={styles.stepDescription}>
                    Deploy the Nasselle container using Docker Compose. Here is a sample `docker-compose.yml` file:
                    <Box style={styles.preStyle}>
                        {dockerComposeConfig}
                    </Box>
                </Typography>
            )}

            {/* Wrap the buttons in a Box to position them in a row */}
            <Box
                display="flex"
                justifyContent="flex-start"  // Aligns buttons to the left with space between them
                gap={2}  // Adds some space between the buttons
                style={{marginTop: '10px'}}  // Add margin to the top
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyToClipboard}
                >
                    Copy Config
                </Button>

                {provider.signature=="<SIGNATURE>" && <Button
                    variant="outlined"
                    color="info"
                    startIcon={<Refresh />} // Refresh icon for the regenerate button
                    onClick={regenerateKeyPair}
                    disabled={isRegenerating} // Disable button while regenerating
                >
                    {isRegenerating ? "Regenerating..." : "Regenerate Key Pair"}
                </Button>}
            </Box>
        </>
    );
};
