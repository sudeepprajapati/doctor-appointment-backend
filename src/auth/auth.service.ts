import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, UserRole } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Doctor } from '../doctors/doctor.entity';

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
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.googleId,
                role: googleUser.role,
                isProfileCompleted: false,
            });

            user = await this.userRepo.save(user);
        }

        if (googleUser.role === UserRole.PATIENT && !user.patient) {
            await this.patientRepo.save({ user });
        }

        if (googleUser.role === UserRole.DOCTOR && !user.doctor) {
            await this.doctorRepo.save({ user });
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

}