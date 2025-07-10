import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    imageUrl: '',
    keyword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/cal/products', form)
      .then(() => {
        alert('상품 등록 완료!');
        navigate('/'); // 등록 후 목록으로 이동
      })
      .catch((err) => {
        alert('등록 실패');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>상품 등록</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="이름" onChange={handleChange} /><br />
        <input name="price" placeholder="가격" type="number" onChange={handleChange} /><br />
        <input name="category" placeholder="카테고리" onChange={handleChange} /><br />
        <input name="imageUrl" placeholder="이미지 주소" onChange={handleChange} /><br />
        <input name="keyword" placeholder="키워드" onChange={handleChange} /><br />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}