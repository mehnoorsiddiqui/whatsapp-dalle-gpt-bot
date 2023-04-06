/**
 * WhatsApp Cloud APILib
 *
 * This file was automatically generated by APIMATIC v3.0 ( https://www.apimatic.io ).
 */

import { Schema, stringEnum } from '../schema';

/**
 * Enum for PhoneTypeEnum
 */
export enum PhoneTypeEnum {
  HOME = 'HOME',
  WORK = 'WORK',
  CELL = 'CELL',
  MAIN = 'MAIN',
  IPHONE = 'IPHONE',
}

/**
 * Schema for PhoneTypeEnum
 */
export const phoneTypeEnumSchema: Schema<PhoneTypeEnum> = stringEnum(PhoneTypeEnum);
