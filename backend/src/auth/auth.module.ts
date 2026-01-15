import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken'; // ✅ wichtig für expiresIn Typ

import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    //stellt sicher, dass env-Werte über ConfigService verfügbar sind
    ConfigModule,

    //User Repository verfügbar machen
    TypeOrmModule.forFeature([User]),

    //Passport für Guards/Strategy
    PassportModule,

    //JWT robust konfigurieren über ConfigService (nicht process.env direkt)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        //Secret muss existieren, sonst lieber sofort klarer Fehler
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is missing. Check backend/.env');
        }

        //expiresIn typ-sicher casten
        const expiresIn = (config.get<string>('JWT_EXPIRES_IN') ??
          '1h') as SignOptions['expiresIn'];

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
