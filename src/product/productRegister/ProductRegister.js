import React, { useState } from "react";
import axios from "axios";


export default function ProductRegister() {

    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
    });

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    //등록버튼을 눌렀을 경우 실행
    const handleSubmit = async (e) => {
        e.preventDefault(); //제출 시 페이지 새로고침 방지

        let fileName = null;

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const fileUploadRespone = await axios.post("http://localhost:8080/cal/image/upload", formData);
                fileName = fileUploadRespone.data.fileName;
            } catch (error) {
                console.error("업로드 실패", error);
                return;
            }

        }


        try {
            const productWithImage = { ...product, imageUrl: fileName };
            console.log("보낼 값:", productWithImage);
            const response = await axios.post('http://localhost:8080/cal/product/register', productWithImage);
            setProduct({ name: "", price: "", category: "" }); //입력창 초기화
            setFile(null);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl); // 이전 이미지 메모리 해제
            }
            setPreviewUrl("");
            console.log("등록 성공");
        } catch (error) {
            console.error('오류남: ', error);
            alert("등록 실패");
        }
    };

    //입력값 실시간 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });  //입력값만 덮어쓰기
    }

    const handleFileChange = (e) => {
        const uploadFile = e.target.files[0];
        if (!uploadFile) {
            setFile(null);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
            }

            return;
        }
        setFile(uploadFile);

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        const newUrl = URL.createObjectURL(uploadFile);

        setPreviewUrl(newUrl);

    };


    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>상품 등록</h2>
                <div>
                    <label>상품명: </label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>가격: </label>
                    <input type="text" name="price" value={product.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>카테고리: </label>
                    <input type="text" name="category" value={product.category} onChange={handleChange} required />
                </div>
                <div>
                    <input type="file" onChange={handleFileChange} />
                    {previewUrl && <img src={previewUrl} width="200" />}
                </div>
                <div>
                    <button type="submit">
                        등록
                    </button>
                </div>
            </form>
        </>
    )
}