import { Controller, Get, Post, Body } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';

@Controller('solicitudes') // Escucha en /api/solicitudes
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() data: any) {
    return this.solicitudesService.create(data);
  }

  @Get()
  findAll() {
    return this.solicitudesService.findAll();
  }
}