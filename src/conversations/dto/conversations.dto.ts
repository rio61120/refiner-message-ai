import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateConversationDto {
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export interface ConversationResponseDto {
  id: string;
  userId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class MessageResponseDto {
  id: string;
  conversationId: string;
  role: "SYSTEM" | "USER" | "ASSISTANT";
  content: string;
  createdAt: Date;
}
