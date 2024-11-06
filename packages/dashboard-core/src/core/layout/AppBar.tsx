import {AppBar, Logout, TitlePortal, UserMenu, useUserMenu} from 'react-admin';
import {Box, ListItemIcon, ListItemText, MenuItem, type Theme, useMediaQuery} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {Link} from 'react-router-dom';

import Logo from './Logo';
import {AppBarToolbar} from './AppBarToolbar';
import {appConfigContext} from "../configuration/AppConfiguationContext";

const ConfigurationMenu = () => {
    const { onClose } = useUserMenu() ?? {};
    return (
      <MenuItem component={Link} to="/settings" onClick={onClose}>
          <ListItemIcon>
              <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My info</ListItemText>
      </MenuItem>
    );
};

const CustomAppBar = () => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar
          color="secondary"
          toolbar={<AppBarToolbar />}
          userMenu={
              <UserMenu>
                  <ConfigurationMenu />
                  <Logout />
              </UserMenu>}
        >
            <TitlePortal />
            {isLargeEnough && <Logo style={{maxHeight:"30px",paddingRight:"10px"}}/>}
          {isLargeEnough && <strong>{appConfigContext.defaultTitle}</strong>}
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        </AppBar>
    );
};

export default CustomAppBar;
