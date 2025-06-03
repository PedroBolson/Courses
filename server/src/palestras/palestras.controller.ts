import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PalestrasService } from './palestras.service';

@Controller('palestras')
export class PalestrasController {
  constructor(private palestrasService: PalestrasService) { }

  @Post()
  create(
    @Body()
    body: {
      titulo: string;
      descricao: string;
      data_hora: string;
      local: string;
      convidado_id: number;
      area_id: number;
    }
  ) {
    return this.palestrasService.create(
      body.titulo,
      body.descricao,
      body.data_hora,
      body.local,
      body.convidado_id,
      body.area_id
    );
  }

  @Get()
  findAll() {
    return this.palestrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.palestrasService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      titulo: string;
      descricao: string;
      data_hora: string;
      local: string;
      convidado_id: number;
      area_id: number;
    }
  ) {
    return this.palestrasService.update(
      +id,
      body.titulo,
      body.descricao,
      body.data_hora,
      body.local,
      body.convidado_id,
      body.area_id
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.palestrasService.remove(+id);
  }
}
