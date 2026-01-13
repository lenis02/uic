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
  // 리서치 생성 (파일 업로드 포함)
  createResearch: (formData: FormData) => {
    return instance.post('/research', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getResearch: () => instance.get('/research'),
  deleteResearch: (id: number) => instance.delete(`/research/${id}`),

  // --- 멤버 (Members) ---
  // 전체 멤버 조회
  getMembers: () => instance.get('/members'),

  // [수정됨] 멤버 등록 (이미지 파일 업로드 지원)
  createMember: (data: FormData) =>
    instance.post('/members', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // [수정됨] 멤버 수정 (이미지 파일 수정 지원)
  updateMember: (id: number, data: FormData) =>
    instance.patch(`/members/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // 멤버 삭제
  deleteMember: (id: number) => instance.delete(`/members/${id}`),

  // (옵션) 다음 기수 계산용 API가 있다면 유지
  getNextGen: () => instance.post('/members/next-gen'),

  // --- 인사말 (Greeting) ---
  // 직책별 인사말 조회
  getGreetingByRole: (role: string) => instance.get(`/greeting/${role}`),

  // 직책별 인사말 수정 (이미지 포함)
  updateGreeting: (role: string, data: FormData | any) =>
    instance.patch(`/greeting/${role}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
