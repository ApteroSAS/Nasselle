import {Box, Button, CircularProgress, Stack, Typography} from '@mui/material';
import {type ReactNode, useEffect, useState} from 'react';
import {NameManagement} from "../NameManagement";
import {useRefDomain} from "../meshRouter/UseRefDomain";
import {generateAvailableDomainName} from "@/components/DomainGenerator";
import {defaultDomain} from "@/configuration/MeshAppConfiguration";

interface OnboardingStepProps {
  onNext?: (dir?: boolean) => void;
  stepName: string;
  children?: ReactNode;
}

const DomainClaimStep = ({onNext = ()=>{}, stepName}: OnboardingStepProps) => {
  const domain = useRefDomain();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!domain.isLoading && !domain.domainName) {
        const initialDomainName = await generateAvailableDomainName();
        await domain.setDomainName(initialDomainName);
        await domain.setServerDomain(defaultDomain);
      }
      setLocalLoading(false);
    })();
  }, [domain.isLoading,domain.domainName]);

  if (localLoading || domain.isLoading || !domain.domainName) {
    return <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="10vh" // adjust height as needed
    >
      <CircularProgress/>
    </Box>
  }

  return (
    <Stack spacing={2} alignItems="center"> {/* Centering content */}
      <Typography variant="h5">{stepName}</Typography>
      <div style={{textAlign: 'center'}}>This is the domain address you will use to access the service</div>
      <NameManagement editMode={true} domain={domain}/>
      <Button disabled={!domain.domainName} variant="contained" onClick={() => onNext(true)}>Next</Button>
      <Button variant="text" onClick={() => onNext(false)}>Back</Button>
    </Stack>
  );
};

export default DomainClaimStep;
