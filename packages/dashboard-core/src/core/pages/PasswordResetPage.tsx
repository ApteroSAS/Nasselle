import {useState} from 'react';
import {Alert, Button, Container, Stack, TextField, Typography} from "@mui/material";
import {useConfigurationContext} from "../configuration/ConfigurationContext";
import {useAuthProvider} from "../component/useAuthProvider";

export const PasswordResetPage = () => {
  const { logo, title } = useConfigurationContext();
  const authProvider = useAuthProvider();

  // State to manage email input and feedback
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handlePasswordReset = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authProvider.sendResetPasswordMail(email);
      setSuccess('Password reset link has been sent to your email.');
    } catch (e) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        p: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 4 }}>
        <img src={logo} alt={title} width={50} />
        <Typography component="span" variant="h5">{title}</Typography>
      </Stack>

      <Container sx={{ p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white', maxWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Reset Your Password</Typography>

        {/* Email Input Field */}
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Feedback Message */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handlePasswordReset}
          disabled={loading || !email}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </Container>
    </Stack>
  );
};

PasswordResetPage.path = '/pw_reset';
