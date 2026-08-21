import { Module } from "@nestjs/common";

import { CacheModule } from "@app/cache/redis.module";

import { ConversationsService } from "./conversations.service";
import { ConversationsController } from "./conversations.controller";

@Module({
  imports: [CacheModule],
  providers: [ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
