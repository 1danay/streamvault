import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserByEmailDto, FindUserByIdDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SafeUserData } from './entities';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: SafeUserData })
  @HttpCode(200)
  async getById(@Query() dto: FindUserByIdDto) {
    return await this.userService.findById(dto.id);
  }

  @Get('email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, type: SafeUserData })
  @HttpCode(200)
  async getByEmail(@Query() dto: FindUserByEmailDto) {
    return await this.userService.findByEmail(dto.email);
  }
}
