import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';




export default function EditProfile() {
  const [info, setInfo] = useState({ id: '', name: '', nickname: '', email: '', role: 'USER' });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [nicknameMsg, setNicknameMsg] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  // 비밀번호 관련 상태/메시지
  const [isCurrentPwValid, setIsCurrentPwValid] = useState(false);
  const [currentPwMsg, setCurrentPwMsg] = useState('');
  const [matchMsg, setMatchMsg] = useState('');     // 새 비번=확인 일치 메시지
  const [pwRuleMsg, setPwRuleMsg] = useState('');   // 새 비번 규칙 메시지

  const navigate = useNavigate();

  // 새 비밀번호 정책: 영문 + 숫자 + 특수문자, 최소 8자
  const PW_POLICY = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const id = loggedInUser?.id || loggedInUser?.username; // 저장 구조에 맞춰 사용
    if (!id) {
      setError('로그인 정보가 없습니다.');
      return;
    }
    axios
      .get(`http://localhost:8080/cal/member/find-by-id?id=${id}`, { withCredentials: true })
      .then((res) => {
        setInfo({
          id: res.data.id,
          name: res.data.name,
          nickname: res.data.nickname,
          email: res.data.email,
          role: res.data.role || 'USER',
        });
        setOriginalNickname(res.data.nickname);
        setOriginalEmail(res.data.email);
      })
      .catch(() => setError('회원 정보 불러오기 실패'));
  }, []);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

 const updateMatchMsg = (next) => {
    const { newPassword, confirmPassword } = next;
    if (!newPassword && !confirmPassword) return setMatchMsg('');
    if (newPassword && confirmPassword) {
      setMatchMsg(newPassword === confirmPassword ? '✅ 새 비밀번호가 일치합니다.' : '❌ 새 비밀번호가 일치하지 않습니다.');
    } else {
      setMatchMsg('');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const next = { ...passwords, [name]: value };
    setPasswords(next);

    // 새 비번 규칙 검사
    if (name === 'newPassword') {
      if (!value) {
        setPwRuleMsg('');
        setIsCurrentPwValid(false);
        setCurrentPwMsg('');
      } else if (!PW_POLICY.test(value)) {
        setPwRuleMsg('❌ 비밀번호는 영문+숫자+특수문자를 포함한 8자 이상이어야 합니다.');
      } else {
        setPwRuleMsg('✅ 사용 가능한 비밀번호입니다.');
      }
    }

    // 새 비번=확인 일치 검사
    updateMatchMsg(next);
  };

  // 현재 비밀번호 검증 (백엔드 수정 없이 /member/login 사용)
  const verifyCurrentPassword = async () => {
    // 새 비번을 변경하지 않는다면 검증 스킵
    if (!(passwords.currentPassword ||
          passwords.newPassword || 
          passwords.confirmPassword)) {
      return true;
    }
    if (!passwords.currentPassword) {
      setIsCurrentPwValid(false);
      setCurrentPwMsg('❌ 현재 비밀번호를 입력하세요.');
      return false;          
    }

    try {
      await axios.post(
        'http://localhost:8080/cal/member/login',
        { id: info.id, password: passwords.currentPassword },
        { withCredentials: true }
      );
      setIsCurrentPwValid(true);
      setCurrentPwMsg('✅ 기존 비밀번호가 확인되었습니다.');
      return true;          
    } catch {
      setIsCurrentPwValid(false);
      setCurrentPwMsg('❌ 기존 비밀번호가 맞지 않습니다.');
      return false;
    }
  };

  const checkNickname = async () => {
    if (info.nickname === originalNickname) { setNicknameMsg(''); return true; }
    try {
      await axios.get(`http://localhost:8080/cal/member/check-nickname?nickname=${info.nickname}`);
      setNicknameMsg('✅ 사용 가능한 닉네임입니다.');
      return true;
    } catch {
      setNicknameMsg('❌ 이미 사용 중인 닉네임입니다.');
      return false;
    }
  };

  const checkEmail = async () => {
    if (info.email === originalEmail)  { setEmailMsg(''); return true; }
    try {
      await axios.get(`http://localhost:8080/cal/member/check-email?email=${info.email}`);
      setEmailMsg('✅ 사용 가능한 이메일입니다.');
      return true;
    } catch {
      setEmailMsg('❌ 이미 사용 중인 이메일입니다.');
      return false;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

     // 변경 여부 계산   쉽게 말함info입력 orugunal 기존
    const changedNickname  = info.nickname !== originalNickname;
    const changedEmail     = info.email    !== originalEmail;
    const changingPassword = !!(passwords.currentPassword || passwords.newPassword || passwords.confirmPassword);
    const noChanges        = !changedNickname && !changedEmail && !changingPassword;

    if (noChanges) {
      alert('변경된 내용이 없습니다.');
      return;
    }


    // 새 비번 입력이 있는 경우에만 아래 가드들 적용
    if (changingPassword) {
      if (!PW_POLICY.test(passwords.newPassword || '')) {
        alert('새 비밀번호 형식이 올바르지 않습니다. (영문/숫자/특수문자 포함, 8자 이상)');
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      const okPw = await verifyCurrentPassword();
      if (!okPw) {
        alert('현재 비밀번호가 올바르지 않습니다.');
        return;
      }
    }

    // 닉/이메일 중복 실패 시 차단
    if (changedNickname) {
      const okNick = await checkNickname();
      if (!okNick) return;
    }
    if (changedEmail) {
      const okEmail = await checkEmail();
      if (!okEmail) return;
    }


    try {
      const result = await axios.post(
        'http://localhost:8080/cal/member/update',
        {
          id: info.id,                               // 현재 백엔드가 id를 요구하는 구조
          password: passwords.newPassword || '',     // 비워두면 서버에서 기존 비번 유지
          nickname: info.nickname,
          email: info.email,
           role: info.role,
        },
        { withCredentials: true }
      );

      alert(result.data?.message || '수정 완료');
      navigate('/');
    } catch (err) {
      alert('❌ 수정 실패: ' + (err.response?.data || '서버 오류'));
    }
  };

  // 제출 비활성화 조건
  const submitDisabled =
    nicknameMsg.startsWith('❌') ||
    emailMsg.startsWith('❌') ||
    // 새 비번을 입력하는 경우: 규칙 충족 + 일치 + 현재 비번 OK 필요
    ((passwords.newPassword || passwords.confirmPassword)
      ? !PW_POLICY.test(passwords.newPassword || '') ||
        passwords.newPassword !== passwords.confirmPassword 
      : false);

  return (
  <div className={account.wrap}>
    <div className={account.card}>
      <h2 className={account.title}>회원 정보 수정</h2>

      {error && <p className={`${account.help} ${account.err}`}>{error}</p>}

      <div className={account.section}>
        <h3 className={account.sectionTitle}>내 정보</h3>
        <div className={account.infoGrid}>
          <p className={account.infoRow}><strong>아이디</strong><span>{info.id}</span></p>
          <p className={account.infoRow}><strong>이름</strong><span>{info.name}</span></p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className={account.form}>
        <div className={account.section}>
          <h3 className={account.sectionTitle}>비밀번호 변경</h3>

          <div className={account.formRow}>
            <label className={account.label}>현재 비밀번호</label>
            <input className={account.input} type="password" name="currentPassword"
                   value={passwords.currentPassword}
                   onChange={handlePasswordChange}
                   onBlur={verifyCurrentPassword}
                   placeholder="현재 비밀번호" />
            <p className={`${account.help} ${isCurrentPwValid ? account.ok : account.err}`}>{currentPwMsg}</p>
          </div>

          <div className={account.formRow}>
            <label className={account.label}>새 비밀번호</label>
            <input className={account.input} type="password" name="newPassword"
                   value={passwords.newPassword}
                   onChange={handlePasswordChange}
                   placeholder="새 비밀번호 (영문/숫자/특수문자 포함 8자+)" />
            <p className={`${account.help} ${pwRuleMsg.startsWith('✅') ? account.ok : account.err}`}>{pwRuleMsg}</p>
          </div>

          <div className={account.formRow}>
            <label className={account.label}>새 비밀번호 확인</label>
            <input className={account.input} type="password" name="confirmPassword"
                   value={passwords.confirmPassword}
                   onChange={handlePasswordChange}
                   placeholder="새 비밀번호 확인" />
            <p className={`${account.help} ${matchMsg.startsWith('✅') ? account.ok : account.err}`}>{matchMsg}</p>
          </div>
        </div>

        <div className={account.section}>
          <h3 className={account.sectionTitle}>닉네임 / 이메일 수정</h3>

          <div className={account.formRow}>
            <label className={account.label}>닉네임</label>
            <input className={account.input} name="nickname"
                   value={info.nickname}
                   onChange={handleInfoChange}
                   onBlur={checkNickname}
                   placeholder="닉네임" />
            <p className={`${account.help} ${nicknameMsg.startsWith('✅') ? account.ok : account.err}`}>{nicknameMsg}</p>
          </div>

          <div className={account.formRow}>
            <label className={account.label}>이메일</label>
            <input className={account.input} name="email"
                   value={info.email}
                   onChange={handleInfoChange}
                   onBlur={checkEmail}
                   placeholder="이메일" />
            <p className={`${account.help} ${emailMsg.startsWith('✅') ? account.ok : account.err}`}>{emailMsg}</p>
          </div>
        </div>

        <button type="submit" className={account.submit} disabled={submitDisabled}>
          회원정보 수정
        </button>
      </form>
    </div>
  </div>
);}
