import { Module } from "@nestjs/common";

import { AiController } from "@app/ai/ai.controller";
import { AiService } from "@app/ai/ai.service";
import { LlmService } from "@app/ai/llm/llm.service";
import { AiPromptService } from "@app/ai/prompts/ai-prompt.service";

@Module({
  controllers: [AiController],
  providers: [AiService, AiPromptService, LlmService],
  exports: [AiService, AiPromptService, LlmService]
})
export class AiModule {}
