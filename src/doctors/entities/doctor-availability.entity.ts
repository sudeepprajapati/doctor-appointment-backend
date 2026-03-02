import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { Doctor } from './doctor.entity';

export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

@Index(
    ['doctor', 'dayOfWeek', 'startTime', 'endTime'],
    { unique: true },
)

@Entity('doctor_availabilities')
export class DoctorAvailability {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Doctor,
        doctor => doctor.availabilities,
        { onDelete: 'CASCADE' },
    )
    doctor: Doctor;

    @Column({
        type: 'enum',
        enum: DayOfWeek,
    })
    dayOfWeek: DayOfWeek;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'int' })
    slotDuration: number;

    @CreateDateColumn()
    createdAt: Date;
}
