import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Short Url System')
  .setDescription("Short Url APIs for bigzero's the example system.")
  .setVersion('3.0.0')
  // .setHost('localhost:3000')
  //.setBasePath('/')
  // .setSchemes('http')
  .setExternalDoc('For more information', 'http://swagger.io')
  .addTag('Application', 'shorten-url')
  // .addBearerAuth('Authorization', 'header', 'apiKey')
  .build();
