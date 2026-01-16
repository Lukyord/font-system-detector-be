import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  FontCheckResult,
  GoogleFontItem,
  GoogleFontsApiResponse,
  AdobeFontsApiResponse,
} from './dto/check-fonts.dto';

@Injectable()
export class FontsService {
  private readonly googleFontsApiUrl =
    'https://www.googleapis.com/webfonts/v1/webfonts';
  private readonly adobeFontsApiUrl =
    'https://typekit.com/api/v1/json/families';
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('GOOGLE_FONTS_API_KEY') || '';
  }

  private async checkGoogleFont(fontName: string): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.googleFontsApiUrl, {
          params: {
            family: fontName,
            key: this.apiKey,
          },
        }),
      );

      const data = response.data as GoogleFontsApiResponse | undefined;
      const items: GoogleFontItem[] = data?.items || [];
      const foundFont = items.find(
        (item) => item.family.toLowerCase() === fontName.toLowerCase(),
      );

      if (foundFont) {
        return `https://fonts.google.com/specimen/${encodeURIComponent(fontName)}`;
      }
    } catch {
      // Font not found in Google Fonts
    }
    return null;
  }

  private async checkAdobeFont(fontName: string): Promise<string | null> {
    const slug = fontName.toLowerCase().replace(/\s+/g, '-');
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.adobeFontsApiUrl}/${slug}`),
      );

      const data = response.data as AdobeFontsApiResponse | undefined;
      if (data?.family) {
        const familyName = data.family.name.toLowerCase();
        if (familyName === fontName.toLowerCase()) {
          return data.family.web_link;
        }
      }
    } catch {
      // Font not found in Adobe Fonts
    }
    return null;
  }

  async checkFonts(fontNames: string[]): Promise<FontCheckResult[]> {
    const results: FontCheckResult[] = [];

    for (const fontName of fontNames) {
      const [googleLink, adobeLink] = await Promise.all([
        this.checkGoogleFont(fontName),
        this.checkAdobeFont(fontName),
      ]);

      const links: FontCheckResult['links'] = {};
      if (googleLink) {
        links['google-font'] = googleLink;
      }
      if (adobeLink) {
        links['adobe-font'] = adobeLink;
      }

      const status = googleLink || adobeLink ? 'found' : 'not found';

      results.push({
        font: fontName,
        links: Object.keys(links).length > 0 ? links : undefined,
        status,
      });
    }

    return results;
  }
}
