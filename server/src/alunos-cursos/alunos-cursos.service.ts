import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlunosCursosService {
  constructor(private db: DatabaseService) { }

  // Inscrever aluno em curso
  async create(aluno_id: number, curso_id: number) {
    const query = `
      INSERT INTO relacionamento.AlunosCursos (aluno_id, curso_id)
      VALUES (@param0, @param1)`;
    return this.db.executeQuery(query, [aluno_id, curso_id]);
  }

  // Lista todas as inscrições, incluindo nome de aluno e título de curso
  async findAll() {
    const query = `
      SELECT ac.id,
             al.id AS aluno_id,
             p.nome AS nome_aluno,
             cu.id AS curso_id,
             cu.titulo AS titulo_curso,
             ac.data_inscricao,
             ac.status
      FROM relacionamento.AlunosCursos ac
      INNER JOIN security.Alunos al ON ac.aluno_id = al.id
      INNER JOIN catalogo.Pessoas p ON al.pessoa_id = p.id
      INNER JOIN catalogo.Cursos cu ON ac.curso_id = cu.id`;
    return this.db.executeQuery(query);
  }

  // Busca uma inscrição específica
  async findOne(id: number) {
    const query = `
      SELECT ac.id,
             al.id AS aluno_id,
             p.nome AS nome_aluno,
             cu.id AS curso_id,
             cu.titulo AS titulo_curso,
             ac.data_inscricao,
             ac.status
      FROM relacionamento.AlunosCursos ac
      INNER JOIN security.Alunos al ON ac.aluno_id = al.id
      INNER JOIN catalogo.Pessoas p ON al.pessoa_id = p.id
      INNER JOIN catalogo.Cursos cu ON ac.curso_id = cu.id
      WHERE ac.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza apenas status da inscrição
  async updateStatus(id: number, status: string) {
    const query = `
      UPDATE relacionamento.AlunosCursos
      SET status = @param1
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id, status]);
  }

  // Remove inscrição
  async remove(id: number) {
    const query = `DELETE FROM relacionamento.AlunosCursos WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
