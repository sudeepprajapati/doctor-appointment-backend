import { User } from 'src/users/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { DoctorVerificationToken } from './doctor-verification-token.entity';
import { DoctorProfile } from './doctor-profile.entity';

export enum DoctorStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    ACTIVE = 'ACTIVE',
}

@Entity('doctors')
export class Doctor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    name: string;

    @OneToOne(() => User, user => user.doctor, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({
        type: 'enum',
        enum: DoctorStatus,
        default: DoctorStatus.PENDING,
    })
    status!: DoctorStatus;

    @OneToMany(
        () => DoctorVerificationToken,
        token => token.doctor,
    )
    verificationTokens: DoctorVerificationToken[];

    // NEW RELATION
    @OneToOne(() => DoctorProfile, profile => profile.doctor)
    profile: DoctorProfile;

    @CreateDateColumn()
    createdAt!: Date;
}
