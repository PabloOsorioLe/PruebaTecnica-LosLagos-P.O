import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService - Algoritmo de Búsqueda Híbrida', () => {
  let service: ProductsService;
  let repo: any;
  let http: any;

  // Datos simulados para las pruebas
  const mockProduct = { barcode: '780000', name: 'Producto Local', environmentalImpact: 85 };
  const mockExternalData = {
    data: {
      status: 1,
      product: {
        product_name: 'Producto de Fallback',
        ecoscore_score: 45,
        ecoscore_grade: 'c'
      }
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn().mockImplementation(dto => dto), // Solución al error previo
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get(getRepositoryToken(Product));
    http = module.get(HttpService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('PLAN A: Debería retornar producto de la DB local si existe', async () => {
    repo.findOne.mockResolvedValue(mockProduct);

    const result = await service.findOne('780000');

    expect(result.name).toEqual('Producto Local');
    expect(http.get).not.toHaveBeenCalled(); // No debe consultar la API externa
  });

  it('PLAN B (Fallback): Debería buscar en Open Food Facts si no está en Azure', async () => {
    repo.findOne.mockResolvedValue(null); // Simula que no existe en DB local
    http.get.mockReturnValue(of(mockExternalData)); // Simula respuesta de API externa
    
    // Simulamos el guardado exitoso
    repo.save.mockResolvedValue({ 
      ...mockProduct, 
      name: 'Producto de Fallback' 
    });

    const result = await service.findOne('780000');

    expect(http.get).toHaveBeenCalled(); // Se activó el Fallback
    expect(repo.create).toHaveBeenCalled(); // Se instanció la entidad
    expect(repo.save).toHaveBeenCalled(); // Se persistió el nuevo producto
    expect(result.name).toEqual('Producto de Fallback');
  });
  
  it('FALLA TOTAL: Debería lanzar NotFoundException si no está en ninguna fuente', async () => {
    repo.findOne.mockResolvedValue(null); // No está en DB
    
    // Simulamos que la API responde status 0 (no encontrado)
    const mockNotFoundExternal = { data: { status: 0 } };
    http.get.mockReturnValue(of(mockNotFoundExternal));

    // Verificamos que lance la excepción correcta
    await expect(service.findOne('999999'))
      .rejects
      .toThrow(NotFoundException);
  });
}); 