import {ComponentType, Suspense, useEffect, useState} from 'react';
import {Box, CircularProgress} from "@mui/material";
import {loadBackendConfiguration} from "./configuration/BackendConfigurationLoader";
import type {AuthProviderInterface} from "../providers/interface/AuthProviderInterface";
import {DataProvider} from "react-admin";

interface AppLoaderProps {
  AppComponent: ComponentType<{
    authProvider:AuthProviderInterface;
    dataProvider:DataProvider;
  }>;  // Type for the App component prop
  providers: () => Promise<{
    authProvider:AuthProviderInterface;
    dataProvider:DataProvider;
  }>;  // Function to load providers
  LoadingComponent?: ComponentType;  // Optional custom loading component
}

export function AppLoader({
                                    AppComponent,
                                    LoadingComponent,
                                    providers,
                                  }: AppLoaderProps) {
  const [isFirebaseConfigLoaded, setIsFirebaseConfigLoaded] = useState(false);
  const [provids, setProvids] = useState<{
    authProvider:AuthProviderInterface;
    dataProvider:DataProvider;
  }>();

  useEffect(() => {
    const loadFirebaseConfig = async () => {
      try {
        await loadBackendConfiguration();
        setProvids(await providers());
        setIsFirebaseConfigLoaded(true);
      } catch (error) {
        console.error('Error loading Firebase config:', error);
      }
    };

    loadFirebaseConfig();
  }, []);

  const DefaultLoader = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );

  const LoaderComponent = LoadingComponent || DefaultLoader;

  if (!isFirebaseConfigLoaded || !provids) {
    return <LoaderComponent />;
  }

  return (
    <Suspense fallback={<LoaderComponent />}>
      <AppComponent authProvider={provids.authProvider}  dataProvider={provids.dataProvider}/>
    </Suspense>
  );
}