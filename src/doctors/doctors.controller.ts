import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    Get,
    Delete,
    Param,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { VerifyDoctorDto } from './dto/verify-doctor.dto';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    /* ---------- Verification ---------- */

    @Post('verify')
    verify(@Body() dto: VerifyDoctorDto) {
        return this.doctorsService.verifyDoctor(dto.token);
    }

    /* ---------- Profile ---------- */

    @Post('profile')
    @UseGuards(JwtAuthGuard)
    createProfile(@Req() req, @Body() dto: CreateDoctorProfileDto) {
        // ✅ pass full user
        return this.doctorsService.createProfile(req.user, dto);
    }

    /* ---------- Availability (Doctor only) ---------- */

    @Post('availability')
    @UseGuards(JwtAuthGuard)
    createAvailability(@Req() req, @Body() dto: CreateAvailabilityDto) {
        return this.doctorsService.createAvailability(req.user, dto);
    }

    @Get('availability')
    @UseGuards(JwtAuthGuard)
    getAvailability(@Req() req) {
        return this.doctorsService.getAvailability(req.user);
    }

    @Delete('availability/:id')
    @UseGuards(JwtAuthGuard)
    deleteAvailability(@Req() req, @Param('id') id: number) {
        return this.doctorsService.deleteAvailability(req.user, +id);
    }

    /* ---------- Patient read ---------- */

    @Get(':doctorId/availability/slots')
    getDoctorSlots(@Param('doctorId') doctorId: number) {
        return this.doctorsService.getDoctorAvailabilitySlots(+doctorId);
    }
}
