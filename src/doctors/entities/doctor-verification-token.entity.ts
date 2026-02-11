import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('doctor_verification_tokens')
export class DoctorVerificationToken {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Doctor, doctor => doctor.verificationTokens, { onDelete: 'CASCADE' })
    doctor: Doctor;

    @Column({ unique: true })
    token: string;

    @Column()
    expiresAt: Date;

    @Column({ default: false })
    isUsed: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}
