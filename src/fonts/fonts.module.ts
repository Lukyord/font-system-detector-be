import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { FontsController } from './fonts.controller';
import { FontsService } from './fonts.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FontsController],
  providers: [FontsService],
})
export class FontsModule {}
