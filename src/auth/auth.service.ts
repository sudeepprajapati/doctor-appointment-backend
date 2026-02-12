import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Patient)
        private readonly patientRepo: Repository<Patient>,

        @InjectRepository(Doctor)
        private readonly doctorRepo: Repository<Doctor>,

        private readonly jwtService: JwtService,
        private readonly doctorsService: DoctorsService,
    ) { }

    async googleLogin(googleUser: {
        googleId: string;
        email: string;
        name: string;
        role: UserRole;
    }) {
        let user = await this.userRepo.findOne({
            where: { googleId: googleUser.googleId },
            relations: ['patient', 'doctor'],
        });

        // Prevent cross-role login
        if (user && user.role !== googleUser.role) {
            throw new UnauthorizedException(
                `This account is already registered as ${user.role}`,
            );
        }

        if (!user) {
            user = this.userRepo.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                role: googleUser.role,
                isProfileCompleted: false,
            });

            user = await this.userRepo.save(user);
        }

        if (googleUser.role === UserRole.PATIENT && !user.patient) {
            await this.patientRepo.save({
                user,
                name: user.name,
            });
        }

        if (googleUser.role === UserRole.DOCTOR && !user.doctor) {
            const doctor = await this.doctorRepo.save({
                user,
                name: user.name,
            });

            await this.doctorsService.generateVerificationToken(doctor);
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
            },
        };
    }
}