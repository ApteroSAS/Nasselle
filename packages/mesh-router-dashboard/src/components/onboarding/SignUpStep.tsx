// SignUpStep.tsx
import {Box, Button, CircularProgress, Stack, TextField, Typography} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNotify } from 'react-admin';
import { useAuthProvider } from '../useAuthProvider';
import LoadingButton from '../LoadingButton';
import { useState } from 'react';
import {useUserIdentity} from "../../App/user/UserIdentity";

interface UserInput {
  email: string;
  password: string;
}

interface SignUpStepProps {
  onNext?: () => void;
  stepName?: string;
}

const SignUpStep = ({ onNext, stepName = 'Sign Up' }: SignUpStepProps) => {
  const { register, handleSubmit, formState: { isValid } } = useForm<UserInput>({ mode: 'onChange' });
  const authProvider = useAuthProvider();
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  let {data, isLoading} = useUserIdentity();

  const handleNext = async (data: UserInput) => {
    console.log("Sign-up data:", data);
    setLoading(true);
    try {
      await authProvider.registerUser(data.email, data.password);
      console.log("User registered");

      await authProvider.login({ username: data.email, password: data.password });
      console.log("User logged in");

      console.log(await authProvider.getPermissions());
      console.log(await authProvider.getIdentity());

      onNext?.();
    } catch (error) {
      console.error("Error during sign-up:", error);
      notify(`Sign-up failed: ${error}`, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  if(isLoading) {
    return <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="10vh" // adjust height as needed
      >
        <CircularProgress />
      </Box>
  }

  if (data) {
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
          {...register('email', { required: true })}
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          {...register('password', { required: true })}
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

export default SignUpStep;
