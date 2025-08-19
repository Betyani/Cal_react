import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // 추가: useNavigate 임포트

function ProductEdit() {
  const { productId } = useParams();
  const navigate = useNavigate(); // 추가: 페이지 이동 함수 생성

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  console.log("👉 받은 productId:", productId);


  // 상품 정보 불러오기 (GET)
  useEffect(() => {
    axios
      .get(`http://localhost:8080/cal/product/check/${productId}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setPrice(data.price);
        setCategory(data.category);
        setImageUrl(data.imageUrl || "");
      })
      .catch((err) => {
        setMessage("❌ 상품 정보를 불러오지 못했습니다.");
        console.error(err);
      });
  }, [productId]);

  // 상품 수정 요청 (PUT)
  const handleUpdate = () => {
    const updatedProduct = {
      name,
      price: Number(price),
      category,
      imageUrl
    };

    axios
      .put(`http://localhost:8080/cal/product/update/${productId}`, updatedProduct)
      .then((res) => {
        alert("✅ 상품이 성공적으로 수정되었습니다.");    // 변경 : alret 사용해서 성공 알림 띄의고 -> alert 닫으면 목록 페이지로 이동
        navigate("/products/list");                     // 추가 
        

      })
      .catch((err) => {
        setMessage("❌ 상품 수정 실패");
        console.error(err);
      });
  };

  return (
    <div>
      <h2>상품 수정</h2>
      {message && <p>{message}</p>}

      <label>
        이름:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />

      <label>
        가격:
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <br />

      <label>
        카테고리:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">-- 카테고리 선택 --</option>
          <option value="도시락/조리면">도시락/조리면</option>
          <option value="삼각김밥/김밥">삼각김밥/김밥</option>
          <option value="샌드위치/햄버거">샌드위치/햄버거</option>
          <option value="음료수/아이스크림">음료수/아이스크림</option>
          <option value="과자/디저트">과자/디저트</option>
          <option value="기타">기타</option>
        </select>

      </label>
      <br />

      <label>
        이미지 URL:
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </label>
      <br />

      <button onClick={handleUpdate}>수정하기</button>
    </div>
  );
}

export default ProductEdit;
