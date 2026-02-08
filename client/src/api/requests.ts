// src/api/requests.ts
import { setToken } from './auth';
import { instance } from './axios';

export const api = {
  // --- 인증 (Auth) ---
  login: async (username: string, password: string) => {
    const response = await instance.post('/auth/login', { username, password });
    setToken(response.data.access_token);
    return response.data;
  },

  // --- 연혁 (History) ---
  getHistory: () => instance.get('/history'),
  createHistory: (data: any) => instance.post('/history', data), // data 타입은 나중에 Interface로 정의하면 더 좋습니다.
  deleteHistory: (id: number | string) => instance.delete(`/history/${id}`),

  // --- 리서치 (Research) ---
  createResearch: (formData: FormData) => {
    return instance.post('/research', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // --- 멤버 (Members) ---
  getNextGen: () => instance.post('/members/next-gen'),
};
