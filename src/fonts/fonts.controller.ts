import { Controller, Post, Body } from '@nestjs/common';
import { FontsService, FontCheckResult } from './fonts.service';
import { CheckFontsDto } from './dto/check-fonts.dto';

@Controller('fonts')
export class FontsController {
  constructor(private readonly fontsService: FontsService) {}

  @Post('check')
  async checkFonts(@Body() checkFontsDto: CheckFontsDto): Promise<FontCheckResult[]> {
    return this.fontsService.checkFonts(checkFontsDto.fonts);
  }
}
