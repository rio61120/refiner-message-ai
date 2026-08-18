import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AiModule } from "@app/ai/ai.module";
import { AuthModule } from "@app/auth/auth.module";
import { PrismaModule } from "@app/prisma/prisma.module";
import { QueueModule } from "@app/queue/queue.module";
import { RefineModule } from "@app/refine/refine.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    QueueModule,
    AuthModule,
    AiModule,
    RefineModule
  ]
})
export class AppModule {}
