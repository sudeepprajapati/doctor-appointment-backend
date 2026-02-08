import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async googleLogin(profile: any) {
        let user = await this.usersService.findByEmail(profile.email);

        if (!user) {
            user = await this.usersService.createUser({
                email: profile.email,
                full_name: profile.fullName,
                google_id: profile.googleId,
                role: profile.role || 'PATIENT',
            });
        }

        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
