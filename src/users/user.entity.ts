import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { Patient } from '../patients/patient.entity';
<<<<<<< HEAD
import { Doctor } from 'src/doctors/entities/doctor.entity';
=======
import { Doctor } from '../doctors/doctor.entity';
>>>>>>> origin/main

export enum UserRole {
    PATIENT = 'PATIENT',
    DOCTOR = 'DOCTOR',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 15, unique: true, nullable: true })
    phoneNumber: string;

    @Column({ nullable: true, unique: true })
    email: string;

    @Column({ nullable: true })
    googleId: string;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    role: UserRole;

    @Column({ default: false })
    isProfileCompleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => Patient, patient => patient.user)
    patient: Patient;

    @OneToOne(() => Doctor, doctor => doctor.user)
    doctor: Doctor;
}