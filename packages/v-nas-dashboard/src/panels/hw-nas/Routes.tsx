import {HWNasPanel} from "./HWNasPanel";
import {Route} from 'react-router-dom';
import {resourceName} from "./Constant";

export const routes = [<Route key={resourceName} path={"/"+resourceName} element={<HWNasPanel />} />]
