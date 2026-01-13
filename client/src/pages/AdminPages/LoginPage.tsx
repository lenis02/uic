import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.login(username, password);
      // 로그인 성공 시 약간의 딜레이를 주어 사용자가 성공 피드백을 느끼게 함 (선택)
      navigate('/admin/greeting');
    } catch (error) {
      alert('로그인 실패! 아이디와 비밀번호를 확인해주세요.');
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black/50 overflow-hidden">
      {/* --- 배경 장식 (Glow Effects) --- */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-800/20 blur-[120px] rounded-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />

      {/* --- 메인 카드 (Glassmorphism) --- */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          {/* 타이틀 영역 */}
          <div className="text-center mb-4">
            <h1 className="text-4xl pb-1 font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-700 to-gray-800 mb-2 drop-shadow-sm">
              Admin Login
            </h1>
            <p className="text-gray-300 text-sm font-medium">
              Management System Login
            </p>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="space-y-6 flex flex-col ">
            {/* 아이디 입력 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                  {/* User Icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="아이디를 입력하세요"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent block pl-10 p-3 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-300">
                  {/* Lock Icon SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent block pl-10 p-3 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              disabled={isLoading}
              className={`w-full sm:w-auto px-12 py-4 text-xs font-black tracking-[0.2em] uppercase
                           text-white/60 bg-transparent border border-white/10
                           hover:bg-gradient-to-br hover:from-[#001a4d] hover:via-[#003399] hover:to-[#001a4d] 
                           hover:border-blue-500/50 hover:text-white
                           hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(30,58,138,0.4)] 
                           active:scale-[0.97] transition-all duration-500 ${
                             isLoading ? 'opacity-70 cursor-not-allowed' : ''
                           }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'LOG IN'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
