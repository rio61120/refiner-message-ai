import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { EnvKey } from "@app/config/env-key.enum";
import { AiProvider } from "@app/ai/llm/ai-provider.enum";
import { DEFAULT_AI_MODEL, DEFAULT_AI_PROVIDER, STREAM_TEMPERATURE } from "@app/ai/llm/llm.constants";

@Injectable()
export class LlmService {
  private readonly openai?: OpenAI;
  private readonly model: string;
  private readonly provider: AiProvider;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(EnvKey.AiApiKey);
    const baseURL = this.configService.get<string>(EnvKey.AiBaseUrl);
    this.provider = this.resolveProvider();

    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
        baseURL: this.provider === AiProvider.OpenAiCompatible ? baseURL : undefined
      });
    }

    this.model = this.configService.get<string>(EnvKey.AiModel) || DEFAULT_AI_MODEL;
  }

  async *stream(messages: ChatCompletionMessageParam[]): AsyncIterable<string> {
    if (!this.openai) {
      throw new InternalServerErrorException("AI_API_KEY is not configured");
    }

    if (this.provider === AiProvider.OpenAiCompatible && !this.configService.get<string>(EnvKey.AiBaseUrl)) {
      throw new InternalServerErrorException("AI_BASE_URL is required when AI_PROVIDER is openai-compatible");
    }

    const stream = await this.openai.chat.completions.create({
      model: this.model,
      messages,
      temperature: STREAM_TEMPERATURE,
      stream: true
    });

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content;

      if (content) {
        yield content;
      }
    }
  }

  private resolveProvider(): AiProvider {
    const provider = this.configService.get<string>(EnvKey.AiProvider) || DEFAULT_AI_PROVIDER;

    if (Object.values(AiProvider).includes(provider as AiProvider)) {
      return provider as AiProvider;
    }

    throw new InternalServerErrorException(`Unsupported AI_PROVIDER: ${provider}`);
  }
}
