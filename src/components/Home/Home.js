import { FaComments, FaList, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './Home.css';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};

function Home() {
    const navigate = useNavigate(); // navigate 함수 생성
    const goToNewProduct = () => navigate("/products/new");
    const goToProductList = () => navigate("/products/list");
    const goToBoardList = () => navigate("/board/list");
    return (
        <div className="home-container">
            <div className="overlay">
                <header className="site-header">
                    <h1>Welcome to 편의점 리뷰 페이지 by 칼국수</h1>
                    <p>コンビニの人気商品を紹介してレビューを残してください！</p>
                </header>
                <div className="slider-wrapper">
                    <Slider {...settings} className="slider-container">
                        <div><img src="https://i.namu.wiki/i/KZ34WxpyosS203yahk3JxtPS7aXZkriUf0HG-DhoQEioyc2lz0SkNWIybPEOjMleZX5_rAWBz02ylIE5q9ZSDw.svg" alt="배너1" /></div>
                        <div><img src="https://i.namu.wiki/i/nkz58Z3ZeWrnE_laSoQay1HqzFNx3eLdTnRuZHWX5rb6gpctB0mSO8it9yEXArK6D7lO9AeZP8IsKW06589zxA.svg" alt="배너2" /></div>
                        <div><img src="https://i.namu.wiki/i/wvyrjgU5EXeSeuwlcmBKZRv4hdL39vhPDhBtbo6XHaAIGuKQFsYtyrUXGgYuJWDLpoPuJKHKEstNMVJvAvBxs-V7cdX40wFIlrTCl6-iksJDy2eWzDhS-mIIvoN5wDY7aeUczIp9i_biO-crFU20XA.svg" alt="배너3" className="familymart_img" /></div>
                    </Slider>
                </div>
                <div className="home-buttons">
                    <button onClick={goToNewProduct} spellCheck="false"><FaPlus /> 상품 등록</button>
                    <button onClick={goToProductList} spellCheck="false"><FaList /> 상품 목록</button>
                    <button onClick={goToBoardList} spellCheck="false"><FaComments /> 게시판 보기</button>
                </div>

                <footer>
                    <p> © 2025 칼국수 팀 첫 프로젝트 </p>
                </footer>
            </div >
        </div>
    );
}

export default Home;