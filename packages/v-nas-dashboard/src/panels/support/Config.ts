import SupportAgent from '@mui/icons-material/SupportAgent';
import {routes} from "./Routes";
import type {PanelInterface} from "../../core/PanelInterface";
import {resourceName} from "./Constant";
import {customEnglishMessages} from "./i18n/en";

export const supportPanel:PanelInterface = {
    name: resourceName,
    route: {
        routes
    },
    i18n: {
        en: customEnglishMessages,
    },
    resource:{
        name: resourceName
    },
    icon: SupportAgent,
};
