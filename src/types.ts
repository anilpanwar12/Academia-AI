export interface Lecture {
  id: string;
  course: string;
  topic: string;
  time: string;
  duration: string;
  location: string;
  status: 'past' | 'ongoing' | 'upcoming';
}

export interface Student {
  id: string;
  name: string;
  attendance: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  target: string;
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
}
