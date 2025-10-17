export interface User {
  id: number;
  email: string;
  name?: string;
  photoUrl?: string;
  bio?: string;
  age: number;
  createdAt: string;
  authProvider: string;
}

export interface UserProfile {
  id: number;
  name?: string;
  photoUrl?: string;
  bio?: string;
  age: number;
}

export interface SwipeLimit {
  swipesUsedToday: number;
  swipesRemaining: number;
  nextResetTime?: string;
}

export interface LoginRequest {
  email: string;
  name?: string;
  photoUrl?: string;
  authProvider: 'email' | 'google';
}
