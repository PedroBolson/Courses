import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module'; // Importe o DatabaseModule
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
