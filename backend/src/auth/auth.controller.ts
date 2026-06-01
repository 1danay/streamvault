import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators';
import { AuthDto, LoginResponse } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse({ status: 200, type: LoginResponse })
  @Public()
  @Post('login')
  @HttpCode(200)
  public async login(@Body() dto: AuthDto): Promise<LoginResponse> {
    return await this.authService.login(dto);
  }
}
