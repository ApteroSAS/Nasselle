import React from 'react';
import { Button, Typography } from '@mui/material';
import { NameManagement } from "./NameManagement";
import { useRefDomain } from "./UseRefDomain";

interface DockerSetupProps {
  editMode: boolean;
}

export const EntryPointLink: React.FC<DockerSetupProps> = ({ editMode }) => {
  const domain = useRefDomain();
  return (
    <>
      {domain.refDomain && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <NameManagement editMode={editMode} />
          {domain.domainName && (
            <>
              <Typography variant="h4" gutterBottom>
                🌐 Everything is ready! 🌐
              </Typography>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                style={{ marginTop: '20px', maxWidth: '300px' }} // Optional maxWidth to keep the button centered
                onClick={() => {
                  const newTab = window.open(`https://${domain.refDomain}`, '_blank');
                  if (newTab) {
                    newTab.focus();
                  }
                }}
              >
                Visit Dashboard
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
};
