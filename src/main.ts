import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenerateService } from './generate/generate.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(GenerateService).init();
  await app.listen(3000);
}
bootstrap();
