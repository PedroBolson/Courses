import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private pagamentosService: PagamentosService) { }

  @Post()
  create(@Body() body: { aluno_id: number; valor: number; forma_pagamento: string }) {
    return this.pagamentosService.create(body.aluno_id, body.valor, body.forma_pagamento);
  }

  @Get()
  findAll() {
    return this.pagamentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.pagamentosService.updateStatus(+id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagamentosService.remove(+id);
  }
}
