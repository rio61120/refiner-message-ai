import { Body, Controller, InternalServerErrorException, Post, Res } from "@nestjs/common";
import type { Response } from "express";

import { SseEvent } from "@app/common/sse/sse-event.enum";
import { prepareSseResponse, writeSseEvent } from "@app/common/sse/sse-response.util";
import { RefineRequestDto } from "@app/refine/dto/refine-request.dto";
import { RefineService } from "@app/refine/refine.service";

@Controller("refine")
export class RefineController {
  constructor(private readonly refineService: RefineService) {}

  @Post()
  async refine(@Body() request: RefineRequestDto, @Res() response: Response): Promise<void> {
    prepareSseResponse(response);

    try {
      let hasResponseContent = false;

      for await (const chunk of this.refineService.streamRefinedMessage(request)) {
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
      const message = error instanceof Error ? error.message : "Unknown refine error";
      writeSseEvent(response, SseEvent.Error, { message });
    } finally {
      response.end();
    }
  }
}
