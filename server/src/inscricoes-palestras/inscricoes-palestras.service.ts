import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class InscricoesPalestrasService {
  constructor(private db: DatabaseService) { }

  // Criar nova inscrição para palestra
  async create(palestra_id: number, nome: string, email: string) {
    const query = `
      INSERT INTO relacionamento.InscricoesPalestras (palestra_id, nome, email)
      OUTPUT INSERTED.*
      VALUES (@param0, @param1, @param2)`;
    return this.db.executeQuery(query, [palestra_id, nome, email]);
  }

  // Listar todas as inscrições com detalhes da palestra
  async findAll() {
    const query = `
      SELECT i.id,
             i.palestra_id,
             i.nome,
             i.email,
             i.data_inscricao,
             p.titulo AS palestra_titulo,
             p.data_hora AS palestra_data,
             p.local AS palestra_local
      FROM relacionamento.InscricoesPalestras i
      INNER JOIN catalogo.Palestras p ON i.palestra_id = p.id
      ORDER BY i.data_inscricao DESC`;
    return this.db.executeQuery(query);
  }

  // Buscar uma inscrição por ID
  async findOne(id: number) {
    const query = `
      SELECT i.id,
             i.palestra_id,
             i.nome,
             i.email,
             i.data_inscricao,
             p.titulo AS palestra_titulo,
             p.data_hora AS palestra_data,
             p.local AS palestra_local
      FROM relacionamento.InscricoesPalestras i
      INNER JOIN catalogo.Palestras p ON i.palestra_id = p.id
      WHERE i.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Listar inscrições por palestra
  async findByPalestraId(palestra_id: number) {
    const query = `
      SELECT i.id,
             i.nome,
             i.email,
             i.data_inscricao
      FROM relacionamento.InscricoesPalestras i
      WHERE i.palestra_id = @param0
      ORDER BY i.data_inscricao DESC`;
    return this.db.executeQuery(query, [palestra_id]);
  }

  // Verificar se email já está inscrito em uma palestra
  async findByEmailAndPalestra(email: string, palestra_id: number) {
    const query = `
      SELECT i.id,
             i.nome,
             i.email,
             i.data_inscricao
      FROM relacionamento.InscricoesPalestras i
      WHERE i.email = @param0 AND i.palestra_id = @param1`;
    return this.db.executeQuery(query, [email, palestra_id]);
  }



  // Atualizar informações de contato
  async update(id: number, nome?: string, email?: string) {
    // Montar a query dinamicamente com base nos campos fornecidos
    let setParts: string[] = [];
    let params: any[] = [id];
    let paramIndex = 1;

    if (nome !== undefined) {
      setParts.push(`nome = @param${paramIndex}`);
      params.push(nome);
      paramIndex++;
    }

    if (email !== undefined) {
      setParts.push(`email = @param${paramIndex}`);
      params.push(email);
      paramIndex++;
    }

    if (setParts.length === 0) {
      throw new Error('Pelo menos um campo deve ser fornecido para atualização');
    }

    const query = `
      UPDATE relacionamento.InscricoesPalestras
      SET ${setParts.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @param0`;

    return this.db.executeQuery(query, params);
  }

  // Remover uma inscrição
  async remove(id: number) {
    const query = `
      DELETE FROM relacionamento.InscricoesPalestras
      WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
