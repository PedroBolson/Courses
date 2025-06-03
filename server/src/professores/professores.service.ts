import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfessoresService {
  constructor(private db: DatabaseService) { }

  // Cadastra novo professor (hash de senha + insert em security.Professores)
  async create(pessoa_id: number, especialidade: string, senha: string) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(senha, saltRounds);
    const query = `
      INSERT INTO security.Professores (pessoa_id, especialidade, senha_hash)
      VALUES (@param0, @param1, @param2)`;
    return this.db.executeQuery(query, [pessoa_id, especialidade, hashed]);
  }

  // Autentica professor (SELECT de security.Professores)
  async validateLogin(pessoa_id: number, senha: string) {
    const querySelect = `
      SELECT id, senha_hash
      FROM security.Professores
      WHERE pessoa_id = @param0`;
    const result = await this.db.executeQuery(querySelect, [pessoa_id]);
    if (result.rows.length === 0) return false;

    const prof = result.rows[0];
    const match = await bcrypt.compare(senha, prof.senha_hash);
    return match ? { id: prof.id, pessoa_id } : false;
  }

  // Lista todos os professores (JOIN em catalogo.Pessoas)
  async findAll() {
    const query = `
      SELECT pr.id,
             po.nome,
             po.email,
             pr.especialidade,
             pr.data_contratacao
      FROM security.Professores pr
      INNER JOIN catalogo.Pessoas po ON pr.pessoa_id = po.id`;
    return this.db.executeQuery(query);
  }

  // Busca professor por ID (JOIN em catalogo.Pessoas)
  async findOne(id: number) {
    const query = `
      SELECT pr.id,
             po.nome,
             po.email,
             pr.especialidade,
             pr.data_contratacao
      FROM security.Professores pr
      INNER JOIN catalogo.Pessoas po ON pr.pessoa_id = po.id
      WHERE pr.id = @param0`;
    return this.db.executeQuery(query, [id]);
  }

  // Atualiza especialidade e/ou senha do professor
  async update(id: number, especialidade: string, senha?: string) {
    if (senha) {
      const saltRounds = 10;
      const hashed = await bcrypt.hash(senha, saltRounds);
      const query = `
        UPDATE security.Professores
        SET especialidade = @param1,
            senha_hash = @param2
        WHERE id = @param0`;
      return this.db.executeQuery(query, [id, especialidade, hashed]);
    } else {
      const query = `
        UPDATE security.Professores
        SET especialidade = @param1
        WHERE id = @param0`;
      return this.db.executeQuery(query, [id, especialidade]);
    }
  }

  // Remove professor
  async remove(id: number) {
    const query = `DELETE FROM security.Professores WHERE id = @param0`;
    return this.db.executeQuery(query, [id]);
  }
}
