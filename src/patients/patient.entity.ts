<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from 'typeorm';
import { User } from 'src/users/user.entity';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}

=======
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

>>>>>>> origin/main
@Entity('patient')
export class Patient {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => User, user => user.patient, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
<<<<<<< HEAD

    @Column({ length: 100, nullable: true })
    name: string;

    @Column({ type: 'int', nullable: true })
    age: number;

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true,
    })
    gender: Gender;
=======
>>>>>>> origin/main
}