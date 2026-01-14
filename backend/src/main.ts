import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Erlaubt dem Frontend (Port 3001), das Backend (Port 3000) aufzurufen
  app.enableCors({
    origin: ['http://localhost:3001'],
    Credential: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
