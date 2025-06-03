import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AreasService {
  constructor(private db: DatabaseService) { }

  async create(nome_area: string, descricao: string) {
    const query = `
      INSERT INTO catalogo.AreasDoConhecimento (nome_area, descricao)
      VALUES (@param0, @param1)`;
    return this.db.executeQuery(query, [nome_area, descricao]);
  }

  async findAll() {
    const query = `SELECT * FROM catalogo.AreasDoConhecimento`;
    return this.db.executeQuery(query);
  }

  async findOne(id: number) {
    const query = `SELECT * FROM catalogo.AreasDoConhecimento WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  async update(id: number, nome_area: string, descricao: string) {
    const query = `
      UPDATE catalogo.AreasDoConhecimento
      SET nome_area = @param1, descricao = @param2
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id, nome_area, descricao]);
  }

  async remove(id: number) {
    const query = `DELETE FROM catalogo.AreasDoConhecimento WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
