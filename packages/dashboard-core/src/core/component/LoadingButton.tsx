// LoadingButton.tsx
import {Button, type ButtonProps, CircularProgress} from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

const LoadingButton = ({ loading, children, disabled, ...props }: LoadingButtonProps) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : null}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

export default LoadingButton;
