import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  currentIndex = 0;

  constructor(public quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    // Guard: if a user navigates directly to /exam without starting one, send them back.
    if (!this.quizService.examQuestions.length) {
      this.router.navigate(['/']);
    }
  }

  get totalQuestions(): number {
    return this.quizService.examQuestions.length;
  }

  get currentQuestion() {
    return this.quizService.examQuestions[this.currentIndex];
  }

  get currentAnswer() {
    return this.quizService.userAnswers[this.currentIndex];
  }

  /** Page numbers used by the pagination bar, one per question */
  get pageNumbers(): number[] {
    return this.quizService.examQuestions.map((_, i) => i);
  }

  get answeredCount(): number {
    return this.quizService.userAnswers.filter(a => a.selectedIndex !== null).length;
  }

  get allAnswered(): boolean {
    return this.answeredCount === this.totalQuestions;
  }

  get progressPercent(): number {
    return this.totalQuestions ? Math.round(((this.currentIndex + 1) / this.totalQuestions) * 100) : 0;
  }

  isAnswered(index: number): boolean {
    return this.quizService.userAnswers[index]?.selectedIndex !== null;
  }

  isCurrentOptionSelected(optionIndex: number): boolean {
    return this.currentAnswer?.selectedIndex === optionIndex;
  }

  selectAnswer(optionIndex: number): void {
    this.quizService.submitAnswer(this.currentIndex, optionIndex);
  }

  goToQuestion(index: number): void {
    this.currentIndex = index;
  }

  next(): void {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.currentIndex++;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  finishExam(): void {
    this.router.navigate(['/result']);
  }
}