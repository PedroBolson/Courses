import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

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
}
