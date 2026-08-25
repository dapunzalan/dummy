import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { ScoreResult } from '../../models/question.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  score: ScoreResult = { correct: 0, total: 0, percentage: 0 };
  showReview = false;

  constructor(public quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    // Guard: if a user navigates directly to /result without an exam in progress, send them back.
    if (!this.quizService.examQuestions.length) {
      this.router.navigate(['/']);
      return;
    }
    this.score = this.quizService.getScore();
  }

  get remarkTitle(): string {
    if (this.score.percentage >= 90) return 'Lakas mo Tattot!';
    if (this.score.percentage >= 75) return 'Ang Galing mo Bochog!';
    if (this.score.percentage >= 50) return 'Sayang!';
    return 'Baby magreview ka pa!';
  }

  get remarkText(): string {
    if (this.score.percentage >= 90) return 'Wow, sexy, maganda, tapos matalino pa!';
    if (this.score.percentage >= 75) return 'Ang galing, pwede po pa kiss?';
    if (this.score.percentage >= 50) return 'Baby ready ka na po ba mag top? :D';
    return 'i-ready mo na ang twerk mo :>';
  }

  get scoreColorClass(): string {
    if (this.score.percentage >= 75) return 'score-good';
    if (this.score.percentage >= 50) return 'score-fair';
    return 'score-poor';
  }

  toggleReview(): void {
    this.showReview = !this.showReview;
  }

  optionLetter(index: number): string {
    return ['A', 'B', 'C', 'D', 'E', 'F'][index] ?? String(index + 1);
  }

  retakeExam(): void {
    this.quizService.reset();
    this.router.navigate(['/']);
  }
}
