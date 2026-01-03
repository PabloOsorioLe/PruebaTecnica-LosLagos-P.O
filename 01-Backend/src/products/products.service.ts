import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly httpService: HttpService,
  ) {}

  // --- MÉTODOS CRUD ESTÁNDAR ---

  create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  /**
   * findOne: Implementa el Algoritmo de Búsqueda Híbrida (Scanner)
   */
  async findOne(barcode: string): Promise<Product> {
    // 1. PLAN A: Buscar en la base de datos local (Azure PostgreSQL)
    let product = await this.productRepository.findOne({ where: { barcode } });
    if (product) return product;

    // 2. PLAN B (Fallback): Buscar en Open Food Facts si no existe localmente
    try {
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      const { data } = await firstValueFrom(this.httpService.get(url));

      if (data && data.status === 1) {
        // 3. SINCRONIZACIÓN: Persistir automáticamente el producto externo en nuestra DB
        const newProduct = this.productRepository.create({
          barcode: barcode,
          name: data.product.product_name || 'Producto Externo',
          price: Number((Math.random() * 5000).toFixed(0)), // Precio simulado para el test
          category: data.product.categories?.split(',')[0] || 'Importado',
          environmentalImpact: data.product.ecoscore_score || 50,
          socialImpact: 70,
          isSustainable: (data.product.ecoscore_grade === 'a' || data.product.ecoscore_grade === 'b'),
        });
        
        return await this.productRepository.save(newProduct);
      }
    } catch (error) {
      console.error('Error en el mecanismo de Fallback (API Externa):', error);
    }

    // 4. Si fallan ambos planes, lanzamos la excepción que el test espera capturar
    throw new NotFoundException(`Producto #${barcode} no encontrado en ninguna fuente`);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException(`Producto con ID #${id} no encontrado`);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    // Para el borrado usamos el ID interno de la DB
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Producto con ID #${id} no encontrado`);
    return this.productRepository.remove(product);
  }

  // --- LÓGICA ESPECÍFICA (Scanner y Seed) ---

  async findByBarcode(barcode: string): Promise<Product> {
    // Reutilizamos la lógica híbrida de findOne
    return this.findOne(barcode);
  }

  async seedDatabase() {
    const count = await this.productRepository.count();
    if (count > 0) return { message: 'La base de datos ya tiene datos iniciales.' };

    const seedProducts = [
      { name: 'Leche Organica', barcode: '7801234567890', price: 1200, category: 'Lacteos', environmentalImpact: 90, socialImpact: 85, isSustainable: true },
      { name: 'Detergente Quimico', barcode: '7809876543210', price: 3500, category: 'Limpieza', environmentalImpact: 20, socialImpact: 40, isSustainable: false },
      { name: 'Cafe de Comercio Justo', barcode: '7805556667770', price: 4500, category: 'Despensa', environmentalImpact: 85, socialImpact: 95, isSustainable: true },
    ];

    await this.productRepository.save(seedProducts);
    return { message: 'Seed de GrupoLagos completado con éxito', count: seedProducts.length };
  }

  async getImpactStats() {
    const products = await this.productRepository.find();
    const total = products.length;

    if (total === 0) return { avgEco: 0, sustainableCount: 0, avgSocial: 0, totalProducts: 0 };

    const sustainableCount = products.filter(p => p.isSustainable).length;
    const avgEco = products.reduce((acc, p) => acc + (p.environmentalImpact || 0), 0) / total;
    const avgSocial = products.reduce((acc, p) => acc + (p.socialImpact || 0), 0) / total;

    return {
      avgEco: Math.round(avgEco),
      avgSocial: Math.round(avgSocial),
      sustainableCount,
      totalProducts: total,
      estimatedSavings: total * 150 // Incentivo por producto registrado
    };
  }
}