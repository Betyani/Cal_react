import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import account from './Account.module.css';


export default function Register() {
  const [form, setForm] = useState({               
    id: '',
    pw: '',
    name: '',
    nickname: '',
    email: ''
   });
  const [validationMessage, setValidationMessage] = useState({                    //틀린 곳 메세지
    id: '',
    pw: '',
    nickname: '',
    email: ''
   });

  const [valid, setValid] = useState({                             //중복확인 버튼 /회원가입 조건 확인 등 제어용
    id: false,
    pw: false,
    nickname: false,
    email: false
   });

  const navigate = useNavigate();

  const [idChecked, setIdChecked] = useState(false);
  const [idMessage, setIdMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');

  const validate = (name, value) => {
    let isValid = false;
    let message = '';

    switch (name) {
      case 'id':
        isValid = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{4,12}$/.test(value);
        message = isValid ? '✅ 사용 가능한 아이디' : '❌ 영문+숫자 4~12자 입력';
        break;
      
      case 'pw':
        isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~]).{8,}$/.test(value);
        message = isValid ? '✅ 강력한 비밀번호' : '❌ 영문+숫자+특수문자 포함 8자 이상';
        break;
      
     case 'nickname': {
      if (/\s/.test(value)) {                      // 공백이 하나라도 있으면
       isValid = false;
       message = '❌ 공백은 사용할 수 없습니다.';
  }   else if (/^[가-힣a-zA-Z0-9]{2,12}$/.test(value)) {
       isValid = true;
       message = '✅ 닉네임 형식 가능!';
  }   else {
       isValid = false;
       message = '❌ 특수문자 없이 2~12자 입력';
  }
  break;
}
      
        case 'email':
        isValid =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        message = isValid ? '✅ 사용가능한 이메일' : '❌ 이메일 형식이 올바르지 않습니다';
        break;
        default:
        break;
    }

    setValidationMessage(prev => ({ ...prev, [name]: message }));
    setValid(prev => ({ ...prev, [name]: isValid }));
  };

  
    const handleChange = (e) => {                        //적으면 메세지가 뜨는데 지우면 초기화 기능
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);

     if (value === '') {
      setValidationMessage(prev => ({ ...prev, [name]: '' }));
    }

  

    if (name === 'id') {
      setIdChecked(false);
      setIdMessage('');
    } else if (name === 'nickname') {
      setNicknameChecked(false);
      setNicknameMessage('');
    } else if (name === 'email') {
      setEmailChecked(false);
      setEmailMessage('');
    }
  };


  const handleRegister = async (e) => {                                 //회원가임 버튼 실행
    e.preventDefault();

    const ready =
        valid.id && valid.pw && valid.nickname && valid.email &&
        idChecked && nicknameChecked && emailChecked &&
        form.name.trim();

    if (!ready) {
      alert('입력 형식 및 중복 확인을 완료해주세요.');
      return;
    }


    try {
      await axios.put('http://localhost:8080/cal/member/register', {
        id: form.id,    // 🔔 서버는 username으로 받음
        password: form.pw,    // 🔔 서버는 password로 받음
        name: form.name,
        nickname: form.nickname, 
        email: form.email
      });

      alert('회원가입 성공');
      navigate('/login');
    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      alert('회원가입 실패');
    }
  };

console.log("valid:", valid); 
console.log("중복확인 상태:", idChecked, nicknameChecked, emailChecked); 
console.log("form.name.trim():", `"${form.name.trim()}"`);

  return (
     <div className={account.wrap}>
      <div className={account.card}>
      <h2 className={account.title}>회원가입</h2>

      <form onSubmit={handleRegister}className={account.form}>
        <div className={account.formRow}>
          <label className={account.label}>아이디</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={(e) =>   {
            handleChange(e);
            setIdChecked(false); //닉네임 변경시 다시 체크 확인
            setIdMessage('');
          }}
            required
            className={account.input}
            placeholder="아이디"
          />
          <button type="button" className={account.ghostButton} 
           onClick={async () => {
            if (!form.id.trim()) {
              setIdMessage("⚠️ 아이디를 먼저 입력하세요.");
              setIdChecked(false);
              return;
            }

         try{
            const res = await axios.get(`http://localhost:8080/cal/member/check-id?id=${form.id}`);
            setIdMessage(res.data);
            setIdChecked(true);
            }
             catch (err) {
            setIdMessage(err.response?.data || "중복 확인 중 오류 발생");
            setIdChecked(false);
            }
            }}> 아이디 중복 확인</button>
            </div>
            {idMessage && (
              <p className={`${account.help} ${idMessage.includes('사용 가능') ? account.ok : account.err}`}>
               {idMessage}
               </p>
)}
        
        
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
          <button type="button" className={account.inlineButton} 
          onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '숨김' : '보기'}
          </button>
         </div>
         <p style={{ color: valid.pw ? 'green' : 'red' }}>{validationMessage.pw}</p>
        </div>

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

        <div className={account.formRow}>
          <label className={account.label}>닉네임</label>
          <input
           type="text"
           name="nickname"
           value={form.nickname}
           onChange={(e) =>    {
            handleChange(e);
            setNicknameChecked(false); //닉네임 변경시 다시 체크 확인
            setNicknameMessage('');
          }}
           required
           className={account.input}
           placeholder="닉네임"
          />
         <button type="button"  className={account.ghostButton} 
          onClick={async () => {
            if (!form.nickname.trim()) {
           setNicknameMessage("⚠️ 닉네임을 먼저 입력하세요.");
           setNicknameChecked(false);
             return;
            }
           try {
             const res = await axios.get(`http://localhost:8080/cal/member/check-nickname?nickname=${form.nickname}`);
             setNicknameMessage(res.data);       // 예: "사용 가능한 닉네임입니다."
             setNicknameChecked(true);
            } 
            catch (err) {
             setNicknameMessage(err.response?.data || "중복 확인 중 오류 발생");
             setNicknameChecked(false);
            }
            }}> 중복 확인 </button>
           
            <p className={`${account.help} ${nicknameChecked ? account.ok : account.err}`}>
             {nicknameMessage}
            </p>
</div> 
       
        <div className={account.formRow}>
        <label className={account.label}>이메일</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => {
            handleChange(e);
            setEmailChecked(false);
            setEmailMessage('');
          }}
          required
          className={account.input}
          placeholder="email@example.com"
        />

      <button type="button" className={account.ghostButton} 
      onClick={async () => {
            if (!valid.email) {
              setEmailMessage("❌ 이메일 형식이 올바르지 않습니다.");
              setEmailChecked(false);
              return;
            }

      try {
        const res = await axios.get(`http://localhost:8080/cal/member/check-email?email=${form.email}`);
        setEmailMessage(res.data);
        setEmailChecked(true);
      } catch (err) {
        setEmailMessage(err.response?.data || "중복 확인 중 오류 발생");
        setEmailChecked(false);
      }
    }}>
    이메일 중복 확인
  </button>

  <p className={`${account.help} ${emailChecked ? account.ok : account.err}`}>{emailMessage}</p>

</div>

        <button type="submit" disabled={
           !valid.id ||
           !valid.pw ||
           !valid.email ||
           !valid.nickname ||
           !nicknameChecked||
           !idChecked ||
           !emailChecked||
           !form.name.trim()                  // 👈 이름이 빈 문자열이면 비활성화
           //                                   중복 체크도 완료되어야 가능
           }>
           회원가입 </button>    
        
      </form>
    </div>
      </div>
  );
}