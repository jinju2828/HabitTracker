import { Controller, Get } from '@nestjs/common';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  getAll(): { message: string } {   // <- 반환 타입 명시
    return { message: 'List of habits will come here' };
  }
}
