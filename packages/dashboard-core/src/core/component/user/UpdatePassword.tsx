import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField,} from '@mui/material';
import {Toolbar, useGetIdentity, useNotify} from 'react-admin';
import {useForm} from 'react-hook-form';
import {DialogCloseButton} from './DialogCloseButton';
import {useAuthProvider} from "../useAuthProvider";

const PASSWORD_POLICY = {
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Example policy: Minimum 8 characters, at least one letter and one number
    text: 'Password must be at least 8 characters long and contain at least one letter and one number.',
};

export const UpdatePassword = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        reset,
    } = useForm({
        mode: 'onChange',
    });
    const newPassword = watch('newPassword');
    const { identity } = useGetIdentity();
    const notify = useNotify();

    const authProvider = useAuthProvider();

    if (!identity) return null;

    const onSubmit = async (data: any) => {
        try {
            await authProvider.updatePassword(data.newPassword);
            notify('userManagement.profile.updated');
            setOpen(false);
            reset();
        }catch (error) {
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
            <DialogTitle>Change Password</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack gap={1}>
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
                            {...register('newPassword', {
                                required: 'New password is required',
                                pattern: {
                                    value: PASSWORD_POLICY.regex,
                                    message: PASSWORD_POLICY.text,
                                },
                            })}
                            margin="dense"
                            label="New Password"
                            type="password"
                            required
                            fullWidth
                            error={!!errors.newPassword}
                            helperText={
                                errors.newPassword ? PASSWORD_POLICY.text : ''
                            }
                        />
                        <TextField
                            {...register('confirmNewPassword', {
                                required: 'Please confirm your new password',
                                validate: value =>
                                    value === newPassword ||
                                    'Passwords do not match',
                            })}
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            required
                            fullWidth
                            error={!!errors.confirmNewPassword}
                            helperText={
                                errors.confirmNewPassword
                                    ? 'Passwords do not match'
                                    : ''
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
