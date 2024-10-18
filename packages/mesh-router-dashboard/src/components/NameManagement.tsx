import React, {useState, useEffect, FC} from 'react';
import {TextField, Button, Paper, Typography, IconButton} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import {useDataProvider, useNotify} from 'react-admin';
import {useUserIdentity} from "../App/user/UserIdentity";
import {useRefDomain} from "./UseRefDomain";

interface NameManagementProps {
  editMode: boolean;
}

export const NameManagement: FC<NameManagementProps> = ({editMode}) => {
  const domain = useRefDomain();
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to control editing mode
  const notify = useNotify();
  const {data, isLoading, error} = useUserIdentity();
  const userid = data?.id;
  const [tmpName, setTmpName] = useState("");

  useEffect(() => {
    if (domain.isLoading || !domain) return;
    console.log('domain:', domain);
    setIsEditing(!domain.domainName);
    setTmpName(domain.domainName);
  }, [domain.isLoading,domain.domainName]);

  const handleSaveName = async () => {
    if (userid) {
      try {
        await domain.setDomainName(tmpName);
        //notify('resources.api-management.notify.saveNameSuccess');
        notify('Name saved successfully', {type: 'success'});
      } catch (error) {
        console.error('Failed to save name:', error);
        notify('resources.api-management.notify.saveError', {type: 'error'});
      }
      setIsEditing(false); // Disable editing after saving
    } else {
      notify('resources.api-management.notify.fillFields', {type: 'warning'});
    }
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpName(e.target.value);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (<>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
        {isEditing ? (
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={tmpName}
            onChange={handleNameChange}
            color="primary"
          />
        ) : (
          <Typography variant="h5" style={{fontSize: "2em"}}>{domain.domainName}.{domain.serverDomain}</Typography>
        )}
        {editMode && <IconButton
            color="primary"
            onClick={handleEditClick}
            style={{marginLeft: '10px'}} // Add some spacing between the text and the button
        >
            <EditIcon/>
        </IconButton>}
      </div>

      {isEditing && (
        <Button
          startIcon={<SaveIcon/>}
          fullWidth
          variant="contained"
          color="success"
          onClick={handleSaveName}
        >
          Claim {`${tmpName}.${domain.serverDomain}`}
        </Button>
      )}
    </>
  );
};