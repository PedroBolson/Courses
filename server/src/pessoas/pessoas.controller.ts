import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PessoasService } from './pessoas.service';

@Controller('pessoas')
export class PessoasController {
  constructor(private pessoasService: PessoasService) { }

  @Post()
  create(@Body() body: { nome: string; email: string; telefone?: string }) {
    return this.pessoasService.create(body.nome, body.email, body.telefone || '');
  }

  @Get()
  findAll() {
    return this.pessoasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { nome: string; email: string; telefone?: string }) {
    return this.pessoasService.update(+id, body.nome, body.email, body.telefone || '');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoasService.remove(+id);
  }
}
