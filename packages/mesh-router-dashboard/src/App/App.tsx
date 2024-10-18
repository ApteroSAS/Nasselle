import * as React from 'react';
import {
    Admin,
    CustomRoutes,
    Resource,
    localStorageStore,
    useStore,
    StoreContextProvider,
} from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { Route } from 'react-router';
import { Dashboard } from '../panels/dashboard';
import {routes} from './routes';

import { authProvider } from '../configuration/providers/firebase/FirebaseAuthProvider';
import { multiDataProvider, onNewResource } from '../configuration/providers/interface/DataProvider';
import { useState } from 'react';
import {panels} from "../panels/Config";
import { themes, ThemeName } from './themes/themes';

import customEnglishMessages from "./i18n/en";
import customFrenchMessages from "./i18n/fr";
import {SettingsPage} from "./user/SettingsPage";
import { RegisterPage } from './pages/RegisterPage';
import Login from './user/Login';
import Layout from './layout/Layout';
import {initializeDataProvider} from "../configuration/DataProviderConfig";

initializeDataProvider();

// @ts-ignore
const i18nProvider = polyglotI18nProvider(locale => {
    let messages:any = customEnglishMessages;
    if (locale === 'fr') {
        messages = customFrenchMessages;
    }
    for (const panel of panels) {
        if(panel.i18n) {
            messages.resources[panel.name] = panel.i18n[locale];
        }
    }
    return messages;
}, 'en','fr');

const store = localStorageStore(undefined, 'NSL');

const App = () => {
    const [themeName] = useStore<ThemeName>('themeName', 'house');
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
    const [resources, setResources] = useState({});
    let initialResources = panels.map(value => {
        if(value.resource) {
            return value.resource.name;
        }
    });
    onNewResource(res => {
        if (initialResources.indexOf(res) !== -1) {
            return;
        }
        let newR: any = { ...resources };
        newR[res] = res;
        setTimeout(() => {
            setResources(newR);
        }, 0);
    });
    return (
        <Admin
            title=""
            dataProvider={multiDataProvider}
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            defaultTheme="light"
        >
            {routes}
            {/* To add a new pannel add a new folder in panels (with an index.ts) and link it in this menu and in layouts/Menu.tsx */}
            {panels.map(value => {
                if(value.resource) {
                    return <Resource key={value.name} {...value.resource} />
                }
            })}
            <CustomRoutes noLayout >
                <Route
                  path={RegisterPage.path}
                  element={<RegisterPage />}
                />
            </CustomRoutes>
            <CustomRoutes noLayout >
                <Route
                  path={"/getting-started"}
                  element={<RegisterPage />}
                />
            </CustomRoutes>
            <CustomRoutes>
                <Route
                  path={SettingsPage.path}
                  element={<SettingsPage />}
                />
            </CustomRoutes>
        </Admin>
    );
};

const AppWrapper = () => (
    <StoreContextProvider value={store}>
        <App />
    </StoreContextProvider>
);

export default AppWrapper;
