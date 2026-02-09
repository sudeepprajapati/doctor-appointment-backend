import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Patient login
    @Get('google/patient')
    @UseGuards(AuthGuard('google'))
    googlePatientLogin() { }

    // Doctor login
    @Get('google/doctor')
    @UseGuards(AuthGuard('google'))
    googleDoctorLogin() { }

    // Google redirects
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return this.authService.googleLogin(req.user);
    }
}
