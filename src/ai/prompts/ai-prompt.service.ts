import { Injectable } from "@nestjs/common";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export interface AiPromptInput {
  systemPrompt: string;
  userPrompt: string;
}

@Injectable()
export class AiPromptService {
  buildMessages(input: AiPromptInput): ChatCompletionMessageParam[] {
    return [
      {
        role: "system",
        content: input.systemPrompt
      },
      {
        role: "user",
        content: input.userPrompt
      }
    ];
  }
}
