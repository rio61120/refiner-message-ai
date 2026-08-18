import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AiChatRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  systemPrompt?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(12000)
  prompt!: string;
}
