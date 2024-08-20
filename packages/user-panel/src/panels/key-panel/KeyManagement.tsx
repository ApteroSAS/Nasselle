import React, { useState, useEffect, FC } from 'react';
import { Button, Paper, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateKeyPair } from "./KeyPairGeneration";
import { ResourceKey } from '../../App/UsersResource';
import { useDataProvider, useNotify } from "react-admin";
import { useUserIdentity } from "../../App/user/UserIdentity";

export const KeyManagement: FC = () => {
  const { data, isLoading, error } = useUserIdentity();
  const userid = data?.id;
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const dataProvider = useDataProvider();
  const notify = useNotify();

  useEffect(() => {
    if (userid) {
      (async () => {
        try {
          const { data } = await dataProvider.getOne(ResourceKey, { id: userid });
          setPublicKey(data.pubkey);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      })();
    }
  }, [userid]);

  const handleGenerateKeyPair = async () => {
    try {
      const keys = await generateKeyPair();
      setPublicKey(keys.pub);
      setPrivateKey(keys.priv);
      await dataProvider.update(ResourceKey, { id: userid, data: { pubkey: keys.pub } } as any);
      notify('resources.api-management.notify.generateKeySuccess');
    } catch (error) {
      console.error('Key pair generation failed:', error);
      notify('resources.api-management.notify.generateKeyError', { type: 'error' });
    }
  };

  const handleSaveKeyPair = async () => {
    if (publicKey) {
      try {
        await dataProvider.update(ResourceKey, { id: userid, data: { pubkey: publicKey } } as any);
        notify('resources.api-management.notify.saveKeySuccess');
        setPrivateKey(''); // Clear private key after saving
      } catch (error) {
        notify('resources.api-management.notify.saveError', { type: 'error' });
        console.error('Save failed:', error);
      }
    } else {
      notify('resources.api-management.notify.generateFirstWarning', { type: 'warning' });
    }
  };

  const handleDeleteKeyPair = async () => {
    try {
      await dataProvider.update(ResourceKey, { id: userid, data: { pubkey: '' } } as any);
      setPublicKey('');
      setPrivateKey('');
      notify('resources.api-management.notify.deleteKeySuccess');
    } catch (error) {
      notify('resources.api-management.notify.deleteKeyError', { type: 'error' });
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return ( <Paper style={{ padding: '20px', marginBottom: '20px' }}>
    <Typography variant="h4" color="secondary">Key Pair Management</Typography>
    {publicKey ? (
      <>
        {privateKey && <>
            <Typography>Private Key:</Typography>
            <Typography style={{color:"red"}}>This will disapear as soon as you close the page. The private key are not stored</Typography>
            <TextField
                label="Private Key"
                variant="outlined"
                fullWidth
                value={privateKey}
                onChange={e => setPublicKey(e.target.value)}
                color="primary"
                style={{ marginBottom: '20px' }}
                disabled
            /></>}
        <Typography>Public Key:</Typography>
        <TextField
          label="Public Key"
          variant="outlined"
          fullWidth
          value={publicKey}
          onChange={e => setPublicKey(e.target.value)}
          color="primary"
          style={{ marginBottom: '20px' }}
          disabled
        />
        <Button
          startIcon={<DeleteIcon />}
          variant="contained"
          color="secondary"
          onClick={handleDeleteKeyPair}
          style={{ marginRight: '10px' }}
        >
          Delete Key Pair
        </Button>
      </>
    ) : (
      <>
        <Alert severity="info" style={{ marginBottom: '20px' }}>
          You don't have an active key pair. Generate a new key pair below.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateKeyPair}
          style={{ marginBottom: '20px' }}
        >
          Generate Key Pair
        </Button>
      </>
    )}
  </Paper>)
};
