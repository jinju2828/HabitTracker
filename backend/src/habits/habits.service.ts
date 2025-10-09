import { Injectable } from '@nestjs/common'; 
// @Injectable: 이 클래스가 의존성 주입(DI) 가능한 서비스라는 표시

@Injectable()
export class HabitsService {
  private habits: string[] = ['Exercise', 'Read']; 
  // 임시로 메모리 안에 저장할 습관 목록

  // 모든 습관 반환
  getAll() {
    return this.habits;
  }

  // 새 습관 추가
  create(name: string) {
    this.habits.push(name); // 새 항목 배열에 추가
    return { message: `Habit "${name}" added!` };
  }
}
