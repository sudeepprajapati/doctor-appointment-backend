import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { UsersModule } from '../users/users.module';
import { PatientController } from './patient.controller';
import { PatientsService } from './patient.services';

@Module({
    imports: [
        TypeOrmModule.forFeature([Patient]),
        UsersModule,
    ],
    controllers: [PatientController],
    providers: [PatientsService],
    exports: [TypeOrmModule],
})

export class PatientsModule { }