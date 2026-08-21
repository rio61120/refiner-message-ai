import { Global, Module } from "@nestjs/common";
import { CacheService } from "@app/cache/redis.service";

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
