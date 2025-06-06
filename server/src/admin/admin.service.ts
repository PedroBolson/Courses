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

  // Listar todos os admins
  async getAllAdmins() {
    const query = `SELECT id, username FROM security.Admins`;
    return this.db.executeQuery(query, []);
  }

  // Atualizar admin
  async updateAdmin(id: number, username: string, password?: string) {
    if (password) {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);
      const query = `
        UPDATE security.Admins 
        SET username = @param0, password_hash = @param1 
        WHERE id = @param2`;
      return this.db.executeQuery(query, [username, hashed, id]);
    } else {
      const query = `
        UPDATE security.Admins 
        SET username = @param0 
        WHERE id = @param1`;
      return this.db.executeQuery(query, [username, id]);
    }
  }

  // Deletar admin
  async deleteAdmin(id: number) {
    const query = `DELETE FROM security.Admins WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
