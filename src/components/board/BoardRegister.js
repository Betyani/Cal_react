import React, { useState } from 'react';
import axios from 'axios';

export default function BoardRegister({ productId }) {

    const [review, setReview] = useState({
        title: "",
        content: "",
        writer: "",
        productId: 0
    });

//등록버튼을 눌렀을 경우 실행
    const handleSubmit = async (e) => {
        e.preventDefault(); //제출 시 페이지 새로고침 방지
        const finalReview = { ...review, productId: productId };
        
        try {
            console.log("보낼 값:", review);
            const response = await axios.post('http://localhost:8080/cal/board/register', finalReview);
            setReview({ title: "", content: "", writer: "", productId: 0 }); //입력창 초기화
            console.log("등록 성공");
        } catch (error) {
            console.error('오류남: ', error);
            alert("등록 실패");
        }
    };

    //입력값 실시간 반영
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });  //입력값만 덮어쓰기
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>리뷰 등록</h2>
                <div>
                    <label>제목: </label>
                    <input type="text" name="title" value={review.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>내용: </label>
                    <textarea name="content" value={review.content} onChange={handleChange} required rows={5} cols={50} />
                </div>
                <div>
                    <label>작성자: </label>
                    <input type="text" name="writer" value={review.writer} onChange={handleChange} required />
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