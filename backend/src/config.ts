import { config } from 'dotenv';

config();

export const CONFIG = {
  DATABASE: {
    TYPE: 'postgres',
    HOST: process.env.POSTGRES_HOST || 'localhost',
    PORT: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    USERNAME: process.env.POSTGRES_USER || 'student',
    PASSWORD: process.env.POSTGRES_PASSWORD || 'student',
    DATABASE: process.env.POSTGRES_DB || 'kupipodariday',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    EXPIRES_IN: '7d',
  },
  SERVER: {
    PORT: parseInt(process.env.PORT || '3000', 10),
  },
};
