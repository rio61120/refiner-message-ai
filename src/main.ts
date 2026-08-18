import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "@app/app.module";
import { DEFAULT_HOST, DEFAULT_PORT } from "@app/config/app.constants";
import { EnvKey } from "@app/config/env-key.enum";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "Content-Type"],
    optionsSuccessStatus: 204,
    credentials: false
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  );

  const port = configService.get<number>(EnvKey.Port) || DEFAULT_PORT;
  const host = configService.get<string>(EnvKey.Host) || DEFAULT_HOST;

  await app.listen(port, host);
}

void bootstrap();
