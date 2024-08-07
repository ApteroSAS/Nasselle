import * as React from 'react';
import {panels} from "../panels/Config";
import {CustomRoutes} from "ra-core";
let panelsRoutes = [];
for (const panel of panels) {
    if(panel.route) {
        for (const route of panel.route.routes) {
            panelsRoutes.push(route);
        }
    }
}
export const routes = <CustomRoutes>
    {panelsRoutes.map(value => {
        return value
    })}
</CustomRoutes>;
