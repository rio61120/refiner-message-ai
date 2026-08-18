import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EnvKey } from "@app/config/env-key.enum";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>(EnvKey.RedisHost) || "localhost",
          port: Number(configService.get<string>(EnvKey.RedisPort) || 6379),
          password: configService.get<string>(EnvKey.RedisPassword) || undefined
        }
      })
    })
  ],
  exports: [BullModule]
})
export class QueueModule {}
