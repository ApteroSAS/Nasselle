import {useEffect, useState} from 'react';
import {
    Alert,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import ReserveButton from './ReserveButton.tsx';
import {TimerLoadingBar} from "./TimeLoaderComponent.tsx";
import {vnasAction} from "../service/VNASService.ts";
import type {Provider} from "./Provider.tsx";
import {listProviders, type ProviderListType} from "../service/listProviders.ts";

// Define the prop type for the component
type ProviderListProps = {
    onProvided: (provider: Provider, domain: string) => void;
};

const ProviderList: React.FC<ProviderListProps> = ({onProvided}) => {
    const [providers, setProviders] = useState<ProviderListType>(new Map());
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [loading2, setLoading2] = useState<boolean>(false); // Add loading state
    const [domain, setDomain] = useState<string>(''); // New state for domain input

    // Fetch the list of providers when the component mounts
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true); // Start loading
                setProviders(await listProviders());
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
                        style={{margin: '20px', width: '80%'}}
                        label="Here, Select a domain name that you like"
                        value={domain}
                        onChange={handleDomainChange}
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
                                {Array.from(providers.keys()).map((id) => {
                                    const provider = providers.get(id) as Provider;
                                    return <TableRow key={id}>
                                        <TableCell>{provider.provider_name}</TableCell>
                                        <TableCell>
                                            <a href={"https://" + provider.provider_url} target="_blank"
                                               rel="noopener noreferrer">
                                                {domain + "." + provider.provider_url}
                                            </a>
                                        </TableCell>
                                        <TableCell>{provider.ram || "8GB"}</TableCell> {/* Hardcoded RAM */}
                                        <TableCell>{provider.storage || "500GB"} </TableCell> {/* Hardcoded Storage */}
                                        <TableCell>{provider.cpu || "4"}</TableCell> {/* Hardcoded CPU */}
                                        <TableCell>{provider.price || "215 XML"}</TableCell> {/* Hardcoded CPU */}

                                        <TableCell>
                                            <ReserveButton disabled={!domain} price={215} name={domain}
                                                           provider={provider}
                                                           onProviderReserved={allocateProvider}/>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>)}
            </Paper>
        );
    }
};

export default ProviderList;
