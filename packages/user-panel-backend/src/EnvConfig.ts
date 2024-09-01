import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
    KEY: string;
    VNAS_BACKEND_URL: string;
    VNAS_AUTH_TOKEN: string;
}

export const config: EnvConfig = {
    KEY: process.env.KEY,
    VNAS_BACKEND_URL: process.env.VNAS_BACKEND_URL,
    VNAS_AUTH_TOKEN: process.env.VNAS_AUTH_TOKEN
};

