import {OnboardingStep, RegisterPage} from "dashboard-core";
import {StepDockerInstall} from "@/components/onboarding/StepDockerInstall";
import {DockerSetup} from "@/components/onboarding/DockerSetUp";
import {EntryPointLink} from "@/components/EntryPointLink";
import DomainClaimStep from "@/components/onboarding/DomainClaimStep";
import {Typography} from "@mui/material";


export const MeshRegisterPage = () => {
  return (<RegisterPage>
    <OnboardingStep stepName={'Docker install'} backButton={false}>
      <StepDockerInstall/>
    </OnboardingStep>
    <DomainClaimStep stepName={'Domain Claim'}/>
    <OnboardingStep stepName={'Docker setup'}>
      <DockerSetup/>
    </OnboardingStep>
    <OnboardingStep stepName={'Dashboard'} nextButton={false}>
      <Typography variant="h6" align="center" fontWeight="bold">
        Ensure your docker setup is up and running.
      </Typography>
      <EntryPointLink editMode={false}/>
    </OnboardingStep>
  </RegisterPage>);
};