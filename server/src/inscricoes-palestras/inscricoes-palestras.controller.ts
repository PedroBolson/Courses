import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, BadRequestException } from '@nestjs/common';
import { InscricoesPalestrasService } from './inscricoes-palestras.service';

@Controller('inscricoes-palestras')
export class InscricoesPalestrasController {
  constructor(private readonly inscricoesPalestrasService: InscricoesPalestrasService) { }

  @Post()
  async create(@Body() body: { palestra_id: number; nome: string; email: string }) {
    // Verificar se os campos obrigatórios estão presentes
    if (!body.palestra_id || !body.nome || !body.email) {
      throw new BadRequestException('Os campos palestra_id, nome e email são obrigatórios');
    }

    // Verificar se o email já está inscrito nesta palestra
    const existingInscricao = await this.inscricoesPalestrasService.findByEmailAndPalestra(body.email, body.palestra_id);
    if (existingInscricao.rows && existingInscricao.rows.length > 0) {
      throw new BadRequestException('Este email já está inscrito nesta palestra');
    }

    return this.inscricoesPalestrasService.create(
      body.palestra_id,
      body.nome,
      body.email
    );
  }

  @Get()
  findAll() {
    return this.inscricoesPalestrasService.findAll();
  }

  @Get('palestra/:palestraId')
  findByPalestra(@Param('palestraId') palestraId: string) {
    return this.inscricoesPalestrasService.findByPalestraId(+palestraId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inscricoesPalestrasService.findOne(+id);
  }



  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { nome?: string; email?: string }
  ) {
    return this.inscricoesPalestrasService.update(
      +id,
      body.nome,
      body.email
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inscricoesPalestrasService.remove(+id);
  }
}
