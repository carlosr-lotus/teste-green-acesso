import { Sequelize } from 'sequelize-typescript';
import Lotes from '../models/lotes';
import Boletos from '../models/boletos';
import { config } from 'dotenv';

config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
  models: [Lotes, Boletos],
  logging: false,
});
