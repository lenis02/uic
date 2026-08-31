// src/api/api.ts
import { instance } from './axios';
import { setToken } from './auth';

export interface ResearchPayload {
  title: string;
  category: string;
  year: string;
  pdfUrl?: string;
}

export interface JoinFormPayload {
  description?: string;
  bullets?: string;
  fileUrl?: string;
  fileName?: string;
}

export const api = {
  // --- 인증 (Auth) ---
  login: async (username: string, password: string) => {
    const response = await instance.post('/auth/login', { username, password });
    setToken(response.data.access_token);
    return response.data;
  },

  // --- 연혁 (History) ---
  getHistory: () => instance.get('/history'),
  createHistory: (data: any) => instance.post('/history', data),
  deleteHistory: (id: number | string) => instance.delete(`/history/${id}`),

  // --- 리서치 (Research) ---
  // PDF는 브라우저가 Cloudinary로 직접 올리고(api/cloudinary.ts) 여기엔 URL만 온다.
  createResearch: (data: ResearchPayload) => instance.post('/research', data),
  getResearch: () => instance.get('/research'),
  updateResearch: (id: number, data: Partial<ResearchPayload>) =>
    instance.patch(`/research/${id}`, data),
  deleteResearch: (id: number) => instance.delete(`/research/${id}`),
  increaseResearchView: (id: number) => instance.patch(`/research/${id}/views`),

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

  // [추가] 문의 메일 발송
  sendContactEmail: (data: { name: string; email: string; message: string }) =>
    instance.post('/contact', data),

  // --- 팝업 (Popup) ---
  getPopups: () => instance.get('/popup'),
  getActivePopups: () => instance.get('/popup/active'),
  createPopup: (data: FormData) =>
    instance.post('/popup', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePopup: (id: number, data: FormData) =>
    instance.patch(`/popup/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePopup: (id: number) => instance.delete(`/popup/${id}`),

  // --- 참여 대학 (Network) ---
  getNetworks: () => instance.get('/network'),
  createNetwork: (data: FormData) =>
    instance.post('/network', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateNetwork: (id: number, data: FormData) =>
    instance.patch(`/network/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteNetwork: (id: number) => instance.delete(`/network/${id}`),

  // --- 활동 (Activity) ---
  getActivities: () => instance.get('/activity'),
  createActivity: (data: FormData) =>
    instance.post('/activity', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateActivity: (id: number, data: FormData) =>
    instance.patch(`/activity/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteActivity: (id: number) => instance.delete(`/activity/${id}`),
  // 화면에 보이는 순서대로의 id 목록을 넘기면 서버가 sortOrder를 1부터 다시 매긴다.
  reorderActivities: (ids: number[]) =>
    instance.patch('/activity/reorder', { ids }),

  // --- 지원 안내 (JoinUs) ---
  getJoinForms: () => instance.get('/joinus'),
  updateJoinForm: (type: string, data: JoinFormPayload) =>
    instance.patch(`/joinus/${type}`, data),

  // --- 광고 배너 (Advertisement) ---
  // 공개용은 활성 광고만, 관리자용은 비활성까지 포함한다.
  getAdvertisements: () => instance.get('/advertisement'),
  getAllAdvertisements: () => instance.get('/advertisement/admin'),
  createAdvertisement: (data: FormData) =>
    instance.post('/advertisement', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateAdvertisement: (id: number, data: FormData) =>
    instance.patch(`/advertisement/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteAdvertisement: (id: number) => instance.delete(`/advertisement/${id}`),

  // --- 협력사 (Partner) ---
  getPartners: () => instance.get('/partner'),
  createPartner: (data: FormData) =>
    instance.post('/partner', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePartner: (id: number, data: FormData) =>
    instance.patch(`/partner/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePartner: (id: number) => instance.delete(`/partner/${id}`),
};
