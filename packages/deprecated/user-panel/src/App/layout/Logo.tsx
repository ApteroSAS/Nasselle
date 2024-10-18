import * as React from 'react';
import {defaultLogo, defaultTitle} from "../../configuration/AppConfiguration";

const Logo = (props: any) => {
    return <img {...props} src={defaultLogo} alt={defaultTitle}/>
};

export default Logo;
