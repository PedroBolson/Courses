import { Module } from '@nestjs/common';
import { PalestrasService } from './palestras.service';
import { PalestrasController } from './palestras.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PalestrasController],
  providers: [PalestrasService],
})
export class PalestrasModule { }
