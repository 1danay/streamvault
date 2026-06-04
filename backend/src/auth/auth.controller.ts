import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators';
import { AuthDto, AuthResponse } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'User login',
  })
  @ApiResponse({ status: 200, type: AuthResponse })
  @Public()
  @Post('login')
  @HttpCode(200)
  public async login(@Body() dto: AuthDto): Promise<AuthResponse> {
    return await this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'User register',
  })
  @ApiResponse({ status: 201, type: AuthResponse })
  @Public()
  @Post('register')
  @HttpCode(201)
  public async register(@Body() dto: AuthDto): Promise<AuthResponse> {
    return await this.authService.register(dto);
  }
}
