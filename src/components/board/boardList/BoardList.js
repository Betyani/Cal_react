import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './BoardList.module.css';
import useAuth from "../../hooks/useAuth";

export default function BoardList({ productId }) {
    const [review, setReview] = useState([]);
    const [page, setPage] = useState(1);
    const [pageInfo, setPageInfo] = useState({});
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(null);

    const { isMaster, user } = useAuth();
    const isAdmin = isMaster;
    const isUser = user;

    useEffect(() => {

        if (!productId) return;

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
    };

    const openModal = (item) => {
        setActive(item);
        setOpen(true);
    };


    const closeModal = () => {
        setOpen(false);
        setActive(null);
    };

    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;  // 기존값 백업
            document.body.style.overflow = 'hidden';    // 배경 스크롤 잠금
            return () => { document.body.style.overflow = prev; }; // 복원
        }
    }, [open]);


    return (
        <section className={styles.tableWrap}>

            <div className={styles.tableScroll}>
                <table className={styles.boardTable}>
                    <colgroup>
                        <col className={styles.colNum} />
                        <col className={styles.colTitle} />
                        <col className={styles.colWriter} />
                        <col className={styles.colTime} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>番号</th>
                            <th>タイトル</th>
                            <th>作成者</th>
                            <th>作成時間</th>
                        </tr>
                    </thead>

                    <tbody>
                        {review.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={styles.empty}>レビューがまだありません。最初のレビューを投稿してください。</td>
                            </tr>
                        ) : (
                            review.map((item, index) => (
                                <tr key={item.id ?? index} onClick={() => openModal(item)} className={styles.row}>
                                    <td className={styles.center}>{(pageInfo.totalCount ?? 0) - ((page - 1) * (pageInfo.pageSize ?? 5)) - index}</td>
                                    <td className={styles.titleCell}>
                                        <span className={styles.titleText}>{item.title}</span>
                                    </td>
                                    <td className={styles.center}>{item.writer}</td>
                                    <td className={styles.center}>{item.createTime}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                {pageInfo.hasPrev && (
                    <button className={`${styles.page} ${styles.prev}`} onClick={() => goToPage(pageInfo.startPage - 1)}>
                        ◀ 前へ
                    </button>
                )}

                {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, index) => {
                    const pageNum = pageInfo.startPage + index;
                    return (
                        <button key={pageNum} onClick={() => goToPage(pageNum)} className={`${styles.page} ${page === pageNum ? styles.active : ''}`}>
                            {pageNum}
                        </button>);
                })}

                {pageInfo.hasNext && (
                    <button className={`${styles.page} ${styles.prev}`} onClick={() => goToPage(pageInfo.endPage + 1)}>
                        次へ ▶
                    </button>
                )}

            </div>

            {open && active && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>{active.title}</h3>
                            <button className={styles.close} onClick={closeModal} aria-label="닫기">×</button>
                        </div>
                        <div className={styles.meta}>
                            <span>作成者: <strong>{active.writer}</strong></span>
                            <span>作成時間: {active.createTime}</span>
                        </div>
                        <div className={styles.modalBody}>
                            <pre className={styles.content}>{active.content}</pre>
                        </div>
                        <div className={styles.modalFooter}>
                            {(isAdmin || (isUser?.nickname === active.writer)) && (
                                <>
                                    <button className={`${styles.btn} ${styles.outline}`} onClick={() => navigate(`/board/edit/${active.id}`)}>
                                        編集
                                    </button>
                                    <button className={`${styles.btn} ${styles.danger}`} onClick={() => navigate(`/board/delete/${active.id}`)}>
                                        削除
                                    </button>
                                </>
                            )}
                            <button className={styles.btn} onClick={closeModal}>閉める</button>
                        </div>
                    </div>
                </div>
            )}



        </section>
    );





}