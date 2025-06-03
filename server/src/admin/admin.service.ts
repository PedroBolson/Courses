import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) { }

  // Cadastrar novo admin (hash de senha + insert em security.Admins)
  async registerAdmin(username: string, password: string) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    const query = `
      INSERT INTO security.Admins (username, password_hash)
      VALUES (@param0, @param1)`;
    return this.db.executeQuery(query, [username, hashed]);
  }

  // Validar login de admin (select em security.Admins)
  async validateLogin(username: string, password: string) {
    const querySelect = `
      SELECT * FROM security.Admins
      WHERE username = @param0`;
    const result = await this.db.executeQuery(querySelect, [username]);
    if (result.rows.length === 0) return false;

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    return match ? { id: admin.id, username: admin.username } : false;
  }
}
