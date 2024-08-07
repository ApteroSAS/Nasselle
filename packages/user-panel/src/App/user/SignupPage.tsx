import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import {useAuthProvider, useCreate, useLogin, useNotify} from 'react-admin';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useConfigurationContext } from '../ConfigurationContext';
import {AuthProviderInterface} from "../../providers/AuthProviderInterface";
import {ResourceKey} from "../UsersResource";
import {useNavigate} from "react-router-dom";

interface UserInput {
    email: string;
    password: string;
}

export const SignupPage = () => {
    const { logo, title } = useConfigurationContext();
    const login = useLogin();
    const notify = useNotify();
    const [create] = useCreate();
    const authProvider = useAuthProvider<AuthProviderInterface>();
    let navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<UserInput>({
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<UserInput> = async data => {
        console.log('User created');
        let cred = await authProvider.registerUser(data.email, data.password);
        console.log(cred.user);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await login({
            email: data.email,
            password: data.password,
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await create(
          ResourceKey,{
              data: {
                  id:cred.user?.uid,
                  email: data.email,
              },
          }, // The first sale is an administrator
          {
              onSuccess: async () => {
                  setTimeout(() => {
                      navigate('/');
                      notify(
                        'Welcome! You can now start using the application.'
                      );
                  }, 500);
              },
              onError: () => {
                  notify('userManagement.profile.error');
              },
          }
        );
    };

    return (
        <Stack sx={{ height: '100dvh', p: 2 }}>
            <Stack direction="row" alignItems="center" gap={1}>
                <img src={logo} alt={title} width={50} />
                <Typography component="span" variant="h5">
                    {title}
                </Typography>
            </Stack>
            <Stack sx={{ height: '100%' }}>
                <Container
                    maxWidth="xs"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome!
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Create your account to start using the app.
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            {...register('email', { required: true })}
                            label="Email"
                            type="email"
                            variant="outlined"
                            helperText={false}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <TextField
                            {...register('password', { required: true })}
                            label="Password"
                            type="password"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={2}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isValid}
                            >
                                Create account
                            </Button>
                        </Stack>
                    </form>
                </Container>
            </Stack>
        </Stack>
    );
};

SignupPage.path = '/register';
