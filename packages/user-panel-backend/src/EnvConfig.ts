import dotenv from 'dotenv';
dotenv.config();

interface EnvConfig {
    KEY: string;
}

export const config: EnvConfig = {
    KEY: process.env.KEY
};

