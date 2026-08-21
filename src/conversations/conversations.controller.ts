import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ConversationResponseDto,
  CreateConversationDto,
  MessageResponseDto,
} from "@app/conversations/dto/conversations.dto";
import { ConversationsService } from "@app/conversations/conversations.service";

@Controller("conversations")
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @Get()
  getConversations(): Promise<ConversationResponseDto[]> {
    return this.conversationService.getAllConversations();
  }

  @Post()
  createConversation(
    @Body() conversationData: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.createConversation(conversationData);
  }

  @Get("/:id")
  getConversationsById(
    @Param("id") id: string,
  ): Promise<ConversationResponseDto> {
    return this.conversationService.getConversationsById(id);
  }

  @Get("/:id/messages")
  getMessagesByConversationId(
    @Param("id") id: string,
  ): Promise<MessageResponseDto[]> {
    return this.conversationService.getMessagesByConId(id);
  }
}
