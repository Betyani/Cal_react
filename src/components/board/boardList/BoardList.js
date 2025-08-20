import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BoardList({ productId }) {
    const [review, setReview] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
        const search = async () => {
            try {
                console.log("상품id: ", productId);
                const response = await axios.get("http://localhost:8080/cal/board/list",
                    {
                        params:
                        {
                            productId: productId,
                            page: page
                        }
                    });
                setReview(response.data.reviews);
                setPageInfo(response.data.pageInfo);
                console.log("불러온 리뷰: ", response.data);
            } catch (error) {
                console.log(error);
            }
        };

        search();

    }, [productId, page]);


    useEffect(() => {
        setPage(1); // 상품이 바뀌면 페이지를 1로 초기화
    }, [productId]);


    const goToPage = (pageNum) => {
        setPage(pageNum);
    }

    return (
        <>
            <h2>리뷰 목록</h2>
            {review.map((review, index) => (
                <div key={index}>
                    <p>제목: {review.title}</p>
                    <p>내용: {review.content}</p>
                    <p>작성자: {review.writer}</p>
                    <p>작성시간: {review.createTime} </p>
                    <hr />
                </div>
            ))}

            <div>
                {pageInfo.hasPrev && (
                    <button onClick={() => goToPage(pageInfo.startPage - 1)}>
                        ◀ 이전
                    </button>
                )}

                {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                    const pageNum = pageInfo.startPage + index;
                    return (
                        <button key={ pageNum } onClick={() => goToPage(pageNum)} >
                            [{ pageNum }]
                        </button>);
                })}

                {pageInfo.hasNext && (
                    <button onClick={() => goToPage(pageInfo.endPage + 1)}>
                        다음▶
                    </button>
                )}

            </div>
        </>
    );





}