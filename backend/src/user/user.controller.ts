import { Controller, Get, HttpCode, Query, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import {
  FindUserByEmailDto,
  FindUserByIdDto,
  SafeUserData,
  UpdateProfileDto,
  UserProfileResponse,
} from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators';

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

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserProfileResponse })
  @HttpCode(200)
  async getProfile(@CurrentUser('id') userId: string) {
    return await this.userService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, type: UserProfileResponse })
  @HttpCode(200)
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(userId, dto);
  }
}
