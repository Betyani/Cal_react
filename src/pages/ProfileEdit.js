import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';

// 회원가입과 동일한 비밀번호 정책
const PW_POLICY = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~]).{8,}$/;
const NICKNAME_POLICY =/^(?=.{2,12}$)[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}A-Za-z0-9ー]+$/u;
const EMAIL_POLICY = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateNicknameInput = (nickname) => {
  if (!nickname || !nickname.trim()) return '⚠️ 先にニックネームを入力してください。';
  if (/\s/.test(nickname)) return '❌ 空白は使用できません。';
  if (!NICKNAME_POLICY.test(nickname)) return '❌ 2〜12文字で、記号を使わずに入力してください。';
  return null; 
};

const validateEmailInput = (email) => {
  const trimmed = (email || '').trim();
  if (!trimmed) return '⚠️ 先にメールアドレスを入力してください。';
  if (/\s/.test(email)) return '❌  空白は使用できません。';
  if (!EMAIL_POLICY.test(trimmed)) return '❌ メールアドレスを正しく入力してください。';
  return null; 
};
export default function EditProfile() {
  // 내 정보
  const [info, setInfo] = useState({ id: '', name: '', nickname: '', email: '', role: 'USER' });
  // 원본(변경 여부 판단)
  const [original, setOriginal] = useState({ nickname: '', email: '' });

  // 비밀번호 입력 + 메시지/검증 상태
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [matchMsg, setMatchMsg] = useState('');
  const [validPw, setValidPw] = useState(false);

  // 현재 비밀번호 서버 검증 결과(회원가입의 “중복 확인” UX와 동일)
  const [currentChecked, setCurrentChecked] = useState(false);
  const [currentMsg, setCurrentMsg] = useState('');

  // 닉네임/이메일 중복 확인 상태
  const [nicknameChecked, setNicknameChecked] = useState(true);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [emailChecked, setEmailChecked] = useState(true);
  const [emailMessage, setEmailMessage] = useState('');

  // 비번 보기/숨김
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 상단 안내문 & 로딩
  const [formMessage, setFormMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 최초 로딩: 내 정보 조회
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('loggedInUser'));
    const id = saved?.id || saved?.username;
    if (!id) { setFormMessage('ログイン情報がありません。'); return; }

    axios.get('http://localhost:8080/cal/member/find-by-id', {
      params: { id },
      withCredentials: true,
    })
    .then(({ data }) => {
      setInfo({
        id: data.id,
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        role: data.role || 'USER',
      });
      setOriginal({ nickname: data.nickname, email: data.email });
    })
    .catch(() => setFormMessage('회원 정보 불러오기 실패'));
  }, []);

  // 정보 입력 변경
  const onInfo = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));

    // 값이 바뀌면 중복확인 상태 리셋 (원래 값이면 통과 유지)
    if (name === 'nickname') {
      setNicknameChecked(value === original.nickname);
      setNicknameMessage('');
    }
    if (name === 'email') {
      setEmailChecked(value === original.email);
      setEmailMessage('');
    }
  };


  // 비밀번호 입력/검증
  const onPw = (e) => {
    const { name, value } = e.target;
    const next = { ...pw, [name]: value };
    setPw(next);

    if (name === 'next') {
      if (!value) { setPwMsg(''); setValidPw(false); }
      else {
        const ok = PW_POLICY.test(value);
        setValidPw(ok);
        setPwMsg(ok ? '✅ 強力なパスワード' : '❌ 英字・数字・記号を含む8文字以上');
      }
    }
    if (next.next && next.confirm) {
      setMatchMsg(next.next === next.confirm ? '✅ 新しいパスワードが一致しています。' : '❌ 新しいパスワードが一致していません。');
    } else {
      setMatchMsg('');
    }

    if (name === 'current') {
      setCurrentChecked(false);
      setCurrentMsg('');
    }
  };

  // 현재 비밀번호 확인(서버)
  const verifyCurrent = async () => {
    if (!pw.current) { setCurrentMsg('⚠️ 現在のパスワードを入力してください。'); setCurrentChecked(false); return; }
    try {
      await axios.post(
        'http://localhost:8080/cal/member/login',
        { id: info.id, password: pw.current },
        { withCredentials: true }
      );
      setCurrentChecked(true);
      setCurrentMsg('✅ 現在のパスワードを確認しました。.');
    } catch {
      setCurrentChecked(false);
      setCurrentMsg('❌ 現在のパスワードが一致しません。');
    }
  };

  // 닉네임/이메일 중복 확인
  const checkNickname = async () => {
    if (info.nickname === original.nickname) { setNicknameChecked(true); setNicknameMessage(''); return; }
  const err = validateNicknameInput(info.nickname);
    if (err) {setNicknameMessage(err); setNicknameChecked(false); return; }

    try {
      const { data } = await axios.get('http://localhost:8080/cal/member/check-nickname', {
        params: { nickname: info.nickname },
      });
      const msg = String(data);
      setNicknameMessage(msg);
     setNicknameChecked( /(?:사용\s*가능|使用可能|利用可能|\bavailable\b)/i.test(msg) &&!/(?:불\s*가능|不可能|\bunavailable\b)/i.test(msg)
     );
    } catch (err) {
      setNicknameMessage(err.response?.data || '중복 확인 중 오류');
      setNicknameChecked(false);
    }
  };
  const checkEmail = async () => {
    if (info.email === original.email) { setEmailChecked(true); setEmailMessage(''); return; }
  const err = validateEmailInput(info.email);
    if (err) {setEmailMessage(err); setEmailChecked(false); return; }

    try {
      const { data } = await axios.get('http://localhost:8080/cal/member/check-email', {
        params: { email: info.email },
      });
      const msg = String(data);
      setEmailMessage(msg);
      setEmailChecked(/(?:사용\s*가능|使用可能|利用可能|\bavailable\b)/i.test(msg) &&!/(?:불\s*가능|不可能|\bunavailable\b)/i.test(msg)
     );
    } catch (err) {
      setEmailMessage(err.response?.data || '중복 확인 중 오류');
      setEmailChecked(false);
    }
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    const changedNickname  = info.nickname !== original.nickname;
    const changedEmail     = info.email    !== original.email;
    const changingPassword = !!(pw.current || pw.next || pw.confirm);

    if (!changedNickname && !changedEmail && !changingPassword) {
      setFormMessage('変更内容がありません。');
      return;
    }
    
     try {
     setLoading(true);

    // ✅ 비번 안 바꾸면 password 필드 자체를 빼서 보냄
    const payload = {
      id: info.id,
      nickname: info.nickname,
      email: info.email,
      role: info.role,
    };
    if (changingPassword) payload.password = pw.next;

    const res = await axios.post(
      'http://localhost:8080/cal/member/update',
      payload,
      { withCredentials: true }
    );

    //  성공하면 작은 창으로 메시지 출력
    alert(res.data?.message || '会員情報が更新されました。');

    //  새 세션 정보 다시 받아서 로컬에도 반영 (상단 닉네임 즉시 갱신용)
    try {
      const fresh = await axios.get('http://localhost:8080/cal/member/status', { withCredentials: true });
      localStorage.setItem('loggedInUser', JSON.stringify(fresh.data));
    } catch {}

    navigate('/'); // 원하는 페이지로 이동
  } catch (err) {
    setFormMessage(err.response?.data?.message || '更新に失敗しました。時間をおいてから再度お試しください。');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={account.wrap}>
      <div className={account.card}>
        <h2 className={account.title}>マイページ</h2>

        {formMessage && <p className={`${account.help} ${account.err}`}>{formMessage}</p>}

        {/* 읽기 전용 정보 */}
        <div className={account.section}>
          <div className={account.formRow}>
            <label className={account.label}>ユーザーID</label>
            <input className={account.input} name="id" value={info.id} readOnly />
          </div>
          <div className={account.formRow}>
            <label className={account.label}>名前</label>
            <input className={account.input} name="name" value={info.name} readOnly />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={account.form}>
          {/* 비밀번호 변경 */}
          <div className={account.section}>
            <h2 className={account.sectionTitle}>パスワードの変更</h2>

            {/* 현재 비밀번호 + 확인 버튼 */}
            <div className={account.formRow}>
              <label className={account.label}>現在のパスワード</label>
              <div className={account.inlineRow}>
                <input
                  name="current"
                  value={pw.current}
                  onChange={onPw}
                  className={account.input}
                  placeholder="現在のパスワード"
                />

                <button type="button" className={account.ghostButton} onClick={verifyCurrent}>
                  確認
                </button>
              </div>
              {currentMsg && (
                <p className={`${account.help} ${currentChecked ? account.ok : account.err}`}>{currentMsg}</p>
              )}
            </div>

            {/* 새 비밀번호 */}
            <div className={account.formRow}>
              <label className={account.label}>新しいパスワード</label>
              <div className={account.inlineRow}>
                <input
                  type={showNext ? 'text' : 'password'}
                  name="next"
                  value={pw.next}
                  onChange={onPw}
                  className={account.input}
                  placeholder="英字・数字・記号を含む8文字以上"
                />
                <button type="button" className={account.inlineButton} onClick={() => setShowNext(v => !v)}>
                  {showNext ? '非表示' : '表示'}
                </button>
              </div>
              {pwMsg && <p className={`${account.help} ${validPw ? account.ok : account.err}`}>{pwMsg}</p>}
            </div>

            {/* 새 비밀번호 확인 */}
            <div className={account.formRow}>
              <label className={account.label}>新しいパスワード（確認）</label>
              <div className={account.inlineRow}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  value={pw.confirm}
                  onChange={onPw}
                  className={account.input}
                  placeholder="もう一度入力してください。"
                />
                <button type="button" className={account.inlineButton} onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? '非表示' : '表示'}
                </button>
              </div>
              {matchMsg && (
                <p className={`${account.help} ${matchMsg.startsWith('✅') ? account.ok : account.err}`}>{matchMsg}</p>
              )}
            </div>
          </div>

          {/* 닉네임 / 이메일 */}
          <div className={account.section}>
            <h3 className={account.sectionTitle}>ニックネーム / メールアドレス 変更</h3>

            <div className={account.formRow}>
              <label className={account.label}>ニックネーム</label>
              <input
                className={account.input}
                name="nickname"
                value={info.nickname}
                onChange={onInfo}
                placeholder="ニックネーム"
              />
              <button type="button" className={account.ghostButton} onClick={checkNickname}>
                確認
              </button>
              {nicknameMessage && (
                <p className={`${account.help} ${nicknameChecked ? account.ok : account.err}`}>{nicknameMessage}</p>
              )}
            </div>

            <div className={account.formRow}>
              <label className={account.label}>メールアドレス</label>
              <input
                className={account.input}
                name="email"
                value={info.email}
                onChange={onInfo}
                placeholder="email@example.com"
              />
              <button type="button" className={account.ghostButton} onClick={checkEmail}>
                メール確認
              </button>
              {emailMessage && (
                <p className={`${account.help} ${emailChecked ? account.ok : account.err}`}>{emailMessage}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={account.submit}
            disabled={
              loading ||
              ((pw.current || pw.next || pw.confirm) &&
                (!validPw || pw.next !== pw.confirm || !currentChecked)) ||
              
              ((info.nickname !== original.nickname) && !nicknameChecked) ||
              ((info.email !== original.email) && !emailChecked)
            }
          >
            {loading ? '保存中…' : '会員情報を変更'}
          </button>
        </form>
      </div>
    </div>
  );
}
