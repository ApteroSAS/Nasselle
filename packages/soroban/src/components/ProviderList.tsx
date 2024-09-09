import {useState, useEffect} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    TextField
} from '@mui/material';
import nasselle_contract from '../contracts/nasselle_contract';
import ReserveButton from './ReserveButton.tsx';
import {TimerLoadingBar} from "./TimeLoaderComponent.tsx";
import {vnasAction} from "../service/VNASService.ts";

// Define the provider type properly for clarity
type Provider = {
    provider_name: string;
    provider_url: string;
};

type ProviderListType = [string, Provider][]; // Array of tuple, where the first value is a string (ID), and the second is a Provider object

// Define the prop type for the component
type ProviderListProps = {
    onProvided: (provider: Provider, domain: string) => void;
};

const ProviderList: React.FC<ProviderListProps> = ({onProvided}) => {
    const [providers, setProviders] = useState<ProviderListType>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [loading2, setLoading2] = useState<boolean>(false); // Add loading state
    const [domain, setDomain] = useState<string>(''); // New state for domain input

    // Fetch the list of providers when the component mounts
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true); // Start loading
                const response = await nasselle_contract.list_providers();
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

    const allocateProvider = async (provider: Provider) => {
        try {
            setLoading2(true); // Start loading
            await vnasAction("create"); // Create a V-NAS instance

            if (onProvided) {
                onProvided(provider, domain); // Pass the domain name along with the provider
            }
        } catch (err) {
            console.error('Failed to allocate provider:', err);
            setError('Failed to allocate provider. Please try again later.');
        } finally {
            setLoading2(false); // Stop loading
        }
    }

    const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDomain(e.target.value); // Update domain state when user types
    };

    if (loading2) {
        return <TimerLoadingBar/>;
    } else {
        return (
            <Paper>
                {loading && <CircularProgress/>} {/* Display loading indicator */}
                {error && <Alert severity="error">{error}</Alert>} {/* Display error message */}
                {!loading && !error && (<>
                    {/* Add a TextField for reserved domain name */}
                    <TextField
                        style={{margin: '20px'}}
                        label="Here, Select a domain name that you like"
                        value={domain}
                        onChange={handleDomainChange}
                        fullWidth
                        margin="normal"
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Provider Name</TableCell>
                                    <TableCell>Service URL</TableCell>
                                    <TableCell>RAM</TableCell>
                                    <TableCell>Storage</TableCell>
                                    <TableCell>CPU</TableCell>
                                    <TableCell>Price/Month</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {providers.map(([id, provider]) => (
                                    <TableRow key={id}>
                                        <TableCell>{provider.provider_name}</TableCell>
                                        <TableCell>
                                            <a href={"https://" + provider.provider_url} target="_blank"
                                               rel="noopener noreferrer">
                                                {domain + "." + provider.provider_url}
                                            </a>
                                        </TableCell>
                                        <TableCell>8GB</TableCell> {/* Hardcoded RAM */}
                                        <TableCell>500GB</TableCell> {/* Hardcoded Storage */}
                                        <TableCell>4</TableCell> {/* Hardcoded CPU */}
                                        <TableCell>215 XML</TableCell> {/* Hardcoded CPU */}

                                        <TableCell>
                                            <ReserveButton disabled={!domain} price={215} name={domain}
                                                           provider={provider}
                                                           onProviderReserved={allocateProvider}/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>)}
            </Paper>
        );
    }
};

export default ProviderList;
