import { Body, Controller, InternalServerErrorException, Post, Res } from "@nestjs/common";
import type { Response } from "express";

import { AiService } from "@app/ai/ai.service";
import { AiChatRequestDto } from "@app/ai/dto/ai-chat-request.dto";
import { SseEvent } from "@app/common/sse/sse-event.enum";
import { prepareSseResponse, writeSseEvent } from "@app/common/sse/sse-response.util";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("chat")
  async chat(@Body() request: AiChatRequestDto, @Res() response: Response): Promise<void> {
    prepareSseResponse(response);

    try {
      let hasResponseContent = false;

      for await (const chunk of this.aiService.streamChat(request)) {
        if (chunk.trim().length > 0) {
          hasResponseContent = true;
        }

        writeSseEvent(response, SseEvent.Delta, { text: chunk });
      }

      if (!hasResponseContent) {
        throw new InternalServerErrorException("AI provider returned an empty response");
      }

      writeSseEvent(response, SseEvent.Done, { ok: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown AI error";
      writeSseEvent(response, SseEvent.Error, { message });
    } finally {
      response.end();
    }
  }
}
