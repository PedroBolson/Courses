import { Module } from '@nestjs/common';
import { InscricoesPalestrasService } from './inscricoes-palestras.service';
import { InscricoesPalestrasController } from './inscricoes-palestras.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InscricoesPalestrasController],
  providers: [InscricoesPalestrasService],
})
export class InscricoesPalestrasModule { }
