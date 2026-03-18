import { Public } from '@app/common';
import { LoginDto } from '@app/common/dto/login.dto';
import { RegisterDto } from '@app/common/dto/register.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthGatewayController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  @Public()
  register(@Body() dto: RegisterDto) {
    return firstValueFrom(this.authClient.send('auth.register', dto));
  }

  @Post('login')
  @Public()
  login(@Body() dto: LoginDto) {
    return firstValueFrom(this.authClient.send('auth.login', dto));
  }
}
