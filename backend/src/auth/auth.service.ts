import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  //Registrierung: Email eindeutig + Passwort hashen
  async register(
    email: string,
    password: string,
  ): Promise<{ id: number; email: string }> {
    const existing = await this.usersRepo.findOne({ where: { email } });
    if (existing) {
      //Email darf nur einmal existieren
      throw new BadRequestException('Email is already registred');
    }

    //Passwort hashen
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepo.create({ email, passwordHash });
    const saved = await this.usersRepo.save(user);

    //Wir geben niemals passwordHash zurück
    return { id: saved.id, email: saved.email };
  }

  //Login: Email suchen + Passwort prüfen + JWT zurückgeben
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Token Payload: minimal halten
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
