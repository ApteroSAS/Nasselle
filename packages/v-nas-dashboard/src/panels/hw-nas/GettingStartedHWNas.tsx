import {DockerSetup} from "@/components/onboarding/DockerSetUp";
import {EntryPointLink} from "@/components/EntryPointLink";
import {StepDockerInstall} from "@/components/onboarding/StepDockerInstall";
import {Onboarding, OnboardingStep} from "dashboard-core";
import DomainClaimStep from "@/components/onboarding/DomainClaimStep";

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
