import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class CheckFontsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  fonts: string[];
}

export type FontCheckResult = {
  font: string;
  links?: {
    'google-font'?: string;
    'adobe-font'?: string;
  };
  status: 'found' | 'not found';
};

export type GoogleFontItem = {
  family: string;
  [key: string]: unknown;
};

export type GoogleFontsApiResponse = {
  items?: GoogleFontItem[];
};

export type AdobeFontFamily = {
  id: string;
  name: string;
  slug: string;
  web_link: string;
  [key: string]: unknown;
};

export type AdobeFontsApiResponse = {
  family: AdobeFontFamily;
};
