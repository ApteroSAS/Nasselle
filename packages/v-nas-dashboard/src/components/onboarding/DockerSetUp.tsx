import React, {useState} from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import {Code, ContentCopy, Refresh, Terminal, ViewModule, Window} from "@mui/icons-material";
import {useNotify} from "react-admin";
import {useUserIdentity} from "dashboard-core";
import {useProviderString} from "../meshRouter/UseProviderString";
import {useRefDomain} from "../meshRouter/UseRefDomain";
import {PrivateKeyDisplay} from "./PrivateKeyDisplay";

const styles = {
  stepDescription: {
    color: '#555',
  } as React.CSSProperties,
  preStyle: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    overflowX: 'auto',
    background: '#f4f4f4',
    padding: '10px',
    borderRadius: '4px',
  } as React.CSSProperties,
};

interface DockerSetupProps {
}

export const DockerSetup: React.FC<DockerSetupProps> = ({}) => {
  const [deploymentMethod, setDeploymentMethod] = useState('docker');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [osType, setOsType] = useState<'windows' | 'unix'>('windows'); // OS type toggle state
  const notify = useNotify();
  const [textInputPrivateKey, setTextInputPrivateKey] = useState('');
  const {data, isLoading, error} = useUserIdentity();
  const userid = data?.id;
  const {
    providerConfigString,
    regenerateKeyPair,
    publicKey,
    privateKeyTemp,
    setPrivateKeyTemp,
    signature,
    isLoading: isLoadingProvider,
  } = useProviderString();
  const domain = useRefDomain();

  // Toggle paths based on OS type
  const getDataPath = () => (osType === 'windows' ? '/c/DATA' : '/DATA');
  const getVolumeMapping = () => (osType === 'windows' ? 'C:\\DATA:/DATA' : '/DATA:/DATA');

  const dockerLineConfig = `docker network create nasselle && docker run -d --cap-add NET_ADMIN -e PROVIDER="${providerConfigString}" --network nasselle --name mesh-router-nsl.sh nasselle/mesh-router && docker run -d -e DATA_ROOT=${getDataPath()} -e REF_NET=nasselle -e REF_DOMAIN=${domain.refDomain} -v ${getVolumeMapping()} --network nasselle -v /var/run/docker.sock:/var/run/docker.sock --name casaos nasselle/casa-img`;

  const dockerComposeConfig = `
services:
  mesh-router:
    image: nasselle/mesh-router
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    environment:
      - PROVIDER=${providerConfigString}
    networks:
      - nasselle

  casaos:
    image: nasselle/casa-img
    restart: unless-stopped
    environment:
      - DATA_ROOT=${getDataPath()}
      - REF_NET=nasselle
      - REF_DOMAIN=${domain.refDomain}
    volumes:
      - ${getVolumeMapping()}
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - nasselle

networks:
  nasselle:
    driver: bridge
    name: nasselle
`;

  const handleDeploymentMethodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMethod: string | null
  ) => {
    if (newMethod !== null) {
      setDeploymentMethod(newMethod);
    }
  };

  const handleOsTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newOsType: 'windows' | 'unix' | null
  ) => {
    if (newOsType !== null) {
      setOsType(newOsType);
    }
  };

  const handleCopyToClipboard = async () => {
    let config: string;
    if (deploymentMethod === 'docker') {
      config = dockerLineConfig;
    } else {
      config = dockerComposeConfig;
    }

    await navigator.clipboard.writeText(config.trim());
    notify('Configuration copied to clipboard!');
  };

  if (isLoading || domain.isLoading || isLoadingProvider) return <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="10vh" // adjust height as needed
  >
    <CircularProgress/>
  </Box>;

  if (error) return <Typography>Error: {error.message}</Typography>;

  const regenerateKeyPairAction = async () => {
    if (!userid) return;
    setIsRegenerating(true);
    try {
      await regenerateKeyPair();
      notify('Key pair regenerated successfully!', {type: 'success'});
    } catch (error) {
      console.error("Failed to regenerate key pair:", error);
      notify('Failed to regenerate key pair', {type: 'error'});
    } finally {
      setIsRegenerating(false);
    }
  };

  if (publicKey && !signature) {
    return (
      <>
        <Typography style={styles.stepDescription}>
          You already have a public key. You can either set a private key for configuration or regenerate a new key
          pair:
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
          <TextField
            label="Set Private Key"
            value={textInputPrivateKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTextInputPrivateKey(e.target.value);
            }}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={() => setPrivateKeyTemp(textInputPrivateKey)}>
            Set Private Key
          </Button>
          <Button
            variant="contained"
            color="info"
            startIcon={<Refresh/>}
            onClick={regenerateKeyPairAction}
            disabled={isRegenerating}
          >
            {isRegenerating ? "Regenerating..." : "Regenerate Key Pair"}
          </Button>
        </Box>
        <br/><Divider/><br/>
      </>
    );
  }

  return (
    <>
      {privateKeyTemp && <PrivateKeyDisplay privateKey={privateKeyTemp}/>}
      <div>
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
        <ToggleButtonGroup
          value={osType}
          exclusive
          onChange={handleOsTypeChange}
          aria-label="OS type"
          style={{marginBottom: '1em'}}
        >
          <ToggleButton value="windows" aria-label="Windows">
            <Window/> Windows
          </ToggleButton>
          <ToggleButton value="unix" aria-label="Unix">
            <Terminal/> Unix
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {deploymentMethod === 'docker' ? (
        <Typography style={styles.stepDescription}>
          Deploy the NSL containers using Docker. Here are the commands:
          <Box style={styles.preStyle}>
            {dockerLineConfig}
          </Box>
        </Typography>
      ) : (
        <Typography style={styles.stepDescription}>
          Deploy the NSL container using Docker Compose. Here is a sample `docker-compose.yml` file:
          <Box style={styles.preStyle}>
            {dockerComposeConfig}
          </Box>
        </Typography>
      )}

      <Box
        display="flex"
        justifyContent="flex-start"
        gap={2}
        style={{marginTop: '10px'}}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ContentCopy/>}
          onClick={handleCopyToClipboard}
        >
          Copy Config
        </Button>

        {!signature && <Button
            variant="outlined"
            color="info"
            startIcon={<Refresh/>}
            onClick={regenerateKeyPairAction}
            disabled={isRegenerating}
        >
          {isRegenerating ? "Regenerating..." : "Regenerate Key Pair"}
        </Button>}
      </Box>
    </>
  );
};
