import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Font System Detector API v0.1.0 is running!';
  }
}
