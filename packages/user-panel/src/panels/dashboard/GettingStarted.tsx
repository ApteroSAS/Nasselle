import {Box, Button, Paper, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Code, ViewModule} from "@mui/icons-material";

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '1em'
  } as React.CSSProperties,
  paper: {
    padding: '2em',
    maxWidth: '800px',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px'
  } as React.CSSProperties,
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

const Step1 = () => (
  <Box style={styles.stepBox}>
    <Typography variant="h6" style={styles.stepTitle}>
      🐳 Step 1: Docker on NAS
    </Typography>
    <Typography style={styles.stepDescription}>
      First, find a NAS and ensure that your NAS supports Docker, with Docker and Docker Compose installed. This is
      crucial for smooth running. Nasselle and Casa OS heavily rely on containers to work.
    </Typography>
  </Box>
);
const Step2 = () => {
  const [deploymentMethod, setDeploymentMethod] = useState('docker');

  const handleDeploymentMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: string | null
  ) => {
    if (newMethod !== null) {
      setDeploymentMethod(newMethod);
    }
  };

  return (
    <Box style={styles.stepBox}>
      <Typography variant="h6" style={styles.stepTitle}>
        🚀 Step 2: Start the Nasselle Container
      </Typography>
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
                        {`version: '3'
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
    </Box>
  );
};
const Step3 = () => (
  <Box style={styles.stepBox}>
    <Typography variant="h6" style={styles.stepTitle}>
      🔑 Step 3: Access Your NAS
    </Typography>
    <Typography style={styles.stepDescription}>
      execute this command to get the public and private keys:
      <pre>
                {`docker exec -d -p 8080:8080 -v /path/to/data:/data nasselle/nasselle`}
            </pre>
      Log in to your NAS at your custom subdomain <b>key.nasselle.com</b> and start managing your data securely and
      efficiently.
    </Typography>
  </Box>
);
const Step4 = () => {
  const navigate = useNavigate();
  return <Box style={styles.stepBox}>
    <Typography variant="h6" style={styles.stepTitle}>
      🌐 Step 4: Claim a Name
    </Typography>
    <Typography style={styles.stepDescription}>
      Register to claim your exclusive subdomain <b>username.nasselle.com</b>. This will be your gateway to accessing
      and managing your NAS online.
    </Typography>
    <Button onClick={() => {
      navigate('/api-management');
    }}>Setup Domain Name</Button>
  </Box>
};
export const GettingStarted = () => {
  return (
    <div style={styles.container}>
      <Paper style={styles.paper}>
        <Typography variant="h4" gutterBottom>
          Getting Started
        </Typography>
        <Step1/>
        <Step2/>
        <Step3/>
        <Step4/>
      </Paper>
    </div>
  );
}