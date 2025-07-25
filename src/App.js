import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import BoardEdit from './components/board/boardEdit/BoardEdit';
import BoardList from './components/board/boardList/BoardList';
import BoardDetail from './components/board/BoardDetail';
import BoardForm from './components/board/BoardForm';
import BoardRegister from  './components/board/BoardRegister'


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/test" element={<BoardEdit id={5} />} />
          <Route path="/test1" element={<BoardList />} />
          <Route path="/board/detail/:id" element={<BoardDetail />} />
          <Route path="/board/form/:id" element={<BoardEdit />} />
          <Route path="/test2" element={<BoardRegister />} />
          
        
      </Routes>
      
    </Router>
 
  );
}

export default App;