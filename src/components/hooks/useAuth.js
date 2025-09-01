import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function useAuth() {
  const [user, setUser] = useState(null); // 사용자 정보 { id, role, nickname? }
  const [loading, setLoading] = useState(true);
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


  return { user, isLoggedIn, isMaster, loading };
}