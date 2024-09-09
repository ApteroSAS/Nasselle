import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import nasselle_contract from '../contracts/nasselle_contract';
import ReserveButton from './ReserveButton.tsx';

// Define the provider type properly for clarity
type Provider = {
    provider_name: string;
    provider_url: string;
};

type ProviderListType = [string, Provider][]; // Array of tuple, where the first value is a string (ID), and the second is a Provider object

const ProviderList = () => {
    const [providers, setProviders] = useState<ProviderListType>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state

    // Fetch the list of providers when the component mounts
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true); // Start loading
                const response = await nasselle_contract.list_providers();
                console.log('list_providers ', response.result);
                // Explicitly type-check the result to avoid runtime issues
                if (response && Array.isArray(response.result)) {
                    const res: ProviderListType = response.result;
                    setProviders(res);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                console.error('Failed to fetch providers:', err);
                setError('Failed to load providers. Please try again later.');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchProviders();
    }, []);

    return (
        <div>
            <h1>Provider List</h1>
            {loading && <CircularProgress />} {/* Display loading indicator */}
            {error && <Alert severity="error">{error}</Alert>} {/* Display error message */}

            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Provider Name</TableCell>
                                <TableCell>Provider URL</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {providers.map(([id, provider]) => (
                                <TableRow key={id}>
                                    <TableCell>{provider.provider_name}</TableCell>
                                    <TableCell>
                                        <a href={provider.provider_url} target="_blank" rel="noopener noreferrer">
                                            {provider.provider_url}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <ReserveButton provider={provider} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default ProviderList;
