import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingIncomingHTTPRequestInterceptor } from './common/custom-decorators/logging-incoming-http-interceptor.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new LoggingIncomingHTTPRequestInterceptor());
  await app.listen(3000);
}
bootstrap();
