import { Controller, Get, Post, Body } from '@nestjs/common'; 
// Controller: 라우트 그룹 정의
// Get, Post: HTTP 메서드 데코레이터
// Body: POST 요청 시 request body를 받기 위해 사용

import { HabitsService } from './habits.service'; 
// HabitsService 불러오기 (비즈니스 로직 담당)

@Controller('habits') 
// 이 컨트롤러는 기본 URL 경로가 '/habits'로 시작함
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}
  // constructor로 service 주입 (NestJS의 DI 기능)

  @Get()
  // GET /habits 요청 → 모든 습관 목록을 가져오기
  getAllHabits() {
    return this.habitsService.getAll(); 
    // 실제 로직은 service에서 처리 (지금은 mock)
  }

  @Post()
  // POST /habits 요청 → 새 습관 추가
  createHabit(@Body() body: { name: string }) {
    // Body() 데코레이터로 JSON body 받기
    return this.habitsService.create(body.name);
  }
}
