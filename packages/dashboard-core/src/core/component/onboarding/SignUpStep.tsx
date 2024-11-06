// SignUpStep.tsx
import {Box, Button, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useNotify} from 'react-admin';
import {useAuthProvider} from '../useAuthProvider';
import LoadingButton from '../LoadingButton';
import {useState} from 'react';

interface UserInput {
  email: string;
  password: string;
}

interface SignUpStepProps {
  onNext?: () => void;
  stepName?: string;
}

export const SignUpStep = ({ onNext = (() => {}) }: SignUpStepProps) => {

  const { register, handleSubmit, formState: { isValid } } = useForm<UserInput>({ mode: 'onChange' });
  const authProvider = useAuthProvider();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const handleNext = async (data: UserInput) => {
    console.log("Sign-up data:", data);
    setLoading(true);
    try {
      await authProvider.registerUser(data.email, data.password);
      console.log("User registered");

      await authProvider.login({ username: data.email, password: data.password });
      console.log("User logged in");

      try {
        console.log(await authProvider.getPermissions());
        if(!authProvider.getIdentity){
          throw new Error("getIdentity not implemented in authProvider");
        }
        console.log(await authProvider.getIdentity());
      } catch (error) {
        console.error("Error during getPermissions/getIdentity:", error);
      }

      onNext?.();
    } catch (error) {
      console.error("Error during sign-up:", error);
      notify(`Sign-up failed: ${error}`, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if(!authProvider || authProvider.loading) {
    return <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh" // adjust height as needed
      >
        <CircularProgress />
      </Box>
  }
  console.log("authProvider:", authProvider.getEmail());
  if (authProvider.getEmail()) {
    return <Stack spacing={2}>
        <Typography variant="h5">Already registered {authProvider.getEmail()}</Typography>
        <Button variant="contained" onClick={()=>onNext()}>Next</Button>
      </Stack>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create your account</Typography>
      <form onSubmit={handleSubmit(handleNext)}>
        <TextField
          {...register('email', {required: true})}
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
        />
        <br/>
        <br/>
        <TextField
          {...register('password', {required: true})}
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
        />
        <Stack direction="row" spacing={2} mt={2}>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            disabled={!isValid}
            fullWidth
          >
            Next
          </LoadingButton>
        </Stack>
      </form>
    </Stack>
  );
};
