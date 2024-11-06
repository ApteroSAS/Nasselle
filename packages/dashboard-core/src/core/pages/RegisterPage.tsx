import {Onboarding} from "../component/onboarding/Onboarding";
import {SignUpStep} from "../component/onboarding/SignUpStep";
import {Container, Stack, Typography} from "@mui/material";
import {useConfigurationContext} from "../configuration/ConfigurationContext";

export const RegisterPage = ({ children }) => {  // Add children prop here
  const {logo, title} = useConfigurationContext();

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        p: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} sx={{mb: 4}}>
        <img src={logo} alt={title} width={50}/>
        <Typography component="span" variant="h5">{title}</Typography>
      </Stack>
      <Container sx={{p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white'}}>
        <Onboarding>
          <SignUpStep stepName={'Sign Up'}/>
          {children} {/* Render the children here */}
        </Onboarding>
      </Container>
    </Stack>
  );
};

RegisterPage.path = '/register';