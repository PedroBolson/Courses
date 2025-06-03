import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AdminModule } from './admin/admin.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { AlunosModule } from './alunos/alunos.module';
import { ProfessoresModule } from './professores/professores.module';
import { AreasModule } from './areas/areas.module';
import { CursosModule } from './cursos/cursos.module';
import { AlunosCursosModule } from './alunos-cursos/alunos-cursos.module';
import { PalestrasModule } from './palestras/palestras.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { VwController } from './vw/vw.controller';
import { VwModule } from './vw/vw.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AdminModule,
    PessoasModule,
    AlunosModule,
    ProfessoresModule,
    AreasModule,
    CursosModule,
    AlunosCursosModule,
    PalestrasModule,
    PagamentosModule,
    VwModule
  ],
  controllers: [AppController, VwController],
  providers: [AppService],
})
export class AppModule { }
