import {createContext, type ReactNode, useContext} from 'react';
import {appConfigContext} from "./AppConfiguationContext";

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
    title: appConfigContext.defaultTitle,
    logo: appConfigContext.defaultLogo,
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
