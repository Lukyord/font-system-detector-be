import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FontsModule } from './fonts/fonts.module';

@Module({
  imports: [ConfigModule.forRoot({}), FontsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
