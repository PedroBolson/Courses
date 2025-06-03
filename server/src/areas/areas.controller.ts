import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private areasService: AreasService) { }

  @Post()
  create(@Body() body: { nome_area: string; descricao: string }) {
    return this.areasService.create(body.nome_area, body.descricao);
  }

  @Get()
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { nome_area: string; descricao: string }) {
    return this.areasService.update(+id, body.nome_area, body.descricao);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
