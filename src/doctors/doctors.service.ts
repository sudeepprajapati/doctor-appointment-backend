import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor, DoctorStatus } from './entities/doctor.entity';
import { DoctorVerificationToken } from './entities/doctor-verification-token.entity';
import { randomBytes } from 'crypto';
import { DoctorProfile } from './entities/doctor-profile.entity';

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private doctorRepo: Repository<Doctor>,

        @InjectRepository(DoctorVerificationToken)
        private tokenRepo: Repository<DoctorVerificationToken>,

        @InjectRepository(DoctorProfile)
        private profileRepo: Repository<DoctorProfile>,
    ) { }

    async generateVerificationToken(doctor: Doctor) {
        const token = randomBytes(32).toString('hex');

        const verification = this.tokenRepo.create({
            doctor,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        return this.tokenRepo.save(verification);
    }

    async verifyDoctor(token: string) {
        const record = await this.tokenRepo.findOne({
            where: { token },
            relations: ['doctor'],
        });

        if (!record || record.isUsed || record.expiresAt < new Date()) {
            throw new BadRequestException('Invalid or expired token');
        }

        record.isUsed = true;
        record.doctor.status = DoctorStatus.ACTIVE;

        await this.tokenRepo.save(record);
        await this.doctorRepo.save(record.doctor);

        return { message: 'Doctor verified successfully' };
    }

    async createProfile(userId: number, data: Partial<DoctorProfile>) {
        const doctor = await this.doctorRepo.findOne({
            where: { user: { id: userId } },
            relations: ['profile', 'user'],
        });

        if (!doctor || doctor.status !== DoctorStatus.ACTIVE) {
            throw new BadRequestException('Doctor not verified');
        }

        let profile: DoctorProfile;

        if (doctor.profile) {
            Object.assign(doctor.profile, data);
            profile = await this.profileRepo.save(doctor.profile);
        } else {
            const newProfile = this.profileRepo.create({
                doctor,
                ...data,
            });
            profile = await this.profileRepo.save(newProfile);
        }

        // IMPORTANT: mark onboarding completed
        doctor.user.isProfileCompleted = true;
        await this.doctorRepo.manager.save(doctor.user);

        return profile;
    }

}
