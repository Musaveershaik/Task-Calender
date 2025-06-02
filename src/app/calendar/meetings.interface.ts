export interface Meetings {
  [key: string]: string[];
}

export interface Meeting {
  title: string;
  time?: string;
  description?: string;
  date: string;
}
