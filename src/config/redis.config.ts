import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ConnectionOptions } from "bullmq";
import type Redis from "ioredis";
import type { Cluster, RedisOptions } from "ioredis";

import { EnvKey } from "@app/config/env-key.enum";

const redisLogger = new Logger("Redis");

export function getRedisUrl(configService: ConfigService): string | undefined {
  return configService.get<string>(EnvKey.RedisUrl)?.trim() || undefined;
}

export function getRedisOptions(configService: ConfigService): RedisOptions {
  const redisUrl = getRedisUrl(configService);

  if (!redisUrl) {
    throw new Error("REDIS_URL is not configured");
  }

  return parseRedisUrl(redisUrl);
}

export function getBullMqRedisOptions(configService: ConfigService): ConnectionOptions {
  return getRedisOptions(configService) as ConnectionOptions;
}

export function attachRedisErrorLogger(client: Redis | Cluster): void {
  client.on("error", (error: Error) => {
    redisLogger.error(`Redis connection error: ${error.message}`);
  });
}

function parseRedisUrl(redisUrl: string): RedisOptions {
  const url = new URL(redisUrl);

  return {
    db: url.pathname.length > 1 ? Number(url.pathname.slice(1)) : undefined,
    host: url.hostname,
    password: url.password ? decodeURIComponent(url.password) : undefined,
    port: url.port ? Number(url.port) : 6379,
    username: url.username ? decodeURIComponent(url.username) : undefined,
  };
}
