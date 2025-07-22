import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export default function Register() {
  const [form, setForm] = useState({
    id: '',
    pw: '',
    name: '',
    email: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8080/cal/member/register', {
        username: form.id,    // 🔔 서버는 username으로 받음
        password: form.pw,    // 🔔 서버는 password로 받음
        name: form.name,
        email: form.email
      });
      alert('회원가입 성공');
      navigate('/login');
    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      alert('회원가입 실패');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
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
        <div>
          <label>이름:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}