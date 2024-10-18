import React from "react";
import { TextField, Box, Button, Typography } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";

const styles = {
  warningText: {
    color: 'red',           // Red color for warning text
    fontWeight: 'bold',     // Bold to make it more noticeable
  } as React.CSSProperties,
  textField: {
    backgroundColor: '#f9f9f9',
  } as React.CSSProperties,
};

interface PrivateKeyDisplayProps {
  privateKey: string;
}

export const PrivateKeyDisplay: React.FC<PrivateKeyDisplayProps> = ({ privateKey }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(privateKey);
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} alignItems="flex-start">
      <Typography style={styles.warningText}>
        Please save this private key securely:
      </Typography>
      <TextField
        value={privateKey}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        variant="outlined"
        style={styles.textField}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<ContentCopy />}
        onClick={handleCopy}
      >
        Copy Private Key
      </Button>
    </Box>
  );
};
