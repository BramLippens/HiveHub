import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix for API versioning
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000/api/v1`);
}
bootstrap();
