import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PagamentosService {
  constructor(private db: DatabaseService) { }

  // Registra novo pagamento
  async create(aluno_id: number, valor: number, forma_pagamento: string) {
    const query = `
      INSERT INTO catalogo.Pagamentos (aluno_id, valor, forma_pagamento)
      VALUES (@param0, @param1, @param2)`;
    return this.db.executeQuery(query, [aluno_id, valor, forma_pagamento]);
  }

  // Lista todos os pagamentos, juntando nome do aluno
  async findAll() {
    const query = `
      SELECT pa.id,
             al.id AS aluno_id,
             p.nome AS nome_aluno,
             pa.valor,
             pa.data_pagamento,
             pa.forma_pagamento,
             pa.status
      FROM catalogo.Pagamentos pa
      INNER JOIN security.Alunos al ON pa.aluno_id = al.id
      INNER JOIN catalogo.Pessoas p ON al.pessoa_id = p.id`;
    return this.db.executeQuery(query);
  }

  // Busca pagamento por ID
  async findOne(id: number) {
    const query = `
      SELECT pa.id,
             al.id AS aluno_id,
             p.nome AS nome_aluno,
             pa.valor,
             pa.data_pagamento,
             pa.forma_pagamento,
             pa.status
      FROM catalogo.Pagamentos pa
      INNER JOIN security.Alunos al ON pa.aluno_id = al.id
      INNER JOIN catalogo.Pessoas p ON al.pessoa_id = p.id
      WHERE pa.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza status do pagamento
  async updateStatus(id: number, status: string) {
    const query = `
      UPDATE catalogo.Pagamentos
      SET status = @param1
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id, status]);
  }

  // Remove pagamento
  async remove(id: number) {
    const query = `DELETE FROM catalogo.Pagamentos WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
