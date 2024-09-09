import { useState } from 'react';
import { getAddress, kit, loadedPublicKey } from '../service/stellar-wallets-kit.ts';
import nasselle_contract from '../contracts/nasselle_contract';
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Alert,
    Container,
    Paper,
} from '@mui/material';

const RegisterProvider = () => {
    const [providerName, setProviderName] = useState<string>('');
    const [providerUrl, setProviderUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>('Register a Provider');
    const [error, setError] = useState<string | null>(null);

    const handleRegisterProvider = async () => {
        const publicKey = loadedPublicKey();
        const address = await getAddress();

        if (!publicKey) {
            alert('Please connect your wallet first');
            return;
        }

        nasselle_contract.options.publicKey = publicKey;
        setLoading(true);
        setCurrentValue('Processing...');

        try {
            const tx = await nasselle_contract.provide_instance({
                caller_address: address,
                provider_name: providerName,
                provider_url: providerUrl,
            });

            await tx.signAndSend({
                signTransaction: async (xdr: any) => {
                    const { signedTxXdr } = await kit.signTransaction(xdr);
                    return signedTxXdr;
                },
            });

            setCurrentValue('Provider registered successfully!');
        } catch (e) {
            console.error(e);
            setError('Failed to register provider');
            setCurrentValue('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Register a Provider
                    </Typography>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box sx={{ my: 2 }}>
                        <TextField
                            label="Provider Name"
                            variant="outlined"
                            fullWidth
                            value={providerName}
                            onChange={(e) => setProviderName(e.target.value)}
                            disabled={loading}
                            margin="normal"
                        />
                        <TextField
                            label="Provider URL"
                            type="url"
                            variant="outlined"
                            fullWidth
                            value={providerUrl}
                            onChange={(e) => setProviderUrl(e.target.value)}
                            disabled={loading}
                            margin="normal"
                        />
                    </Box>

                    <Box sx={{ my: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRegisterProvider}
                            disabled={loading || !providerName || !providerUrl}
                            fullWidth
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                'Register Provider'
                            )}
                        </Button>
                    </Box>

                    <Typography variant="body1" id="current-value">
                        {currentValue}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterProvider;
