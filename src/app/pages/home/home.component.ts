import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly pageSizes = [10, 20, 30, 40, 50];
  selectedCount = 10;
  loading = false;
  error = '';
 
  constructor(private quizService: QuizService, private router: Router) {}
 
  selectCount(count: number): void {
    this.selectedCount = count;
  }
 
  startExam(): void {
    this.loading = true;
    this.error = '';
 
    this.quizService.loadQuestions().subscribe({
      next: (questions) => {
        this.quizService.startExam(questions, this.selectedCount);
        this.loading = false;
        this.router.navigate(['/exam']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load the question bank. Please check that assets/questions.json exists and try again.';
      }
    });
  }
}
