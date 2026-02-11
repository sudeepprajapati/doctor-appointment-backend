import { IsEmail, IsString } from 'class-validator';

export class RegisterDoctorDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;
}
