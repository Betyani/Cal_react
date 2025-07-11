import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();  // URL에서 id 추출
  const [product, setProduct] = useState(null);

  useEffect(() => {
    console.log("==="+id ); // 확인용임 신경 안써도 됨
    
    axios.get(`http://localhost:8080/cal/product/detail/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("상품 상세 조회 실패:", err));
  }, [id]);

  if (!product) return <div>로딩 중...</div>;



  
  return (
    <div>
      <h2>{product.name}</h2>
      <p>가격: {product.price}원</p>
      <p>카테고리: {product.category}</p>
      <img src={product.imageUrl} alt={product.name} width="200" />
      <p>키워드: {product.keyword}</p>
    </div>
  );
}