import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ProductList.module.css';
import useAuth from '../../components/hooks/useAuth';


export default function ProductList({ onSelect }) {
  const [products, setProducts] = useState([]);                // 상품 목록 (배열 형태)
  const [total, setTotal] = useState(0);                       // 전체 상품 개수
  const [keyword, setKeyword] = useState('');                  // 검색바
  const [category, setCategory] = useState('');                // 카테고리
  const [sort, setSort] = useState('new');
  const [likeLoading, setLikeLoading] = useState({});

  const navigate = useNavigate();
  const categories = ["全体", "カップラーメン", "お弁当", "おにぎり", "サンドイッチ", "飲み物", "アイスクリーム", "お菓子"];
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;         // 한 페이지당 상품 수
  const blockSize = 5;        // 한 블럭당 페이지 수
  const location = useLocation();         //, 로그인 후 원래 위치로 navigate('/login', { state: { from: location } }) 와 같음
  const { isLoggedIn, isMaster, user, loading } = useAuth(); // 훅 구조에 맞게
  const ownerOf = (p) => p.ownerId ?? p.memberId ?? p.writerId ?? p.userId ?? null; //  소유자 필드 유연 처리

  const handleSelectCategory = (cat) => {
    if (cat !== category) setCurrentPage(1);   // 다른 카테고리로 이동 시 1페이지로
    setCategory(cat);
  };


  useEffect(() => {

    axios.get('http://localhost:8080/cal/product/list', {
      params: {
        keyword: keyword,     // 검색어
        category: category === "全体" ? "" : category, // "전체"는 빈 값으로 전달
        page: currentPage,
        size: pageSize,
        sort: sort,
        userId: user?.id || null   // 로그인한 사용자 ID 전달

      },
      withCredentials: true        // 세션/쿠키 기반 로그인 유지
    })
      .then((res) => {
        // 서버에서 내려준 liked, likeCount 값을 그대로 반영
        setProducts(res.data.products);             // res.data JSON 객체이며, products는 상품 목록 배열
        setTotal(res.data.total);                   // 전체 상품 수 저장 
      })

      .catch((err) => {
        console.error("상품 조회 실패:", err);
      });
  }, [keyword, category, sort, currentPage, user?.id]);     // 검색어가 바뀔 때마다 자동 요청하게 괄호안에 있는것들을 넣음  //user.id 변경 시에도 다시 호출

  const totalPages = Math.ceil(total / pageSize);
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);



  const handleClickReview = (productId) => (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('ログインしてください');
      navigate('/login', { replace: true, state: { from: location } }); // 로그인 후 원래 위치로 복귀 가능
      return;
    }
    navigate(`/board/register/${productId}`);
  };

  // 추천(좋아요) 버튼 클릭 처리
  const handleClickLike = async (p) => {
    if (!isLoggedIn) {
      alert("ログインしてください。");
      navigate("/login", { replace: true, state: { from: location } });
      return;
    }
    const uid = user?.id;
    if (!uid || likeLoading[p.id]) return;

    setLikeLoading(prev => ({ ...prev, [p.id]: true }));
    try {
      if (!p.liked) {
        // 좋아요 처리
        setProducts(prev => prev.map(prod =>
          prod.id === p.id ? { ...prod, liked: true, likeCount: (prod.likeCount || 0) + 1 } : prod
        ));
        await axios.post(`http://localhost:8080/cal/product/${p.id}/like`, null, { params: { userId: uid } });
      } else {
        // 좋아요 취소 처리
        setProducts(prev => prev.map(prod =>
          prod.id === p.id ? { ...prod, liked: false, likeCount: Math.max((prod.likeCount || 0) - 1, 0) } : prod
        ));

        //axios.delete URL에 userId 직접 넣기
        await axios.delete(`http://localhost:8080/cal/product/${p.id}/like?userId=${uid}`);
      }
    } catch (err) {
      // 🔹 수정된 부분: alert 조건 추가
      if (err.response && err.response.status < 500) {
        // 이미 추천 취소 상태 등, 사용자 오류 → UI에는 반영되고 alert 생략
        console.warn("추천 요청 오류(무시 가능):", err.response.data);
      } else {
        console.error("추천 실패:", err);
        alert("추천 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setLikeLoading(prev => ({ ...prev, [p.id]: false }));
    }
  };



  return (
    <>
      <div className={styles.container}>
        {/* 카테고리 탭 */}
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.tabButton} ${category === cat ? styles.active : ''}`}
              onClick={() => handleSelectCategory(cat)}
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
            placeholder="商品名を入力"
          />
        </div>
        {/* 정렬순 버튼 */}

        <div className={styles.sortTabs}>
          <button
            className={`${styles.tabButton} ${sort === 'new' ? styles.active : ''}`}
            onClick={() => setSort('new')}>
            新着順
          </button>
          <button
            className={`${styles.tabButton} ${sort === 'old' ? styles.active : ''}`}
            onClick={() => setSort('old')}>
            古い順
          </button>
          <button
            className={`${styles.tabButton} ${sort === 'recommend' ? styles.active : ''}`}
            onClick={() => setSort('recommend')}>
            人気順
          </button>
        </div>
      </div>


      <div className={styles.product}>
        <h2>商品一覧({total}個)</h2>
        {!loading && isMaster && (<button className={`${styles.btn} ${styles.register}`}
          onClick={() => navigate('/product/register')}>
          + 商品登録
        </button>
        )}
      </div>

      <div className={styles.listWrap}>
        {products.length > 0 ? (
          products.map((p) => (             //map해서 상품 배열 하나씩 렌더링(p)
            <article
              key={p.id} className={styles.card} onClick={() => onSelect?.({ id: p.id, name: p.name })}>
              {p.imageUrl ? (
                <img
                  className={styles.thumb}
                  src={`http://localhost:8080/cal/image/load/${p.imageUrl}`}
                  alt={p.name}
                />) : (<div className={`${styles.thumb} ${styles['thumb--placeholder']}`} />)}
              
              <div className={styles.titleRow}>
                <h3 className={styles.name}>{p.name}</h3>
                {/* 추천 버튼 추가 */}
                <button
                  className={`${styles.btn} ${styles.likeBtn} ${p.liked ? styles.liked : ''}`}
                  style={{ color: p.liked ? "red" : "gray" }}
                  onClick={e => { e.stopPropagation(); handleClickLike(p); }}
                  disabled={!!likeLoading[p.id]}
                >
                  ❤️ {p.likeCount}
                </button>
              </div>

              <div className={styles.meta}>
                <span className={styles.price}>
                  {Number(p.price).toLocaleString()}円(税込)
                </span>
                <span className={styles.category}>{p.category}</span>

              </div>
              <div className={styles.buttonWrap}>
                {/* 로그인한 경우에만 버튼 보이기 (loading 동안은 숨김) */}
                <button
                  className={`${styles.btn} ${styles.primary}`}
                  onClick={handleClickReview(p.id)}
                  disabled={loading}
                >
                  レビュー投稿
                </button>

                {/* 수정/삭제: 관리자 또는 본인 소유일 때만 보이게 */}
                {(isMaster || (user?.id && user.id === ownerOf(p))) && (
                  <>
                    <button className={`${styles.btn} ${styles.outline}`}
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/edit/${p.id}`); }}>
                      編集
                    </button>
                    <button className={`${styles.btn} ${styles.danger}`}
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/delete/${p.id}`); }}  >
                      削除
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        ) : (
          <p>商品がありません。</p>
        )}
      </div>


      {/* ✅ 페이징 블럭 */}
      <div className={styles.pagination}>
        {startPage > 1 && (
          <button className={`${styles.page} ${styles.prev}`} onClick={() => setCurrentPage(startPage - 1)}>
            ◀ 前へ
          </button>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`${styles.page} ${currentPage === num ? styles.active : ''}`}
          >
            {num}
          </button>
        ))}
        {endPage < totalPages && (
          <button className={`${styles.page} ${styles.prev}`} onClick={() => setCurrentPage(endPage + 1)}>
            次へ ▶
          </button>
        )}
      </div>
    </>
  );
}