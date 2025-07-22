import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ id: '', pw: '' });
  const navigate = useNavigate();

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
          username: form.id,
          password: form.pw
        },
        { withCredentials: true }
      );

      // 🔔 응답 상태 체크 후 로그인 성공 처리
   if (response.status === 200) {
      localStorage.setItem('loggedInUser', form.id);  // ✅ 성공 시만 저장
      alert('로그인 성공');
      navigate('/');
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
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디:</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            name="pw"
            value={form.pw}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
