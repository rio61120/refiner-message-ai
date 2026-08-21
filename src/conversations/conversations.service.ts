import { PrismaService } from "@app/prisma/prisma.service";
import { CacheService } from "@app/cache/redis.service";
import {
  ConversationResponseDto,
  CreateConversationDto,
  MessageResponseDto,
} from "@app/conversations/dto/conversations.dto";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async getAllConversations(): Promise<ConversationResponseDto[]> {
    try {
      const cachedConversations =
        await this.cacheService.getCache<ConversationResponseDto[]>(
          "all_conversations",
        );
      if (cachedConversations) {
        return cachedConversations;
      }
      this.cacheService.setCache(
        "all_conversations",
        await this.prisma.conversation.findMany(),
        300,
      );
      return await this.prisma.conversation.findMany();
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to get all conversations" + error,
      );
    }
  }

  async createConversation(
    dto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    try {
      const response = await this.prisma.conversation.create({
        data: dto,
      });
      await this.cacheService.setCache(
        this.getConversationCacheKey(response.id),
        response,
        300,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to create conversation" + error,
      );
    }
  }

  async getConversationsById(id: string): Promise<ConversationResponseDto> {
    try {
      const cachedConKey = this.getConversationCacheKey(id);
      const cachedConversation =
        await this.cacheService.getCache<ConversationResponseDto>(cachedConKey);
      if (cachedConversation) {
        return cachedConversation;
      }
      const response = await this.prisma.conversation.findUnique({
        where: { id },
      });

      if (!response) {
        throw new NotFoundException(`Conversation not found with id: ${id}`);
      }
      await this.cacheService.setCache(cachedConKey, response, 300); // Cache for 5 minutes
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Failed to get conversation by id" + error,
      );
    }
  }

  async getMessagesByConId(
    conversationId: string,
  ): Promise<MessageResponseDto[]> {
    try {
      const response = await this.prisma.message.findMany({
        where: { conversationId },
      });

      if (!response || response.length === 0) {
        throw new NotFoundException(
          `No messages found for conversation id: ${conversationId}`,
        );
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Failed to get messages by conversation id" + error,
      );
    }
  }

  private getConversationCacheKey(id: string): string {
    return `conversation:${id}`;
  }
}
