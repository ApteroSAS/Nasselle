import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";

import {
    useTranslate,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
} from 'react-admin';
import { usePermissions } from 'react-admin';
import {panels} from "../../panels/Config";
import {PanelInterface} from "../../panels/PanelInterface";
import {app} from "../../configuration/providers/firebase/FirebaseAuthProvider";

const MenuItem = (panel: PanelInterface, dense: boolean,translate:any) => {
    return <MenuItemLink
        key = {panel.name}
        to={{
            pathname: '/' + panel.name
        }}
        primaryText={translate(`resources.` + panel.name + `.name`, {
            smart_count: 2,
        })}
        leftIcon={<panel.icon/>}
        dense={dense}
    />
}

type MenuName = 'menuCatalog' | 'menuSales' | 'menuCustomers';

const Menu = ({ dense = false }: MenuProps) => {

    const { isLoading, permissions } = usePermissions();

    const [state, setState] = useState({
        menuCatalog: true,
        menuSales: true,
        menuCustomers: true,
    });
    const translate = useTranslate();
    const [open] = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Box
            sx={{
                width: open ? 200 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
        >
            <DashboardMenuItem />
            {!isLoading && panels.map(value => {
                return MenuItem(value, dense,translate);
            })}
        </Box>
    );
};

export default Menu;

