import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    full_name: string;

    @Column({ nullable: true })
    google_id: string;

    @Column({ default: 'PATIENT' })
    role: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    password_hash: string;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
