/**
 * WhatsApp Cloud APILib
 *
 * This file was automatically generated by APIMATIC v3.0 ( https://www.apimatic.io ).
 */

import { Schema, stringEnum } from '../schema';

/**
 * Enum for ParameterTypeEnum
 */
export enum ParameterTypeEnum {
  Text = 'text',
  Currency = 'currency',
  DateTime = 'date_time',
  Image = 'image',
  Document = 'document',
  Video = 'video',
}

/**
 * Schema for ParameterTypeEnum
 */
export const parameterTypeEnumSchema: Schema<ParameterTypeEnum> = stringEnum(ParameterTypeEnum);
