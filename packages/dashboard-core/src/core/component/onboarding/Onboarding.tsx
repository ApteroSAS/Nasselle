// Onboarding.tsx
import {cloneElement, type ReactElement, type ReactNode, useState} from 'react';
import {Box, Step, StepLabel, Stepper, Typography} from '@mui/material';

interface OnboardingProps {
  children: ReactNode[];
}

export const Onboarding = ({children}: OnboardingProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (direction: boolean = true) => setActiveStep(prev => prev + (direction ? 1 : -1));
  const steps = children.map(child => (child as ReactElement).props?.stepName);

  return (<>
      <Typography variant="h4" align="center" gutterBottom>Getting Started</Typography>
      <Stepper activeStep={activeStep} sx={{mb: 4}}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{mb: 2}}>
        {/* Pass handleNext as the onNext prop */}
        {cloneElement(children[activeStep] as ReactElement, {onNext: handleNext})}
      </Box>
    </>
  );
};
