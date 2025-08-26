// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useAuth() {
  const [user, setUser]   = useState(null); // 사용자 정보 { id, role, nickname? }
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

        const data = normalizeStatus(res.data); // 문자열이 와도 처리 자동으로 통일형태로 전환
        if (!closed) setUser(data);  //상태반영
      } 
      catch {
        if (!closed) setUser(null);  //로그인 안된 상태 처리
      } 
      finally {
        if (!closed) setLoading(false); //로딩 종료
      }
    })();

    return () => { closed = true; };
  }, [location.pathname]);

  const isLoggedIn = !!user;       //관리자 
  const isMaster    = user?.role === 'MASTER';

  //권한 체크형태
  const canEdit = (ownerId) => {
    if (!isLoggedIn) return false;
    return isMaster
 || user.id === ownerId; // 본인 or 관리자
  };

  // 어떤 동작을 하기 전에 로그인 요구하는 래퍼
  const requireLogin = (fn) => (...args) => {
    if (!isLoggedIn) {
      alert('로그인 해주세요');
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    fn?.(...args);
  };

  const handleLoginSuccess = (payload) => {
    // payload는 { id, role, nickname? } 형태로 저장하면 가장 깔끔
    localStorage.setItem('loggedInUser', JSON.stringify(payload));
    setUser(payload);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/cal/member/logout', {}, { withCredentials: true });
    } catch {}
    localStorage.removeItem('loggedInUser');
    setUser(null);
    navigate('/');
    alert('로그아웃 완료');
  };

  return { user, isLoggedIn, isMaster
, canEdit, requireLogin, handleLoginSuccess, handleLogout, loading };
}

// 서버가 문자열을 줘도 최대한 뽑아보기
function normalizeStatus(raw) {
  // JSON 형태로 있고 id가 있으면 그대로 사용
  if (raw && typeof raw === 'object' && raw.id) return raw;

  // 문자열:  "현재 로그인한 사용자: xxx"
  if (typeof raw === 'string') {
    const idx = raw.indexOf(':');
    if (idx >= 0) {
      const id = raw.slice(idx + 1).trim();
      if (id) return { id, role: 'USER' }; // 역할 모르면 기본 USER
    }
  }

  // localStorage 백업
  try {
    const ls = localStorage.getItem('loggedInUser');
    if (ls) {
      const obj = JSON.parse(ls);
      if (obj?.id) return obj;
    }
  } catch {}

  return null;
}
