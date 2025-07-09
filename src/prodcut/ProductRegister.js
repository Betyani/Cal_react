import React, { useState } from "react";
import axios from "axios";


export default function ProductRegister() {

    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("보낼 값:", product);
            const response = await axios.post('http://localhost:8080/cal/product/register', product);
            setProduct({ name: "", price: "", category: "" });
            console.log("등록 성공");
        } catch (error) {
            console.error('오류남: ', error);
            alert("등록 실패");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    }


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
                    <button type="submit">
                        등록
                    </button>
                </div>
            </form>
        </>
    )
}