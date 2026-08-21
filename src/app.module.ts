import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@nestjs-modules/ioredis";

import { AiModule } from "@app/ai/ai.module";
import { AuthModule } from "@app/auth/auth.module";
import { CacheModule } from "@app/cache/redis.module";
import { ConversationsModule } from "@app/conversations/conversations.module";
import {
  attachRedisErrorLogger,
  getRedisOptions,
  getRedisUrl,
} from "@app/config/redis.config";
import { PrismaModule } from "@app/prisma/prisma.module";
import { QueueModule } from "@app/queue/queue.module";
import { RefineModule } from "@app/refine/refine.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "single",
        onClientReady: attachRedisErrorLogger,
        url: getRedisUrl(configService),
        options: getRedisOptions(configService),
      }),
    }),
    PrismaModule,
    CacheModule,
    QueueModule,
    AuthModule,
    AiModule,
    RefineModule,
    ConversationsModule,
  ],
})
export class AppModule {}
