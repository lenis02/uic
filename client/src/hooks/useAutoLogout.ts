// src/hooks/useAutoLogout.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../api/auth';

const useAutoLogout = (expireTime: number = 30 * 60 * 1000) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔴 기존: let timer: NodeJS.Timeout;
    // 🟢 수정: 브라우저/노드 상관없이 동작하는 만능 타입
    let timer: ReturnType<typeof setTimeout>;

    const logout = () => {
      console.log('⏳ 활동 없음으로 자동 로그아웃');
      removeToken();
      alert('장시간 활동이 없어 자동 로그아웃 되었습니다.');
      navigate('/login');
    };

    const resetTimer = () => {
      clearTimeout(timer);
      if (getToken()) {
        timer = setTimeout(logout, expireTime);
      }
    };

    const events = ['mousemove', 'click', 'keydown', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate, expireTime]);
};

export default useAutoLogout;
