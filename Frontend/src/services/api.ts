import axios from 'axios';
import { User, UserProfile, SwipeLimit, LoginRequest } from '../types';

// Change this to your backend URL when running on a device
const API_URL = 'http://10.0.2.2:5000/api'; // Android emulator localhost

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await api.post<User>('/auth/login', data);
    return response.data;
  },
  
  getUser: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/auth/user/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId: number, profile: UserProfile): Promise<User> => {
    const response = await api.put<User>(`/auth/user/${userId}`, profile);
    return response.data;
  },
};

export const swipeService = {
  getProfiles: async (userId: number): Promise<UserProfile[]> => {
    const response = await api.get<UserProfile[]>(`/swipe/profiles/${userId}`);
    return response.data;
  },
  
  swipe: async (userId: number, swipedUserId: number, isLike: boolean): Promise<SwipeLimit> => {
    const response = await api.post<SwipeLimit>(`/swipe/swipe/${userId}`, {
      swipedUserId,
      isLike,
    });
    return response.data;
  },
  
  getSwipeLimit: async (userId: number): Promise<SwipeLimit> => {
    const response = await api.get<SwipeLimit>(`/swipe/limit/${userId}`);
    return response.data;
  },
};
