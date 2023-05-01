const REQUIREMENTS = {
  //Join then with , symbol on client
  "Bachelor's Degree": "Бакалаврська ступінь",
  "Master's Degree": "Магістерська ступінь",
  PhD: "Докторська ступінь",
  "At least 2 years of experience": "Не менше 2 років досвіду",
  "At least 5 years of experience": "Не менше 5 років досвіду",
  "Fluent in English": "Вільне володіння англійською",
  "Excellent communication skills": "Високі комунікативні навички",
  "Strong analytical skills": "Сильні аналітичні навички",
} as const;
const VACANCY_STATUSES = {
  OPEN: "Open",
  CLOSED: "Closed",
  ON_HOLD: "On hold",
  FILLED: "Filled",
  CANCELLED: "Cancelled",
} as const;

export interface Candidate {
  id?: number;
  vacancyId?: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  application_date: Date; // дата подачі на заявку
  status?: string;
  comments?: string;
  vacancy?: Vacancy;
}

export interface Vacancy {
  id?: number;
  title: string;
  department: string;
  description: string;
  requirements: string;
  posting_date: Date;
  closing_date: Date;
  status: string;
  candidates?: Candidate[];
}

// need to create proper hangaround!
type Requirements = keyof typeof REQUIREMENTS;
type VacancyStatus = keyof typeof VACANCY_STATUSES;


