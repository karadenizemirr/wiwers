import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import { AppDataSource } from "./customService/mysql.service";
import secureSession from '@fastify/secure-session'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors()
  AppDataSource.initialize().then(() => console.log('Database connected')).catch((err) => console.log(err));
  app.useStaticAssets({
    root: join(__dirname, '..', 'src/assets/public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'src/assets/views'),
    layout: 'layout/main',
  });
  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    cookieName: 'Procfile',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 // 7 days
    }
    // TODO: add date helpers
  });
  await app.listen(3000);
}
bootstrap();