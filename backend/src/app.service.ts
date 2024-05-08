import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {
  }
  private sessionPassword = process.env.SESSION_PASSWORD;
  private apiToken = process.env.API_TOKEN;

  async authenticateSessionPassword(password: string) {
    if(password !== this.sessionPassword) {
      throw new UnauthorizedException()
    }

    const payload = {sub: this.sessionPassword, username: this.apiToken}

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }
}
