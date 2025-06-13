import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) { }

  @Post()
  create(@Body() body: { alunosCursosId: number; avaliacao: number; comentario?: string }) {
    return this.feedbackService.create(body.alunosCursosId, body.avaliacao, body.comentario);
  }

  @Get()
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get('aluno-curso/:alunosCursosId')
  findByAlunoCurso(@Param('alunosCursosId') alunosCursosId: string) {
    return this.feedbackService.findByAlunoCurso(+alunosCursosId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { avaliacao?: number; comentario?: string }) {
    return this.feedbackService.update(+id, body.avaliacao, body.comentario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }
}
