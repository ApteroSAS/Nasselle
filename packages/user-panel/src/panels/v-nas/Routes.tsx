import * as React from 'react';
import {VNasPanel} from "./VNasPanel";
import { Route } from 'react-router-dom';
import {resourceName} from "./Constant";

export const routes = [<Route key={resourceName} path={"/"+resourceName} element={<VNasPanel />} />]
