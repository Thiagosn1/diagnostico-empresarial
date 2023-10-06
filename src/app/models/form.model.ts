export interface Question {
  id: number;
  description: string;
  position: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  position: number;
  questions: Question[];
}
