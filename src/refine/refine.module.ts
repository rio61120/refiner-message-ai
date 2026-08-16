import { Module } from "@nestjs/common";

import { LlmModule } from "@app/refine/llm/llm.module";
import { RefineController } from "@app/refine/refine.controller";
import { RefineService } from "@app/refine/refine.service";

@Module({
  imports: [LlmModule],
  controllers: [RefineController],
  providers: [RefineService]
})
export class RefineModule {}
