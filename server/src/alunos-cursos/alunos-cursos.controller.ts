import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AlunosCursosService } from './alunos-cursos.service';

@Controller('alunos-cursos')
export class AlunosCursosController {
  constructor(private alunosCursosService: AlunosCursosService) { }

  @Post()
  create(@Body() body: { aluno_id: number; curso_id: number }) {
    return this.alunosCursosService.create(body.aluno_id, body.curso_id);
  }

  @Get()
  findAll() {
    return this.alunosCursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosCursosService.findOne(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.alunosCursosService.updateStatus(+id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alunosCursosService.remove(+id);
  }
}
