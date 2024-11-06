import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Button, Card, CardActions, CardContent, Container, Stack, Typography,} from '@mui/material';
import {useState} from 'react';
import {Form, Labeled, TextField, TextInput, useGetIdentity, useGetOne, useNotify, useUpdate,} from 'react-admin';
import {useFormState} from 'react-hook-form';
import {UpdatePassword} from '../component/user/UpdatePassword';
import ImageEditorField from '../component/user/ImageEditorField';
import {USER_STORAGE_KEY, USERS_RESOURCE} from "../UsersResource";
import {UpdateEmail} from "../component/user/UpdateEmail";
import {DeleteAccount} from "../component/user/DeleteAccount";
import {useAuthProvider} from "../component/useAuthProvider";

interface SettingsPageProps {
    onDeleteUser: (userId: string) => Promise<any>;
}

export const SettingsPage = ({ onDeleteUser }: SettingsPageProps) => {
    const [update] = useUpdate();
    const [isEditMode, setEditMode] = useState(false);
    const { identity, refetch } = useGetIdentity();
    const user = useGetOne(USERS_RESOURCE, { id: identity?.id });
    const notify = useNotify();
    const authProvider = useAuthProvider();
    if (!identity) return null;

    if(user.data) {
        user.data.email = authProvider.getEmail();
    }

    const handleOnSubmit = async (values: any) => {
        await update(
          USERS_RESOURCE,
          {
              id: identity.id,
              data: values
          },
          {
              onSuccess: data => {
                  localStorage.setItem(
                    USER_STORAGE_KEY,
                    JSON.stringify(data)
                  );
                  refetch();
                  setEditMode(false);
                  notify('userManagement.profile.updated');
              },
              onError: (error) => {
                  console.log('error', error);
                  notify('userManagement.profile.error', {
                      type: 'error',
                  });
              },
          }
        );
    };

    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Form onSubmit={handleOnSubmit} record={user.data}>
              <SettingsForm
                isEditMode={isEditMode}
                setEditMode={setEditMode}
                onDeleteUser={onDeleteUser}
              />
          </Form>
      </Container>
    );
};

interface SettingsFormProps {
    isEditMode: boolean;
    setEditMode: (value: boolean) => void;
    onDeleteUser: (userId: string) => Promise<void>;
}

const SettingsForm = ({
                          isEditMode,
                          setEditMode,
                          onDeleteUser,
                      }: SettingsFormProps) => {
    const [update] = useUpdate();
    const notify = useNotify();
    const { identity, refetch } = useGetIdentity();
    const { isDirty } = useFormState();
    const [openPasswordChange, setOpenPasswordChange] = useState(false);
    const [openEmailChange, setOpenEmailChange] = useState(false);
    const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

    if (!identity) return null;

    const handleAvatarUpdate = async (values: any) => {
        console.log('values', values);
        await update(
          USERS_RESOURCE,
          {
              id: identity.id,
              data: {avatar: values.avatar.src}
          },
          {
              onSuccess: data => {
                  localStorage.setItem(
                    USER_STORAGE_KEY,
                    JSON.stringify(data)
                  );
                  refetch();
                  setEditMode(false);
                  notify('userManagement.profile.updated');
              },
              onError: (error) => {
                  console.log('error', error);
                  notify('userManagement.profile.error', {
                      type: 'error',
                  });
              },
          }
        );
    };

    return (
      <Card>
          <CardContent>
              <Stack mb={2} direction="row" justifyContent="space-between">
                  <Typography variant="h5" color="textSecondary">
                      My info
                  </Typography>
              </Stack>
              <Stack gap={2} mb={2}>
                  <ImageEditorField
                    source="avatar"
                    type="avatar"
                    onSave={handleAvatarUpdate}
                    linkPosition="right"
                  />
                  <TextRender source="first_name" isEditMode={isEditMode} />
                  <TextRender source="last_name" isEditMode={isEditMode} />
              </Stack>
              {!isEditMode && (
                <>
                    <Button
                      variant="outlined"
                      onClick={()=> setOpenPasswordChange(true)}
                    >
                        Change password
                    </Button>
                    <UpdatePassword
                      open={openPasswordChange}
                      setOpen={setOpenPasswordChange}
                    />

                    &nbsp;

                    <Button
                      variant="outlined"
                      onClick={()=> setOpenEmailChange(true)}
                    >
                        Change email
                    </Button>
                    <UpdateEmail
                      open={openEmailChange}
                      setOpen={setOpenEmailChange}
                    />

                    &nbsp;

                    <Button
                      variant="contained"
                      color="error"
                      onClick={()=> setOpenDeleteAccount(true)}
                    >
                        Delete account
                    </Button>
                    <DeleteAccount
                      open={openDeleteAccount}
                      setOpen={setOpenDeleteAccount}
                      onDeleteUser={onDeleteUser}
                    />
                </>
              )}
          </CardContent>

          <CardActions
            sx={{
                paddingX: 2,
                background: theme => theme.palette.background.default,
                justifyContent: isEditMode ? 'space-between' : 'flex-end',
            }}
          >
              {isEditMode && (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isDirty}
                  hidden={isEditMode}
                >
                    Save
                </Button>
              )}
              <Button
                variant="text"
                size="small"
                startIcon={isEditMode ? <VisibilityIcon /> : <EditIcon />}
                onClick={() => setEditMode(!isEditMode)}
              >
                  {isEditMode ? 'Show' : 'Edit'}
              </Button>
          </CardActions>
      </Card>
    );
};

const TextRender = ({
                        source,
                        isEditMode,
                    }: {
    source: string;
    isEditMode: boolean;
}) => {
    if (isEditMode) {
        return <TextInput source={source} helperText={false} />;
    }
    return (
      <Labeled sx={{ mb: 0 }}>
          <TextField source={source} />
      </Labeled>
    );
};

SettingsPage.path = '/settings';