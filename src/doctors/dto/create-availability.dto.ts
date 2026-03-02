import { IsEnum, IsInt, Matches } from 'class-validator';
import { DayOfWeek } from '../entities/doctor-availability.entity';

export class CreateAvailabilityDto {
    @IsEnum(DayOfWeek)
    dayOfWeek: DayOfWeek;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    startTime: string;

    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    endTime: string;

    @IsInt()
    slotDuration: number;
}
