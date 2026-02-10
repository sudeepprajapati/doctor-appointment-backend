import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });

    }

    async validate(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
    ) {
        const role = req.query.state as string;

        if (!role || !['PATIENT', 'DOCTOR'].includes(role)) {
            throw new UnauthorizedException('Invalid role');
        }

        return {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            role,
        };
    }
}
