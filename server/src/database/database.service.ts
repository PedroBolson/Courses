import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class DatabaseService {
    private pool: sql.ConnectionPool;

    async getPool(): Promise<sql.ConnectionPool> {
        if (!this.pool) {
            this.pool = await new sql.ConnectionPool({
                user: 'EnemAppLogin',           // login SQL (se for SQL Auth)
                password: 'SenhaForte@123',     // senha do login
                server: '127.0.0.1',            // ou 'localhost'
                database: 'EnemPlatformDB',
                options: {
                    instanceName: 'SQLEXPRESS01',
                    encrypt: false,               // desliga SSL (dev)
                    trustServerCertificate: true, // aceita certificado autoassinado
                },
            }).connect();
        }
        return this.pool;
    }

    async executeQuery(query: string, params: any[] = []) {
        const pool = await this.getPool();
        const request = pool.request();
        params.forEach((p, i) => request.input(`param${i}`, p));
        const result = await request.query(query);
        return { executedQuery: query, rows: result.recordset };
    }
}
