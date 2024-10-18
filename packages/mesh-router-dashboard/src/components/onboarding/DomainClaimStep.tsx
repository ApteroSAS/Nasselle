import {Box, Button, CircularProgress, Stack, Typography} from '@mui/material';
import React, { ReactNode } from 'react';
import { NameManagement } from "../NameManagement";
import { useRefDomain } from "../UseRefDomain";

interface OnboardingStepProps {
  onNext?: (dir?: boolean) => void;
  stepName: string;
  children?: ReactNode;
}

const DomainClaimStep = ({ onNext, stepName }: OnboardingStepProps) => {
  let domain = useRefDomain();

  if(domain.isLoading) {
    return <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="10vh" // adjust height as needed
    >
      <CircularProgress />
    </Box>
  }

  return (
    <Stack spacing={2} alignItems="center"> {/* Centering content */}
      <Typography variant="h5">{stepName}</Typography>
      <div style={{ textAlign: 'center' }}>This is the domain address you will use to access the service</div>
      <NameManagement editMode={true} />
      <Button disabled={!domain.domainName} variant="contained" onClick={() => onNext(true)}>Next</Button>
      <Button variant="text" onClick={() => onNext(false)}>Back</Button>
    </Stack>
  );
};

export default DomainClaimStep;
