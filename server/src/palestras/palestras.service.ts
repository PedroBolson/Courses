import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PalestrasService {
  constructor(private db: DatabaseService) { }

  // Método auxiliar para formatar data para o SQL Server
  private formatDateForSqlServer(dateString: string): string {
    try {
      // Verifica se é uma data válida
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida');
      }
      // Formato ISO que o SQL Server aceita (YYYY-MM-DD HH:MM:SS)
      return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch (error) {
      // Mantém o valor original se não conseguir converter
      return dateString;
    }
  }

  // Cria nova palestra (insert em catalogo.Palestras)
  async create(
    titulo: string,
    descricao: string,
    data_hora: string,
    local: string,
    convidado_id: number,
    area_id: number
  ) {
    // Formatação da data para o SQL Server
    const formattedDate = this.formatDateForSqlServer(data_hora);

    const query = `
      INSERT INTO catalogo.Palestras (
        titulo,
        descricao,
        data_hora,
        local,
        convidado_id,
        area_id
      )
      VALUES (
        @param0,
        @param1,
        @param2,
        @param3,
        @param4,
        @param5
      )`;
    return this.db.executeQuery(query, [
      titulo,
      descricao,
      formattedDate,
      local,
      convidado_id,
      area_id,
    ]);
  }

  // Lista todas as palestras, juntando nome do convidado e nome da área
  async findAll() {
    const query = `
      SELECT pa.id,
             pa.titulo,
             pa.descricao,
             pa.data_hora,
             pa.local,
             p.nome        AS nome_convidado,
             ar.nome_area  AS nome_area
      FROM catalogo.Palestras pa
      INNER JOIN catalogo.Pessoas p ON pa.convidado_id = p.id
      INNER JOIN catalogo.AreasDoConhecimento ar ON pa.area_id = ar.id`;
    return this.db.executeQuery(query);
  }

  // Busca palestra por ID
  async findOne(id: number) {
    const query = `
      SELECT pa.id,
             pa.titulo,
             pa.descricao,
             pa.data_hora,
             pa.local,
             p.nome       AS nome_convidado,
             ar.nome_area AS nome_area
      FROM catalogo.Palestras pa
      INNER JOIN catalogo.Pessoas p ON pa.convidado_id = p.id
      INNER JOIN catalogo.AreasDoConhecimento ar ON pa.area_id = ar.id
      WHERE pa.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza palestra
  async update(
    id: number,
    titulo: string,
    descricao: string,
    data_hora: string,
    local: string,
    convidado_id: number,
    area_id: number
  ) {
    // Formatação da data para o SQL Server
    const formattedDate = this.formatDateForSqlServer(data_hora);

    const query = `
      UPDATE catalogo.Palestras
      SET titulo = @param1,
          descricao = @param2,
          data_hora = @param3,
          local = @param4,
          convidado_id = @param5,
          area_id = @param6
      WHERE id = @param0`;
    return this.db.executeQuery(query, [
      id,
      titulo,
      descricao,
      formattedDate,
      local,
      convidado_id,
      area_id,
    ]);
  }

  // Remove palestra
  async remove(id: number) {
    const query = `DELETE FROM catalogo.Palestras WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
