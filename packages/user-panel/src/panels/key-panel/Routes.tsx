import * as React from 'react';
import {KeyPanel} from "./KeyPanel";
import { Route } from 'react-router-dom';
import {resourceName} from "./Constant";

export const routes = [<Route key={resourceName} path={"/"+resourceName} element={<KeyPanel />} />]
