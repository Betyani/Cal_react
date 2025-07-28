import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductList.module.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);                // 상품 목록 (배열 형태)
  const [total, setTotal] = useState(0);                       // 전체 상품 개수
  const [keyword, setKeyword] = useState('');                  // 검색바
  const [category, setCategory] = useState('');                // 카테고리
  const [sort, setSort] = useState('new');
 
  const navigate = useNavigate();
  const categories =  ["전체", "도시락/조리면", "삼각김밥/김밥", "샌드위치/햄버거", "음료수/아이스크림", "과자/디저트", "기타"];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;         // 한 페이지당 상품 수
  const blockSize = 5;        // 한 블럭당 페이지 수

  useEffect(() => {

    axios.get('http://localhost:8080/cal/product/list', {
      params: {
        keyword: keyword,     // 검색어
        category: category === "전체" ? "" : category, // "전체"는 빈 값으로 전달
         page: currentPage - 1,         // Spring은 0부터 시작임 헥갈리니깐 적어둠
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
  }, [keyword, category, sort,  currentPage]);     // 검색어가 바뀔 때마다 자동 요청하게 괄호안에 있는것들을 넣음


  

  const handleDelete = (id) => {
  if (!window.confirm("정말 삭제하시겠습니까?")) return;

  axios.delete(`http://localhost:8080/cal/product/delete/${id}`)
    .then(() => {
      alert("✅ 삭제 완료");
      setProducts(products.filter(p => p.id !== id)); // 목록에서 바로 제거
    })
    .catch(err => {
      alert("❌ 삭제 실패");
      console.error(err);
    });
};  
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
         <div className={styles.sortContainer}>
      <button
        className={`${styles.sortButton} ${sort === 'new' ? styles.active : ''}`}
        onClick={() => setSort('new')}>
        최근껄로 드가자</button>
      <button
        className={`${styles.sortButton} ${sort === 'old' ? styles.active : ''}`}
        onClick={() => setSort('old')}>
        오래된순</button>
      <button
        className={`${styles.sortButton} ${sort === 'recommend' ? styles.active : ''}`}
        onClick={() => setSort('recommend')}>
        추천순</button>
      </div>


      {/* 상품 등록 버튼    
조회쪽에서 만든 상품 등록 미완성 혹시 몰라 놔두는거예요  */
/*<button onClick={() => navigate('/products/new')}>상품 등록</button>*/}

   
      <h2>상품 목록 ({total}개)</h2>
      <div className={styles.listWrap}>
  {products.length > 0 ? (
    products.map((p) => (             //map해서 상품 배열 하나씩 렌더링(p)
            <div
             key={p.id} className={styles.productItem}>
                <strong>{p.name}</strong> - {p.price}원
                <br />
                <span>{p.category}</span>
                <br />
                <img src={p.imageUrl} alt={p.name} width="100" height="100" />
                <div className={styles.buttonWrap}>
                {/* 수정 버튼  은비님 구현한 페이지로 이동 */}
                <button onClick={() => navigate(`/product/edit/${p.id}`)}>수정</button>   
                {/* 삭제버튼 지원님 API 호출 */}
                <button onClick={() => handleDelete(p.id)}>삭제</button>
              </div>
            </div>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>

      {/* ✅ 페이징 블럭 */}
      <div className={styles.pagination}>
        {startPage > 1 && (
          <button onClick={() => setCurrentPage(startPage - 1)} className={styles.pageButton}>
            ◀ 이전
          </button>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={currentPage === num ? styles.activePageButton : styles.pageButton}
          >
            {num}
          </button>
        ))}
        {endPage < totalPages && (
          <button onClick={() => setCurrentPage(endPage + 1)} className={styles.pageButton}>
            다음 ▶
          </button>
        )}
      </div>
    </div>
  );
}