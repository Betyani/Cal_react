import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home-container">
            <header>
                <h1>Welcome to 편의점 리뷰 페이지 by 칼국수</h1>
                <p>コンビニの人気商品を紹介してレビューを残してください！</p>
            </header>

            <div className="home-buttons">
                <Link to="/products/new"><button>상품 등록</button></Link>
                <Link to="/products/list"><button>상품 목록</button></Link>
                <Link to="/board/list"><button>게시판 보기</button></Link>
            </div>

            <footer>
                <p> © 2025 칼국수 팀 첫 프로젝트 </p>
            </footer>
        </div>
    );
}

export default Home;