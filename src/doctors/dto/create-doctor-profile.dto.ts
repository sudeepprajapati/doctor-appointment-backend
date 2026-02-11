import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorProfileDto {
    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    clinicName?: string;

    @IsOptional()
    @IsString()
    clinicAddress?: string;

    @IsNotEmpty()
    specialization!: string;

    @IsNumber()
    experience!: number;
}
