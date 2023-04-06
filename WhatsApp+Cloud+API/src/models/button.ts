/**
 * WhatsApp Cloud APILib
 *
 * This file was automatically generated by APIMATIC v3.0 ( https://www.apimatic.io ).
 */

import { lazy, object, Schema, string } from '../schema';
import { ButtonReply, buttonReplySchema } from './buttonReply';

export interface Button {
  type: string;
  reply: ButtonReply;
}

export const buttonSchema: Schema<Button> = object({
  type: ['type', string()],
  reply: ['reply', lazy(() => buttonReplySchema)],
});
