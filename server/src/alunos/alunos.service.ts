import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AlunosService {
  constructor(private db: DatabaseService) { }
  // Cria novo aluno (hash de senha + insert em security.Alunos)
  async create(pessoa_id: number, senha: string) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(senha, saltRounds);
    const query = `
      INSERT INTO security.Alunos (pessoa_id, senha_hash)
      OUTPUT INSERTED.id
      VALUES (@param0, @param1)`;
    return this.db.executeQuery(query, [pessoa_id, hashed]);
  }

  // Lista todos os alunos, com JOIN em catalogo.Pessoas para exibir nome e email
  async findAll() {
    const query = `
      SELECT a.id,
             p.nome,
             p.email,
             a.data_matricula,
             a.status_pagamento
      FROM security.Alunos a
      INNER JOIN catalogo.Pessoas p ON a.pessoa_id = p.id`;
    return this.db.executeQuery(query);
  }

  // Busca aluno por ID
  async findOne(id: number) {
    const query = `
      SELECT a.id,
             p.nome,
             p.email,
             a.data_matricula,
             a.status_pagamento
      FROM security.Alunos a
      INNER JOIN catalogo.Pessoas p ON a.pessoa_id = p.id
      WHERE a.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza apenas o status_pagamento (update em security.Alunos)
  async updateStatus(id: number, status: string) {
    const query = `
      UPDATE security.Alunos
      SET status_pagamento = @param1
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id, status]);
  }

  // Remove aluno
  async remove(id: number) {
    const query = `DELETE FROM security.Alunos WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
