import React, {useState, useEffect} from "react";
import {Box, ToggleButton, ToggleButtonGroup, Typography, Button} from "@mui/material";
import {Code, ViewModule, ContentCopy} from "@mui/icons-material";
import {useDataProvider, useNotify} from "react-admin";
import {useUserIdentity} from "../App/user/UserIdentity";
import {ResourceKey} from "../App/UsersResource";

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

export const DockerSetup = () => {
    const [deploymentMethod, setDeploymentMethod] = useState('docker');
    const [provider, setProvider] = useState("");
    const [refDomain, setRefDomain] = useState("");
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const {data, isLoading, error} = useUserIdentity();
    const userid = data?.id;

    useEffect(() => {
        const loadProviderDetails = async () => {
            if (userid) {
                try {
                    const response = await dataProvider.getOne(ResourceKey, {id: userid});
                    const {domainName, serverDomain} = response.data;
                    const privkey = (window as any).privkey;
                    setRefDomain(`${domainName}.${serverDomain}`);

                    setProvider(`https://${serverDomain},${userid},${privkey ? privkey : "<private key>"}`);
                } catch (error) {
                    console.error("Failed to fetch provider details:", error);
                    notify('Failed to fetch provider details', {type: 'error'});
                }
            }
        };

        loadProviderDetails();
    }, [userid]);

    const dockerLineConfig = `docker network create nasselle && docker run -d --cap-add NET_ADMIN -e PROVIDER="${provider}" --network nasselle --name mesh-router-nsl.sh nasselle/mesh-router && docker run -d -e DATA_ROOT=/c/DATA -e REF_NET=nasselle -e REF_DOMAIN=${refDomain} -v C:\\DATA:/DATA --network nasselle -v /var/run/docker.sock:/var/run/docker.sock --name casaos nasselle/casa-img`;
    const dockerComposeConfig = `
services:
  mesh-router:
    image: nasselle/mesh-router
    cap_add:
      - NET_ADMIN
    environment:
      - PROVIDER=${provider}
    networks:
      - nasselle

  casaos:
    image: nasselle/casa-img
    environment:
      - DATA_ROOT=/c/DATA
      - REF_NET=nasselle
      - REF_DOMAIN=${refDomain}
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
        let config = '';
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
                    Deploy the Nasselle container using Docker. Here are the commands:
                    <Box style={styles.preStyle}>
                        {dockerLineConfig}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ContentCopy/>}
                        onClick={handleCopyToClipboard}
                        style={{marginTop: '10px'}}
                    >
                        Copy Config
                    </Button>
                </Typography>
            ) : (
                <Typography style={styles.stepDescription}>
                    Deploy the Nasselle container using Docker Compose. Here is a sample `docker-compose.yml` file:
                    <Box style={styles.preStyle}>
                        {dockerComposeConfig}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ContentCopy/>}
                        onClick={handleCopyToClipboard}
                        style={{marginTop: '10px'}}
                    >
                        Copy Config
                    </Button>
                </Typography>
            )}
        </>
    );
};
