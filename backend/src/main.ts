import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGracefulShutdown } from 'nestjs-graceful-shutdown';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupGracefulShutdown({ app });
  await app.listen(3001);
}
bootstrap();
