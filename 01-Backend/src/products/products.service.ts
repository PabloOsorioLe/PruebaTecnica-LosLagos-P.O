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

  // --- Métodos CRUD básicos 
  create(createProductDto: CreateProductDto) {
    const newProduct = this.productRepository.create(createProductDto);
    return this.productRepository.save(newProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Producto #${id} no encontrado`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) throw new NotFoundException(`Producto #${id} no encontrado`);
    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  // --- Lógica (Scanner y Seed) ---
  async findByBarcode(barcode: string): Promise<Product> {
    let product = await this.productRepository.findOne({ where: { barcode } });
    if (product) return product;

    try {
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      const { data } = await firstValueFrom(this.httpService.get(url));

      if (data.status === 1) {
        const newProduct = this.productRepository.create({
          barcode: barcode,
          name: data.product.product_name || 'Producto Desconocido',
          price: Number((Math.random() * 5000).toFixed(0)), // Precio simulado
          category: data.product.categories?.split(',')[0] || 'General',
          environmentalImpact: data.product.ecoscore_score || 50,
          socialImpact: 70,
          isSustainable: (data.product.ecoscore_grade === 'a' || data.product.ecoscore_grade === 'b'),
        });
        return await this.productRepository.save(newProduct);
      }
    } catch (error) {
      console.error('Error llamando a API externa', error);
    }
    throw new NotFoundException(`Producto con barcode ${barcode} no encontrado`);
  }

  async seedDatabase() {
    const count = await this.productRepository.count();
    if (count > 0) return { message: 'La base de datos ya tiene datos.' };

    const seedProducts = [
      { name: 'Leche Organica', barcode: '7801234567890', price: 1200, category: 'Lacteos', environmentalImpact: 90, socialImpact: 85, isSustainable: true },
      { name: 'Detergente Quimico', barcode: '7809876543210', price: 3500, category: 'Limpieza', environmentalImpact: 20, socialImpact: 40, isSustainable: false },
      { name: 'Cafe de Comercio Justo', barcode: '7805556667770', price: 4500, category: 'Despensa', environmentalImpact: 85, socialImpact: 95, isSustainable: true },
    ];

    await this.productRepository.save(seedProducts);
    return { message: 'Seed completado con éxito', count: seedProducts.length };
  }
  
  async getImpactStats() {
  const products = await this.productRepository.find();
  const total = products.length;
  
  if (total === 0) return { avgEco: 0, sustainableCount: 0, avgSocial: 0, total: 0 };

  const sustainableCount = products.filter(p => p.isSustainable).length;
  const avgEco = products.reduce((acc, p) => acc + p.environmentalImpact, 0) / total;
  const avgSocial = products.reduce((acc, p) => acc + (p.socialImpact || 0), 0) / total;

  return {
    avgEco: Math.round(avgEco),
    avgSocial: Math.round(avgSocial),
    sustainableCount,
    totalProducts: total,
    // Cálculo de ahorro: diferencia promedio entre productos sostenibles vs resto
    estimatedSavings: total * 150 // Simulación de ahorro por cada elección verde
  };
}
}