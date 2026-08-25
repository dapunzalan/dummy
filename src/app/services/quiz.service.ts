import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, UserAnswer, ScoreResult } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  /** The full 50-question pool as fetched from JSON */
  private questionPool: Question[] = [];

  /** The randomized subset of questions for the current exam attempt */
  examQuestions: Question[] = [];

  /** The user's answers for the current exam attempt, index-aligned with examQuestions */
  userAnswers: UserAnswer[] = [];

  /** Number of questions selected for this exam (10, 20, 30, 40, 50) */
  selectedQuestionCount = 10;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the question bank from assets/questions.json.
   * Called once from the Welcome screen before starting an exam.
   */
  loadQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>('assets/data/questions.json');
  }

  /**
   * Fisher-Yates shuffle - returns a new shuffled array, does not mutate input.
   */
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Starts a new exam attempt:
   * - stores the full pool
   * - randomly selects `count` questions from the pool
   * - randomizes the order of answer options within each question
   *   (while keeping track of the correct answer's new position)
   * - resets user answers
   */
  startExam(pool: Question[], count: number): void {
    this.questionPool = pool;
    this.selectedQuestionCount = count;

    const shuffledPool = this.shuffle(pool);
    const selected = shuffledPool.slice(0, Math.min(count, pool.length));

    this.examQuestions = selected.map(q => {
      const optionsWithOriginalIndex = q.options.map((opt, idx) => ({ opt, idx }));
      const shuffledOptions = this.shuffle(optionsWithOriginalIndex);
      const newCorrectIndex = shuffledOptions.findIndex(o => o.idx === q.correctAnswer);

      return {
        ...q,
        options: shuffledOptions.map(o => o.opt),
        correctAnswer: newCorrectIndex
      };
    });

    this.userAnswers = this.examQuestions.map(q => ({
      questionId: q.id,
      selectedIndex: null,
      correctIndex: q.correctAnswer,
      isCorrect: false
    }));
  }

  /**
   * Records the user's selected option for a given question index.
   */
  submitAnswer(questionIndex: number, selectedOptionIndex: number): void {
    const answer = this.userAnswers[questionIndex];
    if (!answer) {
      return;
    }
    answer.selectedIndex = selectedOptionIndex;
    answer.isCorrect = selectedOptionIndex === answer.correctIndex;
  }

  /**
   * Calculates the final score for the completed exam.
   */
  getScore(): ScoreResult {
    const correct = this.userAnswers.filter(a => a.isCorrect).length;
    const total = this.userAnswers.length;
    const percentage = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  }

  /**
   * Clears the current exam attempt so the user can start fresh
   * (a new random set/order of questions will be generated next time).
   */
  reset(): void {
    this.examQuestions = [];
    this.userAnswers = [];
  }
}