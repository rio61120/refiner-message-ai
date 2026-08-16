import { Injectable } from "@nestjs/common";

import { RefineRequestDto } from "@app/refine/dto/refine-request.dto";
import { RefineAction } from "@app/refine/enums/refine-action.enum";
import { LlmRefineService } from "@app/refine/llm/llm-refine.service";
import { buildRefineMessages } from "@app/refine/prompts/refine.prompt";

@Injectable()
export class RefineService {
  constructor(private readonly llmRefineService: LlmRefineService) {}

  async *streamRefinedMessage(request: RefineRequestDto): AsyncIterable<string> {
    const messages = buildRefineMessages({
      action: request.action,
      message: request.message,
      targetLanguage: request.targetLanguage
    });

    yield* this.llmRefineService.stream(messages);
  }

  getSupportedActions(): RefineAction[] {
    return Object.values(RefineAction);
  }
}
