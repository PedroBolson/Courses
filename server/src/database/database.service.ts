import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
    private pool: sql.ConnectionPool;

    constructor(private configService: ConfigService) { }

    async getPool(): Promise<sql.ConnectionPool> {
        if (!this.pool) {
            this.pool = await new sql.ConnectionPool({
                user: this.configService.get<string>('DB_USER'),
                password: this.configService.get<string>('DB_PASSWORD'),
                server: this.configService.get<string>('DB_SERVER'),
                database: this.configService.get<string>('DB_DATABASE'),
                options: {
                    instanceName: this.configService.get<string>('DB_INSTANCE_NAME'),
                    encrypt: this.configService.get<string>('DB_ENCRYPT') === 'true',
                    trustServerCertificate: this.configService.get<string>('DB_TRUST_SERVER_CERTIFICATE') === 'true',
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
