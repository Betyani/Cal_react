import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileEdit from './pages/ProfileEdit';
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';


// 1차
import ProductList from './product/productList/ProductList';
import ProductRegister from './product/productRegister/ProductRegister';
import ProductDelete from './product/productDelete/ProductDelete';
import ProductEdit from './product/productEdit/ProductEdit'; 

// 2차
import BoardList from './components/board/boardList/BoardList';
import BoardDetail from './components/board/boardDetail/BoardDetail';
import BoardEdit from './components/board/boardEdit/BoardEdit';
import BoardRegister from './components/board/boardRegister/BoardRegister';
import Frame from './components/Home/Frame';

function App() {
  return (
    <Router>
      <Header /> {/*  로그인 상태, 로그아웃 관리 */}
      <div className="App">
        <Routes>
          {/* 홈 */}
          <Route path="/" element={<Frame />} />{/* 여기를 Home으로 바꿈 */}


          {/* 회원 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/profile/edit' element={<ProfileEdit />} />
          <Route path='/find-id' element={<FindId />} />
          <Route path='/find-password' element={<FindPassword />} />
          

          {/* 상품 */}
         
          <Route path="/products/list" element={<ProductList />} />
          <Route path="/products/new" element={<ProductRegister />} />
          <Route path="/product/delete/:id" element={<ProductDelete />} />
          <Route path="/product/edit/:productId" element={<ProductEdit />} />
          <Route path="/product/register" element={<ProductRegister />} />
    

          {/* 게시판 */}
          <Route path="/board/list" element={<BoardList />} />
          <Route path="/board/detail/:id" element={<BoardDetail />} />
          <Route path="/board/edit/:id" element={<BoardEdit />} />
          <Route path="/board/register/:productId" element={<BoardRegister />} />
        </Routes>
      
      {/* /board/list 를 디폴트로 하는거 */}
          {/* <Route path="*" element={<Navigate replace to="/board/list" />} /> */}
       
   
     

        {/*특정 경로에서만 보이게 하고 싶다면 Routes 안에서 조건부 렌더링도 가능,,, 여기서는 항상 보이도록 배치 */}
        {/* <div className="componentTachi">
          <ProductRegister />
          <BoardList />
          <ProductDelete />
        </div> */}
      
        </div>
         </Router>
  );
}

export default App;
