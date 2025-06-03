import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CursosService {
  constructor(private db: DatabaseService) { }

  // Cria novo curso
  async create(
    titulo: string,
    descricao: string,
    professor_id: number,
    area_id: number
  ) {
    const query = `
      INSERT INTO catalogo.Cursos (titulo, descricao, professor_id, area_id)
      VALUES (@param0, @param1, @param2, @param3)`;
    return this.db.executeQuery(query, [titulo, descricao, professor_id, area_id]);
  }

  // Lista todos os cursos, juntando dados de professores e áreas
  async findAll() {
    const query = `
      SELECT cu.id,
             cu.titulo,
             cu.descricao,
             pr.id AS professor_id,
             po.nome AS nome_professor,
             ar.id AS area_id,
             ar.nome_area
      FROM catalogo.Cursos cu
      INNER JOIN security.Professores pr ON cu.professor_id = pr.id
      INNER JOIN catalogo.Pessoas po ON pr.pessoa_id = po.id
      INNER JOIN catalogo.AreasDoConhecimento ar ON cu.area_id = ar.id`;
    return this.db.executeQuery(query);
  }

  // Busca um curso por ID
  async findOne(id: number) {
    const query = `
      SELECT cu.id,
             cu.titulo,
             cu.descricao,
             pr.id AS professor_id,
             po.nome AS nome_professor,
             ar.id AS area_id,
             ar.nome_area
      FROM catalogo.Cursos cu
      INNER JOIN security.Professores pr ON cu.professor_id = pr.id
      INNER JOIN catalogo.Pessoas po ON pr.pessoa_id = po.id
      INNER JOIN catalogo.AreasDoConhecimento ar ON cu.area_id = ar.id
      WHERE cu.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza curso
  async update(
    id: number,
    titulo: string,
    descricao: string,
    professor_id: number,
    area_id: number
  ) {
    const query = `
      UPDATE catalogo.Cursos
      SET titulo = @param1,
          descricao = @param2,
          professor_id = @param3,
          area_id = @param4
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id, titulo, descricao, professor_id, area_id]);
  }

  // Remove curso
  async remove(id: number) {
    const query = `DELETE FROM catalogo.Cursos WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
