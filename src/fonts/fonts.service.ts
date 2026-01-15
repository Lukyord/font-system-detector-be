import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface FontCheckResult {
  font: string;
  link?: string;
  status: 'found' | 'not found';
}

@Injectable()
export class FontsService {
  private readonly googleFontsApiUrl =
    'https://www.googleapis.com/webfonts/v1/webfonts';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_FONTS_API_KEY') || '';
  }

  async checkFonts(fontNames: string[]): Promise<FontCheckResult[]> {
    const results: FontCheckResult[] = [];

    for (const fontName of fontNames) {
      try {
        const requestUrl = `${this.googleFontsApiUrl}?family=${fontName}&key=${this.apiKey}`;

        const response = await firstValueFrom(
          this.httpService.get(this.googleFontsApiUrl, {
            params: {
              family: fontName,
              key: this.apiKey,
            },
          }),
        );

        const items = response.data?.items || [];
        const foundFont = items.find(
          (item: any) => item.family.toLowerCase() === fontName.toLowerCase(),
        );

        if (foundFont) {
          const link = `https://fonts.google.com/specimen/${encodeURIComponent(fontName)}`;
          results.push({
            font: fontName,
            link,
            status: 'found',
          });
        } else {
          results.push({
            font: fontName,
            status: 'not found',
          });
        }
      } catch (error) {
        results.push({
          font: fontName,
          status: 'not found',
        });
      }
    }

    return results;
  }
}
