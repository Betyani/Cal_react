import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductList.module.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);                // 상품 목록 (배열 형태)
  const [total, setTotal] = useState(0);                       // 전체 상품 개수
  const [keyword, setKeyword] = useState('');                  // 검색바
  const [category, setCategory] = useState('');                // 카테고리
  const categories = ["전체", "도시락", "음료수", "과자", "아이스크림"];
  const [sort, setSort] = useState('new');
  const navigate = useNavigate();

  useEffect(() => {

    axios.get('http://localhost:8080/cal/product/list', {
      params: {
        keyword: keyword,     // 검색어
        category: category === "전체" ? "" : category, // "전체"는 빈 값으로 전달
        page: 1,         // 페이지 번호 (1부터 시작)
        size: 8,          // 한 페이지에 불러올 상품 수
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
  }, [keyword, category, sort, navigate]);     // 검색어가 바뀔 때마다 자동 요청하게 괄호안에 있는것들을 넣음


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
        <button onClick={() => setSort('new')}>최신순</button>
        <button
          className={`${styles.sortButton} ${sort === 'new' ? styles.active : ''}`}
          onClick={() => setSort('new')}
        >최근껄로 드가자</button>

        <button onClick={() => setSort('old')}>오래된순</button>
        <button
          className={`${styles.sortButton} ${sort === 'old' ? styles.active : ''}`}
          onClick={() => setSort('old')}
        ></button>

        <button onClick={() => setSort('recommend')}>추천순</button>
        <button
          className={`${styles.sortButton} ${sort === 'recommend' ? styles.active : ''}`}
          onClick={() => setSort('recommend')}
        ></button>
      </div>


      {/* 상품 등록 버튼    
조회쪽에서 만든 상품 등록 미완성 혹시 몰라 놔두는거예요  */
/*<button onClick={() => navigate('/products/new')}>상품 등록</button>*/}

      {/*    <input                                         //일단 검색창 열기임
        type="text"
        placeholder="상품 이름으로 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">전체 카테고리</option>
        <option value="집">집</option>
      
        <option value="가자">가자</option>
        <option value="자러">자러</option>
     
      </select>*/}

      <h2>상품 목록 ({total}개)</h2>
      <ul>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => (
            <li
              key={p.id}
              onClick={() => navigate(`/${p.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <strong>{p.name}</strong> - {p.price}원
              <br />
              <span>{p.category}</span>
              <br />
              <img src={p.imageUrl} alt={p.name} width="100" height="100" />
            </li>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </ul>


    </div>



  );
}