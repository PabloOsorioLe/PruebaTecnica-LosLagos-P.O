import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:4200', 
      'https://prueba-tecnica-los-lagos-p-o.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  
  // Agregamos '0.0.0.0' para que sea accesible externamente en la nube
  await app.listen(port, '0.0.0.0'); 
  
  logger.log(`Backend de GrupoLagos corriendo en el puerto: ${port}`);
}
bootstrap();