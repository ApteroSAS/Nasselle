// src/components/user/DeleteAccount.tsx

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useGetIdentity, useLogout, useNotify} from 'react-admin';
import {DialogCloseButton} from './DialogCloseButton';
import {useAuthProvider} from "../useAuthProvider";

interface DeleteAccountProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onDeleteUser: (userId: string) => Promise<any>;
}

export const DeleteAccount = ({ open, setOpen, onDeleteUser }: DeleteAccountProps) => {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: 'onChange',
  });
  const authProvider = useAuthProvider();
  const identity = useGetIdentity();
  const notify = useNotify();
  const logout = useLogout();

  const onSubmit = async (data: any) => {
    try {
      const uid = ""+identity.identity?.id;
      console.log(`Deleting account ${uid}`);
      await onDeleteUser(uid); //first because you must be authorized to do that
      await authProvider.deleteAccount(data.currentPassword);
      notify('Account successfully deleted.', { type: 'info' });
      reset();
      setOpen(false);
      logout();
    } catch (e) {
      notify('Failed to delete account. Please try again.', { type: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogCloseButton onClose={handleClose} />
      <DialogTitle>Delete Account</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
            Please enter your current password to confirm.
          </DialogContentText>
          <Stack gap={2} mt={2}>
            <TextField
              {...register('currentPassword', {
                required: 'Current password is required',
              })}
              required
              type="password"
              label="Current Password"
              fullWidth
              error={!!errors.currentPassword}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="error" variant="contained" disabled={!isValid}>
            Delete
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};