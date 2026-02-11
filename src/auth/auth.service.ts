import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from '../users/user.entity';
<<<<<<< HEAD
import { Patient } from '../patients/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { DoctorsService } from 'src/doctors/doctors.service';
=======
import { Patient } from 'src/patients/patient.entity';
import { Doctor } from 'src/doctors/doctor.entity';
>>>>>>> origin/main

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
<<<<<<< HEAD

=======
>>>>>>> origin/main
        @InjectRepository(Patient)
        private readonly patientRepo: Repository<Patient>,

        @InjectRepository(Doctor)
        private readonly doctorRepo: Repository<Doctor>,
<<<<<<< HEAD

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

        if (!user) {
            user = this.userRepo.create({
=======
        private readonly jwtService: JwtService,
    ) { }

    async googleLogin(googleUser: any) {
        let user = await this.userRepo.findOne({
            where: { googleId: googleUser.googleId },
        });

        if (!user) {
            user = await this.userRepo.save({
>>>>>>> origin/main
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                role: googleUser.role,
<<<<<<< HEAD
                isProfileCompleted: false,
            });

            user = await this.userRepo.save(user);
        }

        if (googleUser.role === UserRole.PATIENT && !user.patient) {
            await this.patientRepo.save({ user });
        }

        if (googleUser.role === UserRole.DOCTOR && !user.doctor) {
            const doctor = await this.doctorRepo.save({ user });

            // Generate verification token for doctor onboarding
            const token = await this.doctorsService.generateVerificationToken(doctor);

            // Temporary: log token for testing verification API
            console.log('Doctor verification token:', token.token);
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            expiresIn: 604800,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
            },
        };
    }
=======
                isProfileCompleted: true,
            });

            if (user.role === UserRole.PATIENT) {
                await this.patientRepo.save({ user });
            }

            if (user.role === UserRole.DOCTOR) {
                await this.doctorRepo.save({ user });
            }
        }

        const accessToken = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });
        return { accessToken };
    }

>>>>>>> origin/main
}