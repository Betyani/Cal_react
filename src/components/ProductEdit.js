import React, { useState, useEffect } from "react";
import axios from "axios";

function ProductEdit({ productId }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  // 상품 정보 불러오기 (GET)
  useEffect(() => {
    axios
      .get(`http://localhost:8080/cal/product/test/${productId}`)
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
        setMessage("✅ " + res.data); // 서버에서 보낸 메시지 출력

        // 수정 후 폼 초기화
        setName("");
        setPrice("");
        setCategory("");
        setImageUrl("");
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
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
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
