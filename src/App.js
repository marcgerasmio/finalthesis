import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Criteria from './components/Criteria';
import Trialquestion from './components/trialquestion';
import TrialAddQuestion from './components/trialaddquestion';

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element = {<Home />}/>
        <Route path="/criteria" element = {<Criteria />}/>
        <Route path="/register" element = {<Register />}/>
        <Route path="/" element = {<Login />}/>
        <Route path="/trial" element = {<Trialquestion />}/>
        <Route path="/addquestion" element = {<TrialAddQuestion />}/>
      </Routes>
    </>
  );
}

export default App;
