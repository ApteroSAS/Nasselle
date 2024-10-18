import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import {routes} from "./Routes";
import {PanelInterface} from "../PanelInterface";
import {resourceName} from "./Constant";
import {customEnglishMessages} from "./i18n/en";
import RemoveFromQueue from "@mui/icons-material/RemoveFromQueue";

export const vnasPanel:PanelInterface = {
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
    icon: RemoveFromQueue,
};
