// src/utils/auth.ts (파일 생성)

export const getToken = () => sessionStorage.getItem('accessToken');
export const setToken = (token: string) =>
  sessionStorage.setItem('accessToken', token);
export const removeToken = () => sessionStorage.removeItem('accessToken');
