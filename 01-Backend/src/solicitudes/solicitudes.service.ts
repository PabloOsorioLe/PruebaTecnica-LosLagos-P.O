import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitud.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepository: Repository<Solicitud>,
  ) {}

  // Guarda la solicitud en la base de datos
  async create(data: any) {
    const nuevaSolicitud = this.solicitudRepository.create(data);
    return await this.solicitudRepository.save(nuevaSolicitud);
  }

  // Lista todas para ver el historial
  async findAll() {
    return await this.solicitudRepository.find({
      order: { createdAt: 'DESC' }
    });
  }
}