import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';


export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ id: '', pw: '' });
  const navigate = useNavigate();                              //페

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/cal/member/login',
        {
          id: form.id,
          password: form.pw
        },
        { withCredentials: true }
      );

      // 🔔 응답 상태 체크 후 로그인 성공 처리
   if (response.status === 200) {
      alert('로그인 성공');


     // ✅ 로그인 성공 시 사용자 정보 저장
    localStorage.setItem('loggedInUser', JSON.stringify({ id: form.id }));

   if (onLoginSuccess) {
    onLoginSuccess(); // 👈 여기서 부모에게 알려주는 역할
     }

     // ✅ redirect 경로 확인 후 이동
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo, {replace: true });



    } else {
      alert('로그인 실패');
      localStorage.removeItem('loggedInUser');  // ✅ 실패 시에는 삭제
    }
  } catch (error) {
    console.error('❌ 로그인 실패:', error);
    alert('로그인 실패');
    localStorage.removeItem('loggedInUser');  // ✅ 예외 발생 시에도 삭제
  }
};

 return (
    <div className={account.wrap}>
      <div className={account.card}>
        <h2 className={account.title}>로그인</h2>
        <form onSubmit={handleLogin} className={account.form}>
          <div className={account.formRow}>
            <label className={account.label}>아이디</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              required
              className={account.input}
               placeholder="아이디"
            />
          </div>
          <div className={account.formRow}>
            <label className={account.label}>비밀번호</label>
            <input
              type="password"
              name="pw"
              value={form.pw}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="비밀번호"
            />
          </div>
          <button type="submit" className={account.button}>
            로그인
          </button>
        </form>
      
      
      
      {/* 👇 추가: 아이디/비번 찾기 하단 액션 */}
        <div className={account.subActions}>
          <button
            type="button"
            className={account.ghostButton}
            onClick={() => navigate('/find-id')}
          >
            아이디 찾기
          </button>
          <span className={account.divider} />
          <button
            type="button"
            className={account.ghostButton}
            onClick={() => navigate('/find-password')}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  );
}
