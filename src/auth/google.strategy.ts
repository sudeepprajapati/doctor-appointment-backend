import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });

    }

    async validate(
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
    ) {
        const role = (req.query.state || 'PATIENT').toUpperCase();

        console.log('ROLE FROM STATE:', role);

        return {
            googleId: profile.id,
            email: profile.emails[0].value,
            fullName: profile.displayName,
            role,
        };
    }


}
