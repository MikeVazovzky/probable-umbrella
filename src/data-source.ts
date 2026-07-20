import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const sourceFolder = 
    process.env.NODE_ENV === 'production'
        ? 'dist'
        : 'src';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    synchronize: false,

    entities: [
        join(
            process.cwd(),
            sourceFolder,
            '**',
            '*.entity{.ts,.js}',
        )
    ],
    migrations: [
        join(
            process.cwd(),
            sourceFolder,
            'migrations',
            '*{.ts,.js}'
        ),
    ],
});