import {CustomRoutes} from 'react-admin';
import {Route} from 'react-router';
import {AppWrapper, PasswordResetPage, RegisterPage, SettingsPage} from 'dashboard-core';
import {MeshSettingsPage} from "@/pages/MeshSettingsPage";
import {MeshRegisterPage} from "@/pages/MeshRegisterPage";
import {Dashboard} from '@/panels/dashboard';
import {hwNasPanel} from "@/panels/hw-nas/Config";

const MyApp = ({authProvider,dataProvider}) => {
  return (
    <AppWrapper
      authProvider={authProvider}
      dataProvider={dataProvider}
      dashboard={Dashboard}
      panels={[ hwNasPanel ]}
    >
      {/* Custom routes no layout external*/}
      <CustomRoutes noLayout>
        <Route path={RegisterPage.path} element={<MeshRegisterPage />}/>
        <Route path="/getting-started" element={<MeshRegisterPage />}/>
        <Route path={PasswordResetPage.path} element={<PasswordResetPage />}/>
      </CustomRoutes>

      {/* Custom routes in app*/}
      <CustomRoutes>
        <Route path={SettingsPage.path} element={<MeshSettingsPage />}/>
      </CustomRoutes>
    </AppWrapper>
  );
};

export default MyApp;