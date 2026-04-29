export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  image: string;
  category: 'therapy' | 'surgery' | 'orthodontics' | 'hygiene' | 'implants';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
