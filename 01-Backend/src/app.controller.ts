import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Este endpoint responderá en: GET /api
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // NUEVO: Este endpoint responde: GET /api/healthz en cronJob
  @Get('healthz')
  checkHealth() {
    return {
      status: 'ok',
      service: 'GrupoLagos-Backend',
      timestamp: new Date().toISOString()
    };
  }
}