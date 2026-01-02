import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('solicitudes') // Nombre de la tabla en Azure
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  category: string;

  @Column('text')
  description: string;

  @Column({ default: 'pendiente' })
  status: string; // pendiente, aprobada, rechazada

  @CreateDateColumn()
  createdAt: Date;
}