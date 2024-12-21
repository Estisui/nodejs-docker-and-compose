import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { HashModule } from '../hash/hash.module';
import { CONFIG } from '../config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    HashModule,
    JwtModule.register({
      secret: CONFIG.JWT.SECRET,
      signOptions: { expiresIn: CONFIG.JWT.EXPIRES_IN },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
