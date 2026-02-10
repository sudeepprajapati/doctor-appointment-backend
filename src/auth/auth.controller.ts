import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import express from 'express';
import { GoogleAuthGuard } from './guards/google-auth-guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Frontend calls this when user clicks Doctor / Patient
    @Get('select-role')
    selectRole(
        @Query('role') role: 'PATIENT' | 'DOCTOR',
        @Res() res: express.Response,
    ) {
        if (!['PATIENT', 'DOCTOR'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        return res.redirect(`/auth/google?state=${role}`);
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleLogin() { }

    //Google OAuth callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req.user);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req) {
        return req.user;
    }
}
