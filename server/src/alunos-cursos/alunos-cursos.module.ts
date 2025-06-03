import { Module } from '@nestjs/common';
import { AlunosCursosService } from './alunos-cursos.service';
import { AlunosCursosController } from './alunos-cursos.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AlunosCursosController],
  providers: [AlunosCursosService],
})
export class AlunosCursosModule { }
