import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configService } from './database/configurations/database.config';
// import * as bodyParser from 'body-parser';

async function bootstrap() {
  const APP = await NestFactory.create(AppModule);
  const PORT = Number(configService.getPort());

  // global prefix
  APP.setGlobalPrefix('api/v1');
  APP.enableCors();

  // APP.use(bodyParser.json({ limit: '50mb' }));
  // APP.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // APP.use(express.json());
  // APP.use(express.urlencoded({ extended: true }));

  APP.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const documentConfig = new DocumentBuilder()
    .setTitle('FunPlay - FunPlay Game Backend')
    .setDescription('The FunPlay - FunPlay Game Backend')
    .setVersion('1.0')
    .addTag('PIP')
    .build();
  const document = SwaggerModule.createDocument(APP, documentConfig);
  SwaggerModule.setup('api', APP, document);

  await APP.listen(PORT, () => {
    console.log('[WEB]', `http://127.0.0.1:${PORT}`);
  });
}

bootstrap();
