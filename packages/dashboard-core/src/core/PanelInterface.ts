import type {ResourceProps} from "ra-core";
import type {TranslationMessages} from "react-admin";

export interface PanelInterface{
    icon: any;
    name: string;
    resource:ResourceProps;
    i18n?:Record<string,TranslationMessages>,
    route?:{
        routes:any,
    };
}
