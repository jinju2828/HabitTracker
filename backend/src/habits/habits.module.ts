import { Module } from '@nestjs/common'; // NestJS의 Module 데코레이터를 불러옴
import { HabitsController } from './habits.controller'; // 컨트롤러 연결
import { HabitsService } from './habits.service'; // 서비스 연결

// @Module() 데코레이터로 모듈 정의
@Module({
  controllers: [HabitsController], // 요청을 처리할 컨트롤러 등록
  providers: [HabitsService], // 비즈니스 로직을 담당하는 서비스 등록
})
export class HabitsModule {} // 모듈 클래스 export — AppModule에서 import해서 사용
