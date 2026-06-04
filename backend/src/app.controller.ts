import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public health() {
    return {
      message: 'ok',
    };
  }
}
