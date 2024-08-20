import React, {useState} from "react";
import {Box, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {Code, ViewModule} from "@mui/icons-material";

const styles = {
  stepDescription: {
    color: '#555',
  } as React.CSSProperties
};


export const DockerSetup = () => {
  const [deploymentMethod, setDeploymentMethod] = useState('docker');

  const handleDeploymentMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: string | null
  ) => {
    if (newMethod !== null) {
      setDeploymentMethod(newMethod);
    }
  };

  return (<>
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
          Deploy the Nasselle container using Docker. Here is the command:
          <pre>
                        {`docker run -d -p 8080:8080 -v /path/to/data:/data nasselle/nasselle`}
                    </pre>
        </Typography>
      ) : (
        <Typography style={styles.stepDescription}>
          Deploy the Nasselle container using Docker Compose. Here is a sample `docker-compose.yml` file:
          <pre>
                        {`
version: '3'
services:
  nasselle:
    image: nasselle/nasselle
    ports:
      - "8080:8080"
    volumes:
      - /path/to/data:/data`}
                    </pre>
        </Typography>
      )}
  </>);
};