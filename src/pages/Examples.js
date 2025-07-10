import React from 'react';
import MyStepper from '../components/MyStepper';

export default function Examples() {
  return (
    <div className="page-container">
      <h2>회원가입 흐름 예시</h2>
      <MyStepper steps={['정보 입력', '약관 동의', '완료']} />
    </div>
  );
}
