import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  barcode: string; 

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; 

  @Column()
  category: string; 

  @Column('float', { default: 0 })
  environmentalImpact: number; 

  @Column('float', { default: 0 })
  socialImpact: number; 

  @Column({ default: true })
  isSustainable: boolean;

  @CreateDateColumn()
  createdAt: Date;
}