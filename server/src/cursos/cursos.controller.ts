import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CursosService } from './cursos.service';

@Controller('cursos')
export class CursosController {
  constructor(private cursosService: CursosService) { }

  @Post()
  create(
    @Body()
    body: { titulo: string; descricao: string; professor_id: number; area_id: number }
  ) {
    return this.cursosService.create(
      body.titulo,
      body.descricao,
      body.professor_id,
      body.area_id
    );
  }

  @Get()
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: { titulo: string; descricao: string; professor_id: number; area_id: number }
  ) {
    return this.cursosService.update(
      +id,
      body.titulo,
      body.descricao,
      body.professor_id,
      body.area_id
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }
}
