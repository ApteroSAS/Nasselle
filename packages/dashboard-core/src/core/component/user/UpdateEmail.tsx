import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField,} from '@mui/material';
import {Toolbar, useGetIdentity, useNotify} from 'react-admin';
import {useForm} from 'react-hook-form';
import {DialogCloseButton} from './DialogCloseButton';
import {useAuthProvider} from "../useAuthProvider";

const EMAIL_POLICY = {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    text: 'Email must be valid'
};

export const UpdateEmail = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        mode: 'onChange',
    });
    const { identity } = useGetIdentity();
    const notify = useNotify();

    const authProvider = useAuthProvider();

    if (!identity) return null;

    const onSubmit = async (data: any) => {
        try {
            await authProvider.updateEmail(data.newEmail,data.currentPassword);
            notify('userManagement.profile.updated');
            setOpen(false);
            reset();
        } catch (error) {
            notify('userManagement.profile.error', {
                type: 'error',
            });
        }
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogCloseButton onClose={handleClose} />
            <DialogTitle>Change Email</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack gap={1}>
                        Current email: {authProvider.getEmail()}
                        <TextField
                            {...register('currentPassword', {
                                required: 'Current password is required',
                            })}
                            required
                            autoFocus
                            margin="dense"
                            label="Current Password"
                            type="password"
                            fullWidth
                            error={!!errors.currentPassword}
                            helperText={
                                errors.currentPassword
                                    ? 'Current password is required'
                                    : ''
                            }
                        />

                        <TextField
                          {...register('newEmail', {})}
                          margin="dense"
                          label="New email"
                          type="text"
                          required
                          fullWidth
                          error={!!errors.newPassword}
                          helperText={
                              errors.newPassword ? EMAIL_POLICY.text : ''
                          }
                        />
                    </Stack>
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'flex-start',
                        p: 0,
                    }}
                >
                    <Toolbar
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!isValid}
                        >
                            Update
                        </Button>
                    </Toolbar>
                </DialogActions>
            </form>
        </Dialog>
    );
};
