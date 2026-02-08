// src/components/auth/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // 1. 토큰이 있는지 확인 (localStorage 또는 sessionStorage)
  // ⚠️ 주의: 백엔드와 약속된 키 이름이 'accessToken'인지 'token'인지 확인하세요.
  const token = localStorage.getItem('accessToken');

  // 2. 토큰 유효성 검사 (심화: 여기서 jwt-decode로 만료 시간 체크도 가능)
  // 일단 토큰이 없으면 비로그인으로 간주
  if (!token) {
    alert('관리자 로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  // 3. 토큰 있으면 자식 라우트(Admin 페이지) 보여줌
  return <Outlet />;
};

export default PrivateRoute;
