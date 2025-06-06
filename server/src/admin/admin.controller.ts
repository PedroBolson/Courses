import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get()
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.adminService.registerAdmin(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const valid = await this.adminService.validateLogin(body.username, body.password);
    if (!valid) {
      return { success: false, message: 'Credenciais inválidas' };
    }
    return {
      success: true,
      admin: valid,
      executedQuery: `SELECT * FROM security.Admins WHERE username = '${body.username}'`
    };
  }

  @Put(':id')
  async updateAdmin(@Param('id') id: string, @Body() body: { username: string; password?: string }) {
    return this.adminService.updateAdmin(parseInt(id), body.username, body.password);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(parseInt(id));
  }
}
