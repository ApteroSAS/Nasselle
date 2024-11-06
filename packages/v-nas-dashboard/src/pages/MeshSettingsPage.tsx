// Usage example

import {SettingsPage} from "dashboard-core";
import {deleteUserDomain} from "@/providers/mesh-router/MeshRouterAPI";

export const MeshSettingsPage = () =>  <SettingsPage onDeleteUser={deleteUserDomain} />;