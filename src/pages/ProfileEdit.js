// src/pages/EditProfile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';

// 회원가입과 동일한 비밀번호 정책
const PW_POLICY = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~]).{8,}$/;

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
    if (!id) { setFormMessage('로그인 정보가 없습니다.'); return; }

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
        setPwMsg(ok ? '✅ 강력한 비밀번호' : '❌ 영문+숫자+특수문자 포함 8자 이상');
      }
    }
    if (next.next && next.confirm) {
      setMatchMsg(next.next === next.confirm ? '✅ 새 비밀번호가 일치합니다.' : '❌ 새 비밀번호가 일치하지 않습니다.');
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
    if (!pw.current) { setCurrentMsg('⚠️ 현재 비밀번호를 입력하세요.'); setCurrentChecked(false); return; }
    try {
      await axios.post(
        'http://localhost:8080/cal/member/login',
        { id: info.id, password: pw.current },
        { withCredentials: true }
      );
      setCurrentChecked(true);
      setCurrentMsg('✅ 기존 비밀번호가 확인되었습니다.');
    } catch {
      setCurrentChecked(false);
      setCurrentMsg('❌ 기존 비밀번호가 맞지 않습니다.');
    }
  };

  // 닉네임/이메일 중복 확인
  const checkNickname = async () => {
    if (info.nickname === original.nickname) { setNicknameChecked(true); setNicknameMessage(''); return; }
    try {
      const { data } = await axios.get('http://localhost:8080/cal/member/check-nickname', {
        params: { nickname: info.nickname },
      });
      const msg = String(data);
      setNicknameMessage(msg);
      setNicknameChecked(msg.includes('사용 가능'));
    } catch (err) {
      setNicknameMessage(err.response?.data || '중복 확인 중 오류');
      setNicknameChecked(false);
    }
  };
  const checkEmail = async () => {
    if (info.email === original.email) { setEmailChecked(true); setEmailMessage(''); return; }
    try {
      const { data } = await axios.get('http://localhost:8080/cal/member/check-email', {
        params: { email: info.email },
      });
      const msg = String(data);
      setEmailMessage(msg);
      setEmailChecked(msg.includes('사용 가능'));
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
      setFormMessage('변경된 내용이 없습니다.');
      return;
    }

    if (changingPassword) {
      if (!validPw) { setFormMessage('새 비밀번호 형식이 올바르지 않습니다.'); 
        return; }
      if (pw.next !== pw.confirm) { setFormMessage('새 비밀번호가 일치하지 않습니다.');
         return; }
      if (!currentChecked) { setFormMessage('현재 비밀번호 확인을 완료하세요.');
         return; }
    }
    if (changedNickname && !nicknameChecked) { setFormMessage('닉네임 중복 확인을 완료하세요.'); return; }
    if (changedEmail && !emailChecked) { setFormMessage('이메일 중복 확인을 완료하세요.'); return; }

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

    // ✅ 성공하면 작은 창(알럿)으로 메시지 출력
    alert(res.data?.message || '회원 정보가 수정되었습니다.');

    // ✅ 새 세션 정보 다시 받아서 로컬에도 반영 (상단 닉네임 즉시 갱신용)
    try {
      const fresh = await axios.get('http://localhost:8080/cal/member/status', { withCredentials: true });
      localStorage.setItem('loggedInUser', JSON.stringify(fresh.data));
    } catch {}

    navigate('/'); // 원하는 페이지로 이동
  } catch (err) {
    setFormMessage(err.response?.data?.message || '수정 실패. 잠시 후 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={account.wrap}>
      <div className={account.card}>
        <h2 className={account.title}>회원 정보 수정</h2>

        {formMessage && <p className={`${account.help} ${account.err}`}>{formMessage}</p>}

        {/* 읽기 전용 정보 */}
        <div className={account.section}>
          <h3 className={account.sectionTitle}>내 정보</h3>
          <div className={account.formRow}>
            <label className={account.label}>아이디</label>
            <input className={account.input} name="id" value={info.id} readOnly />
          </div>
          <div className={account.formRow}>
            <label className={account.label}>이름</label>
            <input className={account.input} name="name" value={info.name} readOnly />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={account.form}>
          {/* 비밀번호 변경 */}
          <div className={account.section}>
            <h3 className={account.sectionTitle}>비밀번호 변경</h3>

            {/* 현재 비밀번호 + 확인 버튼 */}
            <div className={account.formRow}>
              <label className={account.label}>현재 비밀번호</label>
              <div className={account.inlineRow}>
                <input
                  name="current"
                  value={pw.current}
                  onChange={onPw}
                  className={account.input}
                  placeholder="현재 비밀번호"
                />

                <button type="button" className={account.ghostButton} onClick={verifyCurrent}>
                  현재 비밀번호 확인
                </button>
              </div>
              {currentMsg && (
                <p className={`${account.help} ${currentChecked ? account.ok : account.err}`}>{currentMsg}</p>
              )}
            </div>

            {/* 새 비밀번호 */}
            <div className={account.formRow}>
              <label className={account.label}>새 비밀번호</label>
              <div className={account.inlineRow}>
                <input
                  type={showNext ? 'text' : 'password'}
                  name="next"
                  value={pw.next}
                  onChange={onPw}
                  className={account.input}
                  placeholder="영문+숫자+특수문자 8자 이상"
                />
                <button type="button" className={account.inlineButton} onClick={() => setShowNext(v => !v)}>
                  {showNext ? '숨김' : '보기'}
                </button>
              </div>
              {pwMsg && <p className={`${account.help} ${validPw ? account.ok : account.err}`}>{pwMsg}</p>}
            </div>

            {/* 새 비밀번호 확인 */}
            <div className={account.formRow}>
              <label className={account.label}>새 비밀번호 확인</label>
              <div className={account.inlineRow}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  value={pw.confirm}
                  onChange={onPw}
                  className={account.input}
                  placeholder="새 비밀번호 확인"
                />
                <button type="button" className={account.inlineButton} onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? '숨김' : '보기'}
                </button>
              </div>
              {matchMsg && (
                <p className={`${account.help} ${matchMsg.startsWith('✅') ? account.ok : account.err}`}>{matchMsg}</p>
              )}
            </div>
          </div>

          {/* 닉네임 / 이메일 */}
          <div className={account.section}>
            <h3 className={account.sectionTitle}>닉네임 / 이메일 수정</h3>

            <div className={account.formRow}>
              <label className={account.label}>닉네임</label>
              <input
                className={account.input}
                name="nickname"
                value={info.nickname}
                onChange={onInfo}
                placeholder="닉네임"
              />
              <button type="button" className={account.ghostButton} onClick={checkNickname}>
                중복 확인
              </button>
              {nicknameMessage && (
                <p className={`${account.help} ${nicknameChecked ? account.ok : account.err}`}>{nicknameMessage}</p>
              )}
            </div>

            <div className={account.formRow}>
              <label className={account.label}>이메일</label>
              <input
                className={account.input}
                name="email"
                value={info.email}
                onChange={onInfo}
                placeholder="email@example.com"
              />
              <button type="button" className={account.ghostButton} onClick={checkEmail}>
                이메일 중복 확인
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
            {loading ? '저장 중…' : '회원정보 수정'}
          </button>
        </form>
      </div>
    </div>
  );
}
