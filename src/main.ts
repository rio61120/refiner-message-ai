import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NextFunction, Request, Response } from "express";

import { AppModule } from "@app/app.module";
import { DEFAULT_HOST, DEFAULT_PORT } from "@app/config/app.constants";
import { EnvKey } from "@app/config/env-key.enum";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use((request: Request, response: Response, next: NextFunction) => {
    const requestedHeaders = request.headers["access-control-request-headers"];

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.setHeader(
      "Access-Control-Allow-Headers",
      typeof requestedHeaders === "string"
        ? requestedHeaders
        : "Content-Type, Accept, Authorization, X-Requested-With"
    );
    response.setHeader("Access-Control-Allow-Private-Network", "true");

    if (request.method === "OPTIONS") {
      response.status(204).end();
      return;
    }

    next();
  });

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["*"],
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
  await app.listen(port, DEFAULT_HOST);
}

void bootstrap();
