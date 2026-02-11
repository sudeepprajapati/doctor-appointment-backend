import { IsString } from 'class-validator';

export class VerifyDoctorDto {
    @IsString()
    token: string;
}
