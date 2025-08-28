import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';

// 🔹 형식 검사 정규식
const id_POLICY = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{4,12}$/;
const pw_POLICY = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~]).{8,}$/;
const nickname_POLICY = /^[가-힣a-zA-Z0-9]{2,12}$/;
const email_POLICY = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
  const [form, setForm] = useState({
    id: '',
    pw: '',
    name: '',
    nickname: '',
    email: ''
  });

  // ✅ 비밀번호만 실시간 메시지/검증 사용
  const [validationMessage, setValidationMessage] = useState({ pw: '' });
  const [valid, setValid] = useState({ pw: false });

  const navigate = useNavigate();

  const [idChecked, setIdChecked] = useState(false);
  const [idMessage, setIdMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');


  // 비밀번호만 검증
  const validatePw = (value) => {
    const ok = pw_POLICY.test(value);
    setValidationMessage((prev) => ({
      ...prev,
      pw: value ? (ok ? '✅ 강력한 비밀번호' : '❌ 영문+숫자+특수문자 포함 8자 이상') : ''
    }));
    setValid((prev) => ({ ...prev, pw: ok }));
  };

  // onChange: 값 반영 + 비번만 즉시 검증, 나머지는 중복체크 상태 리셋
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));


    if (name === 'pw') {
      validatePw(value);
    }
    if (name === 'id') {
      setIdChecked(false);
      setIdMessage('');
    } 
    if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMessage('');
    } 
    if (name === 'email') {
      setEmailChecked(false);
      setEmailMessage('');
    }
  };

  // 회원가입
  const handleRegister = async (e) => {
    e.preventDefault();

    // 비번 + 3중 중복확인 + 이름 입력
    const ready =
      valid.pw && idChecked && nicknameChecked && emailChecked && form.name.trim();

    if (!ready) {
      alert('입력 형식 및 중복 확인을 완료해주세요.');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8080/cal/member/register',
        {
          id: form.id.trim(),
          password: form.pw,             //  공백 허용 trim() 만 넣으면 됨 쫌 외우자 
          name: form.name.trim(),
          nickname: form.nickname.trim(),
          email: form.email.trim()
        }
      );
      alert('회원가입 성공');
      navigate('/login');
    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      alert('회원가입 실패');
    }
  };
console.log("중복확인 상태:", idChecked, nicknameChecked, emailChecked);

  return (
    <div className={account.wrap}>
      <div className={account.card}>
        <h2 className={account.title}>회원가입</h2>

        <form onSubmit={handleRegister} className={account.form}>
          {/* 아이디 */}
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
            <button
              type="button"
              className={account.ghostButton}
              onClick={async () => {
                const idCheck = form.id.trim();
                if (!idCheck) {
                  setIdMessage('⚠️ 아이디를 먼저 입력하세요.');
                  setIdChecked(false);
                  return;
                }
                if (!id_POLICY.test(idCheck)) {
                  setIdMessage('❌ 영문+숫자 4~12자 입력');
                  setIdChecked(false);
                  return;
                }
                try {
                  const res = await axios.get(
                    'http://localhost:8080/cal/member/check-id',
                    { params: { id: idCheck } }   // ← 자동 인코딩
                  );
                  const msg = String(res.data);
                  setIdMessage(msg);
                  setIdChecked(msg.includes('사용 가능'));
                } catch (err) {
                  setIdMessage(err.response?.data || '중복 확인 중 오류 발생');
                  setIdChecked(false);
                }
              }}
            >
              아이디 중복 확인
            </button>
          </div>
          {idMessage && (
            <p className={`${account.help} ${idMessage.includes('사용 가능') ? account.ok : account.err}`}>
              {idMessage}
            </p>
          )}

          {/* 비밀번호 */}
          <div className={account.formRow}>
            <label className={account.label}>비밀번호</label>
            <div className={account.inlineRow}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="pw"
                value={form.pw}
                onChange={handleChange}
                required
                className={account.input}
                placeholder="영문+숫자+특수문자 포함 8자 이상"
              />
              <button
                type="button"
                className={account.inlineButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '숨김' : '보기'}
              </button>
            </div>
            <p style={{ color: valid.pw ? 'green' : 'red' }}>{validationMessage.pw}</p>
          </div>

          {/* 이름 */}
          <div className={account.formRow}>
            <label className={account.label}>이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="이름"
            />
          </div>

          {/* 닉네임 */}
          <div className={account.formRow}>
            <label className={account.label}>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="닉네임"
            />
            <button
              type="button"
              className={account.ghostButton}
              onClick={async () => {
                const nicknameCheck = form.nickname;
                if (!nicknameCheck.trim()) {
                  setNicknameMessage('⚠️ 닉네임을 먼저 입력하세요.');
                  setNicknameChecked(false);
                  return;
                }
                if (/\s/.test(nicknameCheck)) {
                  setNicknameMessage('❌ 공백은 사용할 수 없습니다.');
                  setNicknameChecked(false);
                  return;
                }
                if (!nickname_POLICY.test(nicknameCheck)) {
                  setNicknameMessage('❌ 특수문자 없이 2~12자 입력');
                  setNicknameChecked(false);
                  return;
                }
                try {
                  const res = await axios.get(
                    'http://localhost:8080/cal/member/check-nickname',
                    { params: { nickname: nicknameCheck } }
                  );
                  const msg = String(res.data);
                  setNicknameMessage(msg);
                  setNicknameChecked(msg.includes('사용 가능'));
                } catch (err) {
                  setNicknameMessage(err.response?.data || '중복 확인 중 오류 발생');
                  setNicknameChecked(false);
                }
              }}
            >
              중복 확인
            </button>

            <p className={`${account.help} ${nicknameChecked ? account.ok : account.err}`}>
              {nicknameMessage}
            </p>
          </div>

          {/* 이메일 */}
          <div className={account.formRow}>
            <label className={account.label}>이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="email@example.com"
            />

            <button
              type="button"
              className={account.ghostButton}
              onClick={async () => {
                const emailCheck = form.email.trim();
                if (!emailCheck) {
                  setEmailMessage('⚠️ 이메일을 먼저 입력하세요.');
                  setEmailChecked(false);
                  return;
                }
                if (!email_POLICY.test(emailCheck)) {
                  setEmailMessage('❌ 이메일 형식이 올바르지 않습니다.');
                  setEmailChecked(false);
                  return;
                }
                try {
                  const res = await axios.get(
                    'http://localhost:8080/cal/member/check-email',
                    { params: { email: emailCheck } }
                  );
                  const msg = String(res.data);
                  setEmailMessage(msg);
                  setEmailChecked(msg.includes('사용 가능'));
                } catch (err) {
                  setEmailMessage(err.response?.data || '중복 확인 중 오류 발생');
                  setEmailChecked(false);
                }
              }}
            >
              이메일 중복 확인
            </button>

            <p className={`${account.help} ${emailChecked ? account.ok : account.err}`}>{emailMessage}</p>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={
              !valid.pw ||     
              !idChecked ||    
              !nicknameChecked || 
              !emailChecked ||    
              !form.name.trim()   // 이름 입력
            }
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
