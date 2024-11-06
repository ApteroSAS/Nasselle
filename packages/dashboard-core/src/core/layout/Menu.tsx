import Box from '@mui/material/Box';

import {
  DashboardMenuItem,
  MenuItemLink,
  type MenuProps,
  usePermissions,
  useSidebarState,
  useTranslate,
} from 'react-admin';
import type {PanelInterface} from "../PanelInterface";

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

const Menu = (panels) => ({ dense = false }: MenuProps) => {

    const { isLoading } = usePermissions();

    const translate = useTranslate();
    const [open] = useSidebarState();

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

