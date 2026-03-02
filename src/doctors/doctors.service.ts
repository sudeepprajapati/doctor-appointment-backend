import {
    Injectable,
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { Doctor, DoctorStatus } from './entities/doctor.entity';
import { DoctorVerificationToken } from './entities/doctor-verification-token.entity';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UserRole } from 'src/users/user.entity';

type Slot = {
    slotNumber: number;
    startTime: string;
    endTime: string;
};

@Injectable()
export class DoctorsService {
    constructor(
        @InjectRepository(Doctor)
        private readonly doctorRepo: Repository<Doctor>,

        @InjectRepository(DoctorVerificationToken)
        private readonly tokenRepo: Repository<DoctorVerificationToken>,

        @InjectRepository(DoctorProfile)
        private readonly profileRepo: Repository<DoctorProfile>,

        @InjectRepository(DoctorAvailability)
        private readonly availabilityRepo: Repository<DoctorAvailability>,
    ) { }

    /* -------------------- Helpers -------------------- */

    private timeToMinutes(time: string): number {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
    }

    private minutesToTime(minutes: number): string {
        const h = Math.floor(minutes / 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    /* -------------------- Verification -------------------- */

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

    /* -------------------- Profile -------------------- */

    async createProfile(user: any, data: Partial<DoctorProfile>) {
        if (user.role !== UserRole.DOCTOR) {
            throw new ForbiddenException('Only doctors can create profile');
        }

        const doctor = await this.doctorRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['profile', 'user'],
        });

        if (!doctor) {
            throw new NotFoundException('Doctor record not found');
        }

        if (doctor.status !== DoctorStatus.ACTIVE) {
            throw new ForbiddenException('Doctor not verified');
        }

        let profile: DoctorProfile;

        if (doctor.profile) {
            Object.assign(doctor.profile, data);
            profile = await this.profileRepo.save(doctor.profile);
        } else {
            profile = await this.profileRepo.save(
                this.profileRepo.create({ doctor, ...data }),
            );
        }

        doctor.user.isProfileCompleted = true;
        await this.doctorRepo.manager.save(doctor.user);

        return profile;
    }

    /* -------------------- Availability -------------------- */

    async createAvailability(user: any, data: CreateAvailabilityDto) {
        if (user.role !== UserRole.DOCTOR) {
            throw new ForbiddenException('Only doctors can create availability');
        }

        const doctor = await this.doctorRepo.findOne({
            where: { user: { id: user.id } },
        });

        if (!doctor) {
            throw new NotFoundException('Doctor record not found');
        }

        if (doctor.status !== DoctorStatus.ACTIVE) {
            throw new ForbiddenException('Doctor not verified');
        }

        const start = this.timeToMinutes(data.startTime);
        const end = this.timeToMinutes(data.endTime);

        if (start >= end) {
            throw new BadRequestException('Start time must be before end time');
        }

        if (data.slotDuration <= 0) {
            throw new BadRequestException('Invalid slot duration');
        }

        // Overlap protection
        const existing = await this.availabilityRepo.find({
            where: {
                doctor: { id: doctor.id },
                dayOfWeek: data.dayOfWeek,
            },
        });

        for (const av of existing) {
            const avStart = this.timeToMinutes(av.startTime);
            const avEnd = this.timeToMinutes(av.endTime);

            if (start < avEnd && end > avStart) {
                throw new BadRequestException(
                    'Availability overlaps with existing slot',
                );
            }
        }

        return this.availabilityRepo.save(
            this.availabilityRepo.create({
                doctor,
                ...data,
            }),
        );
    }

    async getAvailability(user: any) {
        if (user.role !== UserRole.DOCTOR) {
            throw new ForbiddenException('Only doctors can view their availability');
        }

        const doctor = await this.doctorRepo.findOne({
            where: { user: { id: user.id } },
            relations: ['availabilities'],
        });

        if (!doctor) {
            throw new NotFoundException('Doctor record not found');
        }

        return doctor.availabilities;
    }

    async deleteAvailability(user: any, availabilityId: number) {
        if (user.role !== UserRole.DOCTOR) {
            throw new ForbiddenException('Only doctors can delete availability');
        }

        const availability = await this.availabilityRepo.findOne({
            where: {
                id: availabilityId,
                doctor: { user: { id: user.id } },
            },
            relations: ['doctor', 'doctor.user'],
        });

        if (!availability) {
            throw new NotFoundException('Availability not found');
        }

        await this.availabilityRepo.remove(availability);
        return { message: 'Availability deleted successfully' };
    }

    /* -------------------- Patient Read: Slots -------------------- */

    async getDoctorAvailabilitySlots(doctorId: number) {
        const availabilities = await this.availabilityRepo.find({
            where: { doctor: { id: doctorId } },
            order: { startTime: 'ASC' },
        });

        return availabilities.map(av => {
            const slots: Slot[] = [];

            let start = this.timeToMinutes(av.startTime);
            const end = this.timeToMinutes(av.endTime);
            let slotNumber = 1;

            while (start + av.slotDuration <= end) {
                slots.push({
                    slotNumber,
                    startTime: this.minutesToTime(start),
                    endTime: this.minutesToTime(start + av.slotDuration),
                });

                start += av.slotDuration;
                slotNumber++;
            }

            return {
                availabilityId: av.id,
                dayOfWeek: av.dayOfWeek,
                slots,
                maxPatients: slots.length,
            };
        });
    }
}
