import { Module } from '@nestjs/common';
import { VwController } from './vw.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [VwController],
})
export class VwModule { }
