import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
    //scaleway instances
    SCW_ZONE: string;
    SCW_API_URL: string;
    SCW_ACCESS_KEY: string;
    SCW_SECRET_KEY: string;
    SCW_DEFAULT_ORGANIZATION_ID: string;
    SCW_DEFAULT_PROJECT_ID: string;
    SCW_INSTANCE: string;
    SCW_IMAGE: string;
    SSH_KEY: string;

    //mesh router backend for domain providing
    MESH_ROUTER_BACKEND_URL: string;
    MESH_ROUTER_BACKEND_API_KEY: string;
}

export const config: EnvConfig = {
    SCW_ZONE: process.env.SCW_ZONE,
    SCW_API_URL: process.env.SCW_API_URL,
    SCW_ACCESS_KEY: process.env.SCW_ACCESS_KEY,
    SCW_SECRET_KEY: process.env.SCW_SECRET_KEY,
    SCW_DEFAULT_ORGANIZATION_ID: process.env.SCW_DEFAULT_ORGANIZATION_ID,
    SCW_DEFAULT_PROJECT_ID: process.env.SCW_DEFAULT_PROJECT_ID,
    SCW_INSTANCE: process.env.SCW_INSTANCE,
    SCW_IMAGE: process.env.SCW_IMAGE,
    SSH_KEY: process.env.SSH_KEY,

    MESH_ROUTER_BACKEND_URL: process.env.MESH_ROUTER_BACKEND_URL,
    MESH_ROUTER_BACKEND_API_KEY: process.env.MESH_ROUTER_BACKEND_API_KEY,
};

