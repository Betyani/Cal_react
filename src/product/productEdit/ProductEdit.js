import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ProductEdit() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // 👉 하나의 객체로 관리
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: ""
  });

  // 👉 새 파일 & 미리보기용 state 추가
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/cal/product/check/${productId}`)
      .then((res) => {
        setProduct(res.data);  // 👉 객체 전체 저장
      })
      .catch((err) => {
        setMessage("❌ 상품 정보를 불러오지 못했습니다.");
        console.error(err);
      });
  }, [productId]);

  // 입력값 변경 공통 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 파일 선택 & 검증 & 미리보기 처리
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (!newFile) {
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      return;
    }

    // 1) 파일 타입 검증 (이미지 파일 JPG, PNG, GIF만 허용)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(newFile.type)) {
      alert("❌ JPG, PNG, GIF 형식만 업로드 가능합니다.");
      e.target.value = ""; // input 초기화
      return;
    }
    // 2) 파일 용량 제한 (2MB 이하 예시)
    if (newFile.size > 2 * 1024 * 1024) {
      alert("❌ 파일 크기는 2MB 이하만 가능합니다.");
      e.target.value = ""; // input 초기화
      return;
    }

    setFile(newFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newUrl = URL.createObjectURL(newFile);
    setPreviewUrl(newUrl);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let fileName = product.imageUrl;  // 👉 새 파일 없으면 기존 이미지 유지
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const fileUploadResponse = await axios.post(
          "http://localhost:8080/cal/image/upload",
          formData
        );
        fileName = fileUploadResponse.data.fileName;  // 👉 새 파일명
      } catch (error) {
        console.error("업로드 실패", error);
        alert("이미지 업로드 실패");
        return;
      }
    }

    try {
      const updatedProduct = { ...product, imageUrl: fileName };
      await axios.put(
        `http://localhost:8080/cal/product/update/${productId}`,
        updatedProduct
      );
      alert("✅ 상품이 성공적으로 수정되었습니다.");
      navigate("/products/list");
    } catch (error) {
      console.error("수정 실패", error);
      setMessage("❌ 상품 수정 실패");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>상품 수정</h2>
      {message && <p>{message}</p>}

      <div>
        <label>이름:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>가격:</label>
        <input
          type="text"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>카테고리:</label>
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">-- 카테고리 선택 --</option>
          <option value="도시락/조리면">도시락/조리면</option>
          <option value="삼각김밥/김밥">삼각김밥/김밥</option>
          <option value="샌드위치/햄버거">샌드위치/햄버거</option>
          <option value="음료수/아이스크림">음료수/아이스크림</option>
          <option value="과자/디저트">과자/디저트</option>
          <option value="기타">기타</option>
        </select>
      </div>

      {/* 👉 URL 입력 대신 파일 선택 */}
      {/* 👉 파일 선택 제한 (accept) 추가 */}
      <div>
        <label>새 이미지 선택:</label>
        <input type="file" accept=".jpg, .jpeg, .png, .gif" onChange={handleFileChange} />
      </div>

      {/* 👉 미리보기 or 기존 이미지 표시 */}
      <div>
        {previewUrl ? (
          <img src={previewUrl} alt="미리보기" width="200" />
        ) : (
          product.imageUrl && (
            <img
              src={`http://localhost:8080/cal/image/load/${product.imageUrl}`}
              alt={product.name}
              width="200"
            />
          )
        )}
      </div>

      <button type="submit">수정하기</button>
    </form>
  );
}

export default ProductEdit;
