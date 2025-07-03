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

  // Login de aluno (busca por email e valida senha)
  async login(email: string, password: string) {
    const querySelect = `
      SELECT a.id, a.pessoa_id, a.senha_hash, a.status_pagamento,
             p.nome, p.email, p.telefone
      FROM security.Alunos a
      INNER JOIN catalogo.Pessoas p ON a.pessoa_id = p.id
      WHERE p.email = @param0`;

    const result = await this.db.executeQuery(querySelect, [email]);

    if (result.rows.length === 0) {
      return {
        success: false,
        message: 'Email não encontrado',
        executedQuery: querySelect
      };
    }

    const aluno = result.rows[0];

    // Verificar se a conta está ativa
    if (aluno.status_pagamento !== 'ativo') {
      return {
        success: false,
        message: `Conta ${aluno.status_pagamento}. Entre em contato com o suporte.`,
        status: aluno.status_pagamento,
        executedQuery: querySelect
      };
    }

    // Verificar senha
    const match = await bcrypt.compare(password, aluno.senha_hash);
    if (!match) {
      return {
        success: false,
        message: 'Senha incorreta',
        executedQuery: querySelect
      };
    }

    // Login bem-sucedido
    return {
      success: true,
      aluno: {
        id: aluno.id,
        pessoa_id: aluno.pessoa_id,
        nome: aluno.nome,
        email: aluno.email,
        telefone: aluno.telefone,
        status_pagamento: aluno.status_pagamento
      },
      executedQuery: querySelect
    };
  }
}
