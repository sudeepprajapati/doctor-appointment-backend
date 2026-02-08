import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) { }

    async findByEmail(email: string) {
        return this.usersRepo.findOne({ where: { email } });
    }

    async createUser(data: Partial<User>) {
        const user = this.usersRepo.create(data);
        return this.usersRepo.save(user);
    }
}
