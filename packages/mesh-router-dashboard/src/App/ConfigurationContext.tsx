import { createContext, ReactNode, useContext } from 'react';
import {
    defaultLogo,
    defaultTitle,
} from '../configuration/AppConfiguration';

// Define types for the context value
export interface ConfigurationContextValue {
    title: string;
    logo: string;
}

export interface ConfigurationProviderProps extends ConfigurationContextValue {
    children: ReactNode;
}

// Create context with default value
export const ConfigurationContext = createContext<ConfigurationContextValue>({
    title: defaultTitle,
    logo: defaultLogo,
});

export const ConfigurationProvider = ({
    children,
    logo,
    title,
}: ConfigurationProviderProps) => (
    <ConfigurationContext.Provider
        value={{
            logo,
            title,
        }}
    >
        {children}
    </ConfigurationContext.Provider>
);

export const useConfigurationContext = () => useContext(ConfigurationContext);
