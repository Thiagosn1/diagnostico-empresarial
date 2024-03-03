export interface Question {
  id: number;
  description: string;
  position: number;
  positive: boolean;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  position: number;
  questions: Question[];
}

export interface TimelineItem {
  id: number;
  date: string;
  description: string;
}

export interface Business {
  id: number;
  name: string;
  cnpjCpf: string;
  managerId: number;
  businessUsers: any[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  authority: string;
  businessUsers: any[];
  businesses: any[];
  expirated: boolean | null;
}
