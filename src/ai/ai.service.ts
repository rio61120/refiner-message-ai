import { Injectable } from "@nestjs/common";

import { AiChatRequestDto } from "@app/ai/dto/ai-chat-request.dto";
import { LlmService } from "@app/ai/llm/llm.service";
import { AiPromptInput, AiPromptService } from "@app/ai/prompts/ai-prompt.service";

const DEFAULT_SYSTEM_PROMPT = "You are warriorAI, a helpful AI assistant. Answer clearly and directly.";

@Injectable()
export class AiService {
  constructor(
    private readonly llmService: LlmService,
    private readonly promptService: AiPromptService
  ) {}

  streamPrompt(input: AiPromptInput): AsyncIterable<string> {
    return this.llmService.stream(this.promptService.buildMessages(input));
  }

  streamChat(request: AiChatRequestDto): AsyncIterable<string> {
    return this.streamPrompt({
      systemPrompt: request.systemPrompt || DEFAULT_SYSTEM_PROMPT,
      userPrompt: request.prompt
    });
  }
}
