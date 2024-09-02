import React, { useState, useEffect, FC } from 'react';
import { TextField, Button, Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import { useDataProvider, useNotify } from 'react-admin';
import { ResourceKey } from "../App/UsersResource";
import { useUserIdentity } from "../App/user/UserIdentity";
import {domainsSuffix} from "../configuration/WorkConfiguration";

export const NameManagement: FC = () => {
  const [name, setName] = useState('');
  const [serverDomain, setServerDomain] = useState('');
  const [needSave, setNeedSave] = useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { data, isLoading, error } = useUserIdentity();
  const userid = data?.id;

  useEffect(() => {
    if (userid) {
      (async () => {
        try {
          const { data } = await dataProvider.getOne(ResourceKey, { id: userid });
          setName(data.domainName);
          setServerDomain(data.serverDomain);
        } catch (error) {
          console.error('Failed to fetch data:', error);
          notify('resources.api-management.notify.fetchError', { type: 'error' });
        }
      })();
    }
  }, [userid]);

  const handleSaveName = async () => {
    if (userid && name && serverDomain) {
      try {
        await dataProvider.update(ResourceKey, {
          id: userid,
          data: { domainName: name, serverDomain }
        } as any);
        notify('resources.api-management.notify.saveNameSuccess');
      } catch (error) {
        console.error('Failed to save name:', error);
        notify('resources.api-management.notify.saveError', { type: 'error' });
      }
      setNeedSave(false);
    } else {
      notify('resources.api-management.notify.fillFields', { type: 'warning' });
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Paper style={{ padding: '20px', marginBottom: '20px' }}>
      <Typography variant="h4" color="secondary"><EmojiFlagsIcon /> Claim Name</Typography>
      <Typography>Here you can claim the domain name that you will use to connect to your NAS or V-NAS</Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={e => {
          setName(e.target.value)
            setNeedSave(true)
        }}
        color="primary"
        style={{ marginBottom: '20px' }}
      />
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel id="server-domain-label">Server Domain</InputLabel>
        <Select
          labelId="server-domain-label"
          value={serverDomain}
          label="Server Domain"
          onChange={e => {
            setServerDomain(e.target.value)
            setNeedSave(true)
          }}
        >
          {domainsSuffix.map((domain) => (
            <MenuItem key={domain} value={domain}>
              {domain}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {needSave && <Button
        startIcon={<SaveIcon />}
        fullWidth
        variant="contained"
        color="success"
        onClick={handleSaveName}
      >
        Claim {`${name}.${serverDomain}`}
      </Button>}
    </Paper>
  );
};
