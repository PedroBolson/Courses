import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PessoasService {
  constructor(private db: DatabaseService) { }

  // Cria nova Pessoa (insert em catalogo.Pessoas)
  async create(nome: string, email: string, telefone: string) {
    const query = `
      INSERT INTO catalogo.Pessoas (nome, email, telefone)
      VALUES (@param0, @param1, @param2)`;
    return this.db.executeQuery(query, [nome, email, telefone]);
  }

  // Lista todas as Pessoas
  async findAll() {
    const query = `SELECT * FROM catalogo.Pessoas`;
    return this.db.executeQuery(query);
  }

  // Busca Pessoa por ID
  async findOne(id: number) {
    const query = `SELECT * FROM catalogo.Pessoas WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza uma Pessoa
  async update(id: number, nome: string, email: string, telefone: string) {
    const query = `
      UPDATE catalogo.Pessoas
      SET nome = @param1, email = @param2, telefone = @param3
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id, nome, email, telefone]);
  }

  // Remove uma Pessoa
  async remove(id: number) {
    const query = `DELETE FROM catalogo.Pessoas WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
