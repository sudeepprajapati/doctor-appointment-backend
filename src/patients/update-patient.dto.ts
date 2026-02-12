import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Gender } from './patient.entity';

export class UpdatePatientDto {
    @IsOptional()
    @IsInt()
    age?: number;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;
}
