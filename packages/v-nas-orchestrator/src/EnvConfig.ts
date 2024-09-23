import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
    SCW_ZONE: string;
    KEY: string;
    SCW_API_URL: string;
    SCW_ACCESS_KEY: string;
    SCW_SECRET_KEY: string;
    SCW_DEFAULT_ORGANIZATION_ID: string;
    SCW_DEFAULT_PROJECT_ID: string;
    SCW_INSTANCE: string;
    SCW_IMAGE: string;
    SSH_KEY: string;

    B2_APPLICATION_KEY_NAME: string;
    B2_APPLICATION_KEY_ID: string;
    B2_APPLICATION_KEY: string;

}

export const config: EnvConfig = {
    SCW_ZONE: process.env.SCW_ZONE,
    KEY: process.env.KEY,
    SCW_API_URL: process.env.SCW_API_URL,
    SCW_ACCESS_KEY: process.env.SCW_ACCESS_KEY,
    SCW_SECRET_KEY: process.env.SCW_SECRET_KEY,
    SCW_DEFAULT_ORGANIZATION_ID: process.env.SCW_DEFAULT_ORGANIZATION_ID,
    SCW_DEFAULT_PROJECT_ID: process.env.SCW_DEFAULT_PROJECT_ID,
    SCW_INSTANCE: process.env.SCW_INSTANCE,
    SCW_IMAGE: process.env.SCW_IMAGE,
    SSH_KEY: process.env.SSH_KEY,

    B2_APPLICATION_KEY_NAME: process.env.B2_APPLICATION_KEY_NAME,
    B2_APPLICATION_KEY_ID: process.env.B2_APPLICATION_KEY_ID,
    B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY,
};

