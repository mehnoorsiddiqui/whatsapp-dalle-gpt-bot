/**
 * OpenAI APILib
 *
 * This file was automatically generated by APIMATIC v3.0 ( https://www.apimatic.io ).
 */

import { object, optional, Schema, string } from '../schema';
import { RoleEnum, roleEnumSchema } from './roleEnum';

export interface ChatCompletionRequestMessage {
  role: RoleEnum;
  /** The contents of the message */
  content: string;
  /** The name of the user in a multi-user chat */
  name?: string;
}

export const chatCompletionRequestMessageSchema: Schema<ChatCompletionRequestMessage> = object(
  {
    role: ['role', roleEnumSchema],
    content: ['content', string()],
    name: ['name', optional(string())],
  }
);
