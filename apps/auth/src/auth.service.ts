
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'libs/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) { }


  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    });

    return { accessToken };
  }

  async createRefreshToken(userId: string) {
    const token = this.jwt.sign(
      { sub: userId },
      { expiresIn: '7d' }
    );
    const tokenHash = await bcrypt.hash(token, 10);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        revoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return token;
  }

  async validateRefreshToken(userId: string, token: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId, revoked: false },
    });

    for (const t of tokens) {
      const match = await bcrypt.compare(token, t.tokenHash);
      if (match) {
        return true;
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async revokeRefreshToken(token: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { revoked: false },
    });

    for (const t of tokens) {
      const match = await bcrypt.compare(token, t.tokenHash);
      if (match) {
        await this.prisma.refreshToken.update({
          where: { id: t.id },
          data: { revoked: true },
        });
        return true;
      }
    }

    throw new UnauthorizedException('Refresh token not found');
  }
}

