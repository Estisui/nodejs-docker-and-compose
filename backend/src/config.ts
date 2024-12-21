import { config } from 'dotenv';

config();

export const CONFIG = {
  DATABASE: {
    TYPE: process.env.DB_TYPE || 'postgres',
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432', 10),
    USERNAME: process.env.DB_USERNAME || 'student',
    PASSWORD: process.env.DB_PASSWORD || 'student',
    DATABASE: process.env.DB_NAME || 'kupipodariday',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  SERVER: {
    PORT: parseInt(process.env.PORT || '3000', 10),
  },
};
