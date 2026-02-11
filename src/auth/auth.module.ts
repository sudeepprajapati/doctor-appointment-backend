import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
<<<<<<< HEAD
=======
import { UsersModule } from '../users/users.module';
>>>>>>> origin/main
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Patient } from 'src/patients/patient.entity';
<<<<<<< HEAD
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DoctorsModule } from 'src/doctors/doctor.module';
=======
import { Doctor } from 'src/doctors/doctor.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
>>>>>>> origin/main

@Module({
  imports: [
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TypeOrmModule.forFeature([User, Patient, Doctor]),
<<<<<<< HEAD
    DoctorsModule,
=======
>>>>>>> origin/main
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule { }
