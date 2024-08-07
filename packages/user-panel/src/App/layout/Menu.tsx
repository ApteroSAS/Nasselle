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
import {app} from "../../providers/firebaseAuthProvider";

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
    //let loaded = true;
    //console.log("permissions",permissions);
    useEffect(()=>{
        if(permissions && permissions.user_id) {
            (async ()=> {
                try {
                    //https://firebase.google.com/docs/firestore/query-data/get-data
                    const db = getFirestore(app);
                    const ref = doc(db, "users", permissions.user_id);
                    const docSnap = await getDoc(ref);
                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                    /*multiDataProvider.getOne("users",{id : permissions.user_id}).then(value => {
                        console.log("PH",value);
                    });*/
                } catch (e) {
                    console.error(e)
                }
            })()
        }
    },[permissions])

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

