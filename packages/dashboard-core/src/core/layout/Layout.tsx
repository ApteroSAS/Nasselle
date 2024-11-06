import {Layout} from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';
import React from "react";

const LayoutComp = (panels) => ({ children }: { children: React.ReactNode }) => (
    <Layout appBar={AppBar} menu={Menu(panels)}>
        {children}
    </Layout>
);

export default LayoutComp;
