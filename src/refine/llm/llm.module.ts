import { Module } from "@nestjs/common";

import { LlmRefineService } from "@app/refine/llm/llm-refine.service";

@Module({
  providers: [LlmRefineService],
  exports: [LlmRefineService]
})
export class LlmModule {}
