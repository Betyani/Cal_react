import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useAuth() {
  const [user, setUser] = useState(null); // 사용자 정보 { id, role, nickname? }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let closed = false;    //setState 방지 플래그 (경고방지로)
    (async () => {
      try {
        const res = await axios.get('http://localhost:8080/cal/member/status', {
          withCredentials: true
        });
        if (!closed) setUser(res.data);  //상태반영
      }
      catch {
        if (!closed) setUser(null);  //로그인 안된 상태 처리
      }
      finally {
        if (!closed) setLoading(false); //로딩 종료
      }
    })();

    return () => { closed = true; };
  }, [location.pathname]);      //URL 경로가 바뀔 때마다 로그인 세션 상태

  const isLoggedIn = !!user;       //관리자 
  const isMaster = user?.role === 'MASTER';

  // 어떤 동작을 하기 전에 로그인 요구하는 래퍼
  const requireLogin = (fn) => (...args) => {
    if (!isLoggedIn) {
      alert('로그인 해주세요');
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    fn?.(...args);
  };


  const handleLogout = async () => {
    try { await axios.post('http://localhost:8080/cal/member/logout', {}, { withCredentials: true }); } catch { }
    localStorage.removeItem('loggedInUser');
    setUser(null);
    navigate('/');
    alert('로그아웃 완료');
  };

  return { user, isLoggedIn, isMaster, requireLogin, handleLogout, loading };
}