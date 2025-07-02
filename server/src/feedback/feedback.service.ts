import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FeedbackService {
  constructor(private db: DatabaseService) { }

  // Criar novo feedback
  async create(alunosCursosId: number, avaliacao: number, comentario?: string) {
    const query = `
      INSERT INTO relacionamento.FeedbackCursos (alunosCursosId, avaliacao, comentario)
      OUTPUT INSERTED.*
      VALUES (@param0, @param1, @param2)`;
    return this.db.executeQuery(query, [alunosCursosId, avaliacao, comentario || null]);
  }

  // Listar todos os feedbacks com informações do aluno e curso
  async findAll() {
    const query = `
      SELECT f.id,
             f.alunosCursosId,
             f.avaliacao,
             f.comentario,
             f.data_feedback,
             p.nome as nome_aluno,
             p.email as email_aluno,
             c.titulo as nome_curso
      FROM relacionamento.FeedbackCursos f
      INNER JOIN relacionamento.AlunosCursos ac ON f.alunosCursosId = ac.id
      INNER JOIN security.Alunos a ON ac.aluno_id = a.id
      INNER JOIN catalogo.Pessoas p ON a.pessoa_id = p.id
      INNER JOIN catalogo.Cursos c ON ac.curso_id = c.id
      ORDER BY f.data_feedback DESC`;
    return this.db.executeQuery(query);
  }

  // Buscar feedback específico por ID
  async findOne(id: number) {
    const query = `
      SELECT f.id,
            f.alunosCursosId,
            f.avaliacao,
            f.comentario,
            f.data_feedback,
            p.nome as nome_aluno,
            p.email as email_aluno,
            c.nome as nome_curso
      FROM relacionamento.FeedbackCursos f
      INNER JOIN relacionamento.AlunosCursos ac ON f.alunosCursosId = ac.id
      INNER JOIN security.Alunos a ON ac.aluno_id = a.id
      INNER JOIN catalogo.Pessoas p ON a.pessoa_id = p.id
      INNER JOIN catalogo.Cursos c ON ac.curso_id = c.id
      WHERE f.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Buscar feedback por alunosCursosId (para verificar se já existe)
  async findByAlunoCurso(alunosCursosId: number) {
    const query = `
      SELECT f.id,
             f.alunosCursosId,
             f.avaliacao,
             f.comentario,
             f.data_feedback
      FROM relacionamento.FeedbackCursos f
      WHERE f.alunosCursosId = @param0`;
    return this.db.executeQuery(query, [alunosCursosId]);
  }

  // Atualizar feedback existente
  async update(id: number, avaliacao?: number, comentario?: string) {
    let setParts: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (avaliacao !== undefined) {
      setParts.push(`avaliacao = @param${paramIndex}`);
      params.push(avaliacao);
      paramIndex++;
    }

    if (comentario !== undefined) {
      setParts.push(`comentario = @param${paramIndex}`);
      params.push(comentario);
      paramIndex++;
    }

    if (setParts.length === 0) {
      throw new Error('Nenhum campo para atualizar foi fornecido');
    }

    const query = `
      UPDATE relacionamento.FeedbackCursos
      SET ${setParts.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @param0`;

    return this.db.executeQuery(query, [id, ...params]);
  }

  // Remover feedback
  async remove(id: number) {
    const query = `
      DELETE FROM relacionamento.FeedbackCursos
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
