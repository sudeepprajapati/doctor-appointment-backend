import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientsService {
    constructor(
        @InjectRepository(Patient)
        private readonly patientRepo: Repository<Patient>,
    ) { }

    async updateProfile(userId: number, data: Partial<Patient>) {
        const patient = await this.patientRepo.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!patient) {
            throw new BadRequestException('Patient not found');
        }

        Object.assign(patient, data);

        await this.patientRepo.save(patient);

        // Mark onboarding complete
        patient.user.isProfileCompleted = true;
        await this.patientRepo.manager.save(patient.user);

        return patient;
    }
}
