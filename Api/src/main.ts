import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir solicitações de um domínio específico
  app.enableCors({
    origin: 'http://localhost:5173',  // Domínio que pode fazer requisições
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permite enviar cookies ou cabeçalhos de autenticação
  });

  await app.listen(process.env.PORT ?? 3000);  // Escuta na porta configurada ou 3000 por padrão
}

bootstrap();
