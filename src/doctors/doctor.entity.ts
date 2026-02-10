import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('doctor')
export class Doctor {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => User, user => user.doctor, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ length: 100, nullable: true })
    specialization: string;

    @Column({ nullable: true })
    experience: number;

    @CreateDateColumn()
    createdAt!: Date;
}