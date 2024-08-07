import React, { useEffect, useState } from 'react';
import { useUserIdentity } from '../../App/user/UserIdentity';
import { useDataProvider, useNotify } from 'react-admin';
import { ResourceKey } from "../../App/UsersResource";
import { Button, TextField, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';

export const KeyPanel = () => {
    const { data, isLoading, error } = useUserIdentity();
    const userid = data?.id;
    const [publicKey, setPublicKey] = useState('');
    const [name, setName] = useState('');
    let notify = useNotify();
    const dataProvider = useDataProvider();

    useEffect(() => {
        if (userid) {
            (async () => {
                try {
                    const { data } = await dataProvider.getOne(ResourceKey, { id: userid });
                    setName(data.domainName);
                    setPublicKey(data.pubkey);
                } catch (error) {
                    console.error('Failed to fetch data:', error);
                }
            })();
        }
    }, [userid]);

    const handleSave = async () => {
        if (name && publicKey) {
            try {
                let previousData = await dataProvider.getOne<any>(ResourceKey, { id:userid} as any);
                await dataProvider.update<any>(ResourceKey,
                  {
                      id:userid,
                      data:{ pubkey: publicKey, domainName:name},
                      previousData: previousData.data
                  });
                notify('resources.api-management.notify.saveSuccess');
            } catch (error) {
                notify('resources.api-management.notify.saveError');
                console.error('Save failed:', error);
            }
        } else {
            notify('resources.api-management.notify.fillFields');
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading data!</Alert>;

    return (
      <Paper style={{
          padding: '20px',
          margin: 'auto',
          maxWidth: 700,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
      }}>
          <Typography variant="h4" color="secondary"><EmojiFlagsIcon /> API Access Panel</Typography>
          <Typography>This panel allows you to claim a name by registering your public key.</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            color="primary"
          />
          <TextField
            label="Public Key"
            variant="outlined"
            fullWidth
            value={publicKey}
            onChange={e => setPublicKey(e.target.value)}
            color="primary"
          />
          <Button
            startIcon={<SaveIcon />}
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
              Save
          </Button>
          <Button variant="contained" color="secondary">Open App</Button>
      </Paper>
    );
};
