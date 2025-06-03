import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProfessoresService } from './professores.service';

@Controller('professores')
export class ProfessoresController {
  constructor(private professoresService: ProfessoresService) { }

  @Post()
  create(@Body() body: { pessoa_id: number; especialidade: string; senha: string }) {
    return this.professoresService.create(body.pessoa_id, body.especialidade, body.senha);
  }

  @Post('login')
  async login(@Body() body: { pessoa_id: number; senha: string }) {
    const valid = await this.professoresService.validateLogin(body.pessoa_id, body.senha);
    if (!valid) {
      return { success: false, message: 'Credenciais inválidas' };
    }
    return {
      success: true,
      professor: valid,
      executedQuery: `SELECT id, senha_hash FROM security.Professores WHERE pessoa_id = ${body.pessoa_id}`
    };
  }

  @Get()
  findAll() {
    return this.professoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professoresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { especialidade: string; senha?: string }) {
    return this.professoresService.update(+id, body.especialidade, body.senha);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professoresService.remove(+id);
  }
}
