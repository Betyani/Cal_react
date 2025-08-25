import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductList.module.css';

export default function ProductList( {onSelect} ) {
  const [products, setProducts] = useState([]);                // 상품 목록 (배열 형태)
  const [total, setTotal] = useState(0);                       // 전체 상품 개수
  const [keyword, setKeyword] = useState('');                  // 검색바
  const [category, setCategory] = useState('');                // 카테고리
  const [sort, setSort] = useState('new');

  const navigate = useNavigate();
  const categories = ["전체", "도시락/조리면", "삼각김밥/김밥", "샌드위치/햄버거", "음료수/아이스크림", "과자/디저트", "기타"];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;         // 한 페이지당 상품 수
  const blockSize = 5;        // 한 블럭당 페이지 수

  useEffect(() => {

    axios.get('http://localhost:8080/cal/product/list', {
      params: {
        keyword: keyword,     // 검색어
        category: category === "전체" ? "" : category, // "전체"는 빈 값으로 전달
        page: currentPage,
        size: pageSize,
        sort: sort,

      }
    })
      .then((res) => {
        setProducts(res.data.products);             // res.data JSON 객체이며, products는 상품 목록 배열
        setTotal(res.data.total);                   // 전체 상품 수 저장 
      })

      .catch((err) => {
        console.error("상품 조회 실패:", err);
      });
  }, [keyword, category, sort, currentPage]);     // 검색어가 바뀔 때마다 자동 요청하게 괄호안에 있는것들을 넣음

  const totalPages = Math.ceil(total / pageSize);
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);


  return (
    <div className={styles.container}>
      {/* 카테고리 탭 */}
      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tabButton} ${category === cat ? styles.active : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색창 */}

      <div className={styles.search}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="상품명을 입력"
        />
      </div>
      {/* 정렬순 버튼 */}
      <div className={`${styles.container} ${styles.tabs}`}>
        <button
          className={`${styles.tabButton} ${sort === 'new' ? styles.active : ''}`}
          onClick={() => setSort('new')}>
          최신순</button>
        <button
          className={`${styles.tabButton} ${sort === 'old' ? styles.active : ''}`}
          onClick={() => setSort('old')}>
          오래된순</button>
        <button
          className={`${styles.tabButton} ${sort === 'recommend' ? styles.active : ''}`}
          onClick={() => setSort('recommend')}>
          추천순</button>
      </div>


      {/* 상품 등록 버튼    
조회쪽에서 만든 상품 등록 미완성 혹시 몰라 놔두는거예요  */
/*<button onClick={() => navigate('/products/new')}>상품 등록</button>*/}

      <div className={styles.product}>
      <h2>상품 목록 ({total}개)</h2>
      <button className={styles.btn} onClick={() => navigate(`/product/register`)}> + 상품등록</button>
      </div>

      <div className={styles.listWrap}>
        {products.length > 0 ? (
          products.map((p) => (             //map해서 상품 배열 하나씩 렌더링(p)
            <article
              key={p.id} className={styles.card} onClick={() => onSelect?.({id: p.id, name: p.name})}>
              {p.imageUrl ? (
                <img
                  className={styles.thumb}
                  src={`http://localhost:8080/cal/image/load/${p.imageUrl}`}
                  alt={p.name}
                />) : (<div className={`${styles.thumb} ${styles['thumb--placeholder']}`} />)}
              <h3 className={styles.name}>{p.name}</h3>
              <div className={styles.meta}>
                <span className={styles.price}>
                  {Number(p.price).toLocaleString()}원
                </span>
                <span className={styles.category}>{p.category}</span>
              </div>
              <div className={styles.buttonWrap}>
                <button className={`${styles.btn} ${styles.primary}`} onClick={(e) => {e.stopPropagation(); navigate(`/board/register/${p.id}`);}}>리뷰 쓰기</button>
                {/* 수정 버튼 */}
                <button className={`${styles.btn} ${styles.outline}`} onClick={(e) => {e.stopPropagation(); navigate(`/product/edit/${p.id}`);}}>수정</button>
                {/* 삭제버튼*/}
                <button className={`${styles.btn} ${styles.danger}`} onClick={(e) => {e.stopPropagation(); navigate(`/product/delete/${p.id}`);}}>삭제</button>

              </div>
            </article>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>

      {/* ✅ 페이징 블럭 */}
      <div className={styles.pagination}>
        {startPage > 1 && (
          <button className={`${styles.page} ${styles.prev}`} onClick={() => setCurrentPage(startPage - 1)}>
            ◀ 이전
          </button>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`${styles.page} ${styles.prev}`}
          >
            {num}
          </button>
        ))}
        {endPage < totalPages && (
          <button className={`${styles.page} ${styles.prev}`} onClick={() => setCurrentPage(endPage + 1)}>
            다음 ▶
          </button>
        )}
      </div>
    </div>
  );
}