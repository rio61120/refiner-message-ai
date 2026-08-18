import { Module } from "@nestjs/common";

import { AiModule } from "@app/ai/ai.module";
import { RefineController } from "@app/refine/refine.controller";
import { RefineService } from "@app/refine/refine.service";

@Module({
  imports: [AiModule],
  controllers: [RefineController],
  providers: [RefineService]
})
export class RefineModule {}
