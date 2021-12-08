import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Blog Application')
  .setDescription('APIs for the example blog application.')
  .setVersion('3.0.0')
  // .setHost('localhost:3000')
  //.setBasePath('/')
  // .setSchemes('http')
  .setExternalDoc('For more information', 'http://swagger.io')
  .addTag('system', 'shorten-url')
  // .addBearerAuth('Authorization', 'header', 'apiKey')
  .build();
