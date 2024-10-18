import {ResourceProps} from "ra-core";
import {TranslationMessages} from "react-admin";

export interface PanelInterface{
    icon: any;
    name: string;
    resource:ResourceProps;
    i18n?:Record<string,TranslationMessages>,
    route?:{
        routes:any,
    };
}
