import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Prefijo global para que los endpoints sean /api/...
  app.setGlobalPrefix('api');

  // 2. CORS: Permitimos solo a frontend de Vercel
  app.enableCors({
    origin: [
      'http://localhost:4200', 
      'https://prueba-tecnica-los-lagos-p-o.vercel.app' // URL que me enviaste
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. PUERTO: Obligatorio para Render (usan variables de entorno)
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  logger.log(`Backend de GrupoLagos corriendo en el puerto: ${port}`);
}
bootstrap();