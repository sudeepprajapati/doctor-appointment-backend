import { Controller, Put, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PatientsService } from './patient.services';
import { UpdatePatientDto } from './update-patient.dto';

@Controller('patients')
export class PatientController {
    constructor(private readonly patientsService: PatientsService) { }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Req() req, @Body() dto: UpdatePatientDto) {
        return this.patientsService.updateProfile(req.user.id, dto);
    }
}
