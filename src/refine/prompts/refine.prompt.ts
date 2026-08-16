import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { DEFAULT_TARGET_LANGUAGE } from "@app/refine/refine.constants";
import { RefineAction } from "@app/refine/enums/refine-action.enum";

interface BuildRefineMessagesInput {
  action: RefineAction;
  message: string;
  targetLanguage?: string;
}

const SYSTEM_PROMPT = [
  "You are Rio Refiner, a precise writing assistant embedded in a chat composer.",
  "Return only the refined message text. Do not add explanations, labels, markdown fences, greetings, or alternatives.",
  "Preserve the user's intent, names, URLs, code snippets, ticket IDs, emojis, and line breaks unless they are clearly incorrect.",
  "Keep the tone natural for workplace chat: concise, clear, and polite."
].join(" ");

const ACTION_INSTRUCTIONS: Record<RefineAction, string> = {
  [RefineAction.Grammar]:
    "Fix spelling, grammar, punctuation, and awkward phrasing while preserving the original language and meaning.",
  [RefineAction.Translate]:
    "Translate the message into the requested target language. Preserve URLs, IDs, mentions, and product names exactly."
};

export function buildRefineMessages(input: BuildRefineMessagesInput): ChatCompletionMessageParam[] {
  const targetLanguage = input.targetLanguage || DEFAULT_TARGET_LANGUAGE;
  const actionInstruction =
    input.action === RefineAction.Translate
      ? `${ACTION_INSTRUCTIONS[input.action]} Target language: ${targetLanguage}.`
      : ACTION_INSTRUCTIONS[input.action];

  return [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    {
      role: "user",
      content: `${actionInstruction}\n\nMessage:\n${input.message}`
    }
  ];
}
