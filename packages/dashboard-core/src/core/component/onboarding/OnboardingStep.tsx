// ExampleStep.tsx
import {Button, Stack, Typography} from '@mui/material';
import type {ReactNode} from 'react';

interface OnboardingStepProps {
  onNext?: (dir?:boolean) => void;
  stepName: string;
  backButton?: boolean;
  nextButton?: boolean;
  children?: ReactNode;
}

export const OnboardingStep = ({ onNext = () => {}, stepName, children , backButton=true,nextButton=true}: OnboardingStepProps) => {

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{stepName}</Typography>
      {children}
      {nextButton && <Button variant="contained" onClick={()=>onNext(true)}>Next</Button>}
      {backButton && <Button variant="text" onClick={()=>onNext(false)}>Back</Button>}
    </Stack>
  );
};
