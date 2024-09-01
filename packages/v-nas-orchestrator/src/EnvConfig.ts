import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
    KEY: string;
    ROOT_USER_FOLDER: string;
}

export const config: EnvConfig = {
    KEY: process.env.KEY,
    ROOT_USER_FOLDER: process.env.ROOT_USER_FOLDER,
};

