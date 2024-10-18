import {Box, Typography} from "@mui/material";
import React from "react";
import {DockerSetup} from "../../components/onboarding/DockerSetUp";
import {EntryPointLink} from "../../components/EntryPointLink";
import {StepDockerInstall} from "../../components/onboarding/StepDockerInstall";
import Onboarding from "../../components/onboarding/Onboarding";
import SignUpStep from "../../components/onboarding/SignUpStep";
import OnboardingStep from "../../components/onboarding/OnboardingStep";
import DomainClaimStep from "../../components/onboarding/DomainClaimStep";

const styles = {
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

export const GettingStartedHWNas = () => {
  return (<>
    <Onboarding>
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
  </>);
}
