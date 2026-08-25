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
    if (this.score.percentage >= 90) return 'Excellent!';
    if (this.score.percentage >= 75) return 'Good job!';
    if (this.score.percentage >= 50) return 'Fair attempt';
    return 'Keep studying';
  }

  get remarkText(): string {
    if (this.score.percentage >= 90) return 'You have strong mastery of ABG analysis concepts.';
    if (this.score.percentage >= 75) return 'You have a solid understanding, with a little more room to sharpen the details.';
    if (this.score.percentage >= 50) return 'You are getting there. Review the topics you missed below.';
    return 'Review the fundamentals of ABG interpretation and try again.';
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
