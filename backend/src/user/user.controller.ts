import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserByEmailDto, FindUserByIdDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async getById(@Query() dto: FindUserByIdDto) {
    return await this.userService.findById(dto);
  }

  @Get()
  @HttpCode(200)
  async getByEmail(@Query() dto: FindUserByEmailDto) {
    return await this.userService.findByEmail(dto);
  }
}
