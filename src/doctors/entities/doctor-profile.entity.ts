import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('doctor_profiles')
export class DoctorProfile {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => Doctor, doctor => doctor.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doctor_id' })
    doctor: Doctor;

    @Column()
    specialization!: string;

    @Column()
    experience!: number;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ length: 150, nullable: true })
    clinicName: string;

    @Column({ length: 255, nullable: true })
    clinicAddress: string;
}
