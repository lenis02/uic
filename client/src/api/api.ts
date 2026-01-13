// src/api/api.ts
import { instance } from './axios';

export const api = {
  // --- 인증 (Auth) ---
  login: async (username: string, password: string) => {
    const response = await instance.post('/auth/login', { username, password });
    localStorage.setItem('accessToken', response.data.access_token);
    return response.data;
  },

  // --- 연혁 (History) ---
  getHistory: () => instance.get('/history'),
  createHistory: (data: any) => instance.post('/history', data),
  deleteHistory: (id: number | string) => instance.delete(`/history/${id}`),

  // --- 리서치 (Research) ---
  createResearch: (formData: FormData) => {
    return instance.post('/research', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getResearch: () => instance.get('/research'),
  deleteResearch: (id: number) => instance.delete(`/research/${id}`),

  // --- 멤버 (Members) ---
  getMembers: () => instance.get('/members'), // 전체 멤버 조회
  createMember: (data: any) => instance.post('/members', data), // 멤버 등록
  updateMember: (id: number, data: any) =>
    instance.patch(`/members/${id}`, data),
  deleteMember: (id: number) => instance.delete(`/members/${id}`), // 멤버 삭제
  getNextGen: () => instance.post('/members/next-gen'),

  // --- 인사말 (Greeting) ---
  getGreetingByRole: (role: string) => instance.get(`/greeting/${role}`), // 👈 세 번째 스크린샷 오류 해결

  // 직책별로 수정하기
  updateGreeting: (role: string, data: FormData | any) =>
    instance.patch(`/greeting/${role}`, data, {
      headers: {
        // FormData를 보낼 때는 Content-Type을 지정하지 않거나(브라우저 자동 설정),
        // 'multipart/form-data'로 명시해야 합니다.
        'Content-Type': 'multipart/form-data',
      },
    }),
};
