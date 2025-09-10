import React, { useState, useEffect } from 'react';     //useEffect 추가 → 성/이름이 바뀔 때 form.name = "姓 名" 으로 자동 결합하기 위해 넣었음
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';

// 🔹 형식 검사 정규식
const id_POLICY = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{4,12}$/;
const pw_POLICY = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~]).{8,}$/;
const nickname_POLICY =/^(?=.{2,12}$)[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z0-9ー]+$/u;
const email_POLICY = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
  const [form, setForm] = useState({
    id: '',
    pw: '',
    name: '',
    nickname: '',
    email: ''
  });

  const [firstName, setFirstName] = useState(''); // 姓
  const [lastName, setLastName] = useState('');   // 名

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

   const joinFullName = (fam, giv) => {
    const f = (fam ?? '').trim();
    const g = (giv ?? '').trim();
    return f && g ? `${f} ${g}` : (f || g); // ← 공백 포함(현재 설정)
    // return f && g ? `${f}${g}` : (f || g); // ← 공백 없이로 바꿀 곳
  };

    useEffect(() => {
    setForm(prev => ({ ...prev, name: joinFullName(firstName, lastName) }));
  }, [firstName, lastName]);


  // 비밀번호만 검증
  const validatePw = (value) => {
    const ok = pw_POLICY.test(value);
    setValidationMessage((prev) => ({
      ...prev,
      pw: value ? (ok ? '✅ 強力なパスワード' : '❌ 英字・数字・記号を含む8文字以上') : ''
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
    
    const finalName = joinFullName(firstName, lastName);

    // 비번 + 3중 중복확인 + 이름 입력
    const ready =
      valid.pw && idChecked && nicknameChecked && emailChecked && finalName;

    if (!ready) {
      alert('入力形式の確認と重複チェックを完了してください。');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8080/cal/member/register',
        {
          id: form.id.trim(),
          password: form.pw,             //  공백 허용 trim() 만 넣으면 됨 쫌 외우자 
          name: finalName, 
          nickname: form.nickname.trim(),
          email: form.email.trim()
        }
      );
      alert('会員登録が完了しました。');
      navigate('/login');
    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      alert('会員登録に失敗しました。');
    }
  };
  console.log("중복확인 상태:", idChecked, nicknameChecked, emailChecked);

  return (
    <div className={account.wrap}>
      <div className={account.card}>
        <h2 className={account.title}>会員登録</h2>

        <form onSubmit={handleRegister} className={account.form}>
          {/* 아이디 */}
          <div className={account.formRow}>
            <label className={account.label}>ユーザーID</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="英字と数字を含む4〜12文字"
            />
            <button
              type="button"
              className={account.ghostButton}
              onClick={async () => {
                const idCheck = form.id.trim();
                if (!idCheck) {
                  setIdMessage('⚠️ ユーザーIDを入力してください');
                  setIdChecked(false);
                  return;
                }
                if (!id_POLICY.test(idCheck)) {
                  setIdMessage('❌ 4〜12文字で、英字と数字を含めてください。');
                  setIdChecked(false);
                  return;
                }
                 try {
                  const res = await axios.get('http://localhost:8080/cal/member/check-id', { params: { id: idCheck } });
                  setIdMessage(String(res.data));
                  setIdChecked(true);
                } catch (err) {
                  setIdMessage(err.response?.data || '중복 확인 중 오류 발생');
                  setIdChecked(false);   
                }
              }}
            >
              確認
            </button>
          </div>
          {idMessage && (
            <p className={`${account.help} ${idChecked ? account.ok : account.err}`}>
              {idMessage}
              </p>
          )}

          {/* 비밀번호 */}
          <div className={account.formRow}>
            <label className={account.label}>パスワード</label>
            <div className={account.inlineRow}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="pw"
                value={form.pw}
                onChange={handleChange}
                required
                className={account.input}
                placeholder="英字・数字・記号を含む8文字以上"
              />
              <button
                type="button"
                className={account.inlineButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '非表示' : '表示'}
              </button>
            </div>
          </div>
          <p style={{ color: valid.pw ? 'green' : 'red' }}>{validationMessage.pw}</p>

          {/* 이름 */}
          <div className={account.formRow}>
            <label className={account.label}>名前</label>
            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={account.input}
                placeholder="姓"
              />
            </div>
            <div className={account.inlineRow} style={{ marginTop: 8 }}>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={account.input}
                placeholder="名"
              />
          </div>

          {/* 닉네임 */}
          <div className={account.formRow}>
            <label className={account.label}>ニックネーム</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              required
              className={account.input}
              placeholder="ニックネーム"
            />
            <button
              type="button"
              className={account.ghostButton}
              onClick={async () => {
                const nicknameCheck = form.nickname;
                if (!nicknameCheck.trim()) {
                  setNicknameMessage('⚠️ 先にニックネームを入力してください。');
                  setNicknameChecked(false);
                  return;
                }
                if (/\s/.test(nicknameCheck)) {
                  setNicknameMessage('❌ 空白は使用できません。');
                  setNicknameChecked(false);
                  return;
                }
                if (!nickname_POLICY.test(nicknameCheck)) {
                  setNicknameMessage('❌ 2〜12文字で、記号を使わずに入力してください。');
                  setNicknameChecked(false);
                  return;
                }
                try {
                  const res = await axios.get(
                    'http://localhost:8080/cal/member/check-nickname',
                    { params: { nickname: nicknameCheck } }
                  );
                  setNicknameMessage(String(res.data));
                  setNicknameChecked(true);    
                } catch (err) {
                  setNicknameMessage(err.response?.data || '중복 확인 중 오류 발생');
                  setNicknameChecked(false);
                }
              }}
            >
              確認
            </button>

            <p className={`${account.help} ${nicknameChecked ? account.ok : account.err}`}>
              {nicknameMessage}
            </p>
          </div>

          {/* 이메일 */}
          <div className={account.formRow}>
            <label className={account.label}>メールアドレス</label>
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
                  setEmailMessage('⚠️ 先にメールアドレスを入力してください。');
                  setEmailChecked(false);
                  return;
                }
                if (!email_POLICY.test(emailCheck)) {
                  setEmailMessage('❌ メールアドレスを正しく入力してください。');
                  setEmailChecked(false);
                  return;
                }
                try {
                  const res = await axios.get(
                    'http://localhost:8080/cal/member/check-email',
                    { params: { email: emailCheck } }
                  );
                 setEmailMessage(String(res.data));
                 setEmailChecked(true);   
                } 
                catch (err) {
                  const msg = err.response?.data || '중복 확인 중 오류 발생';
                  setEmailMessage(String(msg));       // "すでに使われているメールアドレスです。"
                  setEmailChecked(false);
                }
              }}
            >
              確認
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
              !form.name.trim()
            }
          >
            会員登録
          </button>
        </form>
      </div>
    </div>
  );
}
