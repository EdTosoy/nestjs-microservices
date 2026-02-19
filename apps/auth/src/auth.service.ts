import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'libs/common/interfaces/jwt-payload.interface';
import { RoleEnum } from 'libs/common/interfaces/user.interface';
import { PrismaService } from 'libs/prisma';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) { }



  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        lastSeenAt: new Date(),
        roles: { connect: { name: RoleEnum.USER } },
      },
      include: { roles: { include: { permissions: true } } },
    });

    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
    };
  }

  async login(email: string, password: string) {

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: { include: { permissions: true } }
      }

    })

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      throw new UnauthorizedException("Invalid password")

    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: user.roles.flatMap(r => r.permissions.map(p => p.name))
    }

    let accessToken: string;
    try {
      accessToken = this.jwt.sign(payload, { expiresIn: "15m" })
    } catch (err) {
      this.logger.error("failed to sign access tokne", err)
      throw new UnauthorizedException()
    }

    const refreshToken = await this.createRefreshToken(user.id)

    return {
      accessToken,
      refreshToken
    }

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

