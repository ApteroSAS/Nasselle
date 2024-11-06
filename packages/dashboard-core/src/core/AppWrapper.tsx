import {ReactNode, useState} from 'react';
import {Admin, DataProvider, localStorageStore, Resource, StoreContextProvider, useStore} from 'react-admin';
import {type ThemeName, themes} from './themes/themes';
import Layout from './layout/Layout';
import Login from './pages/Login';
import {i18nProvider} from "./component/I18nProvider";
import {appConfigContext} from "./configuration/AppConfiguationContext";
import type {PanelInterface} from "./PanelInterface";
import {CustomRoutes} from "ra-core";
import type {AuthProviderInterface} from "../providers/interface/AuthProviderInterface";

// Define props interface for App component
interface AppProps {
  children?: ReactNode;
  dashboard: React.ComponentType<any>;
  authProvider:AuthProviderInterface;
  dataProvider:DataProvider;
  panels: PanelInterface[];
}

// Define props interface for AppWrapper component
interface AppWrapperProps extends AppProps {}

const store = localStorageStore(undefined, appConfigContext.defaultTitle);

const App = ({
               children,
               dashboard,
               authProvider,
               dataProvider,
               panels
             }: AppProps) => {
  const [themeName] = useStore<ThemeName>('themeName', 'house');
  const lightTheme = themes.find(theme => theme.name === themeName)?.light;
  const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
  const [resources, setResources] = useState<Record<string, string>>({});
  const initialResources = panels.map(value => {
    if(value.resource) {
      return value.resource.name;
    }
  });

  const panelsRoutes:any[] = [];
  for (const panel of panels) {
    if(panel.route) {
      for (const route of panel.route.routes) {
        panelsRoutes.push(route);
      }
    }
  }

  return (
    <Admin
      title=""
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={dashboard}
      loginPage={Login}
      layout={Layout(panels)}
      i18nProvider={i18nProvider(panels)}
      disableTelemetry
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
    >
      <CustomRoutes>
        {panelsRoutes.map(value => {
          return value
        })}
      </CustomRoutes>
      {panels.map(value => {
        if(value.resource) {
          return <Resource key={value.name} {...value.resource} />
        }
        return null;
      })}
      {children}
    </Admin>
  );
};

export const AppWrapper = ({
                      children,
                      dashboard,
                      authProvider,
                      dataProvider,
                      panels,
                    }: AppWrapperProps) => (
  <StoreContextProvider value={store}>
    <App
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={dashboard}
      panels={panels}
    >
      {children}
    </App>
  </StoreContextProvider>
);