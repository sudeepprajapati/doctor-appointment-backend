import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Post('verify')
    verify(@Body() dto: VerifyDoctorDto) {
        return this.doctorsService.verifyDoctor(dto.token);
    }

    @Post('profile')
    @UseGuards(JwtAuthGuard)
    createProfile(@Req() req, @Body() dto: CreateDoctorProfileDto) {
        return this.doctorsService.createProfile(req.user.id, dto);
    }
}
