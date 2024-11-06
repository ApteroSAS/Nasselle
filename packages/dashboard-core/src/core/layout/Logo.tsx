import {appConfigContext} from "../configuration/AppConfiguationContext";

const Logo = (props: any) => {
    return <img {...props} src={appConfigContext.defaultLogo} alt={appConfigContext.defaultTitle}/>
};

export default Logo;
