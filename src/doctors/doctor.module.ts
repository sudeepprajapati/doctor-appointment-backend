import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { UsersModule } from '../users/users.module';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorVerificationToken } from './entities/doctor-verification-token.entity';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DoctorAvailability } from './entities/doctor-availability.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Doctor,
            DoctorProfile,
            DoctorVerificationToken,
            DoctorAvailability
        ]),
        UsersModule,
    ],
    controllers: [DoctorsController],
    providers: [DoctorsService],
    exports: [DoctorsService],
})
export class DoctorsModule { }