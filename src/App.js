import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Criteria from './components/Criteria';
import TakeCamera from './components/Camera';
import Profile from './components/Profile'
import Trial from './components/Trial';
import OCRComponent from './components/OCR';
import Result from './components/Result';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element = {<Login />}/>
        <Route path="/home" element = {<Home />}/>
        <Route path="/criteria" element = {<Criteria />}/>
        <Route path="/register" element = {<Register />}/>
        <Route path="/camera" element = {<TakeCamera />}/>
        <Route path="/profile" element = {<Profile />}/>
        <Route path="/trial" element = {<Trial />}/>
        <Route path="/ocr" element = {<OCRComponent />}/>
        <Route path="/result" element = {<Result />}/>
      </Routes>
    </>
  );
}

export default App;
