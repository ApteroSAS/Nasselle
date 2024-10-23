import Onboarding from "../../components/onboarding/Onboarding";
import SignUpStep from "../../components/onboarding/SignUpStep";
import OnboardingStep from "../../components/onboarding/OnboardingStep";
import {StepDockerInstall} from "../../components/onboarding/StepDockerInstall";
import {DockerSetup} from "../../components/onboarding/DockerSetUp";
import {EntryPointLink} from "../../components/EntryPointLink";
import React from "react";
import DomainClaimStep from "../../components/onboarding/DomainClaimStep";
import {Container, Stack, Typography} from "@mui/material";
import {useConfigurationContext} from "../ConfigurationContext";


export const RegisterPage = () => {
  const {logo, title} = useConfigurationContext();
  return (
    <Stack
      sx={{minHeight: '100vh', p: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5'}}>
      <Stack direction="row" alignItems="center" gap={1} sx={{mb: 4}}>
        <img src={logo} alt={title} width={50}/>
        <Typography component="span" variant="h5">{title}</Typography>
      </Stack>
      <Container sx={{p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white'}}>
        <Onboarding>
          <SignUpStep stepName={'Sign Up'}/>
          <OnboardingStep stepName={'Docker install'} backButton={false}>
            <StepDockerInstall/>
          </OnboardingStep>
          <DomainClaimStep stepName={'Domain Claim'}/>
          <OnboardingStep stepName={'Docker setup'}>
            <DockerSetup/>
          </OnboardingStep>
          <OnboardingStep stepName={'Dashboard'} nextButton={false}>
            <EntryPointLink editMode={false}/>
          </OnboardingStep>
        </Onboarding>
      </Container>
    </Stack>);
};

RegisterPage.path = '/register';
