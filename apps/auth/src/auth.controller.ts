import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../../../libs/common/src/dto/register.dto';
import { LoginDto } from '../../../libs/common/src/dto/login.dto';
import { MessagePattern } from '@nestjs/microservices';
import { Public } from '@app/common/decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('service.ping')
  ping() {
    return this.authService.ping();
  }

  @MessagePattern('auth.register')
  @Public()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @MessagePattern('auth.login')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
