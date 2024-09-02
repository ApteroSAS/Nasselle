import RemoveFromQueue from '@mui/icons-material/RemoveFromQueue';
import {routes} from "./Routes";
import {PanelInterface} from "../PanelInterface";
import {resourceName} from "./Constant";
import {customEnglishMessages} from "./i18n/en";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";

export const keyPanel:PanelInterface = {
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
    icon: DeveloperBoardIcon
};
