export interface Question {
  id: number;
  description: string;
  position: number;
}

export interface Category {
  id: number;
  name: string;
  position: number;
  questions: Question[];
}
