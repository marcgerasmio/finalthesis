import { Navbar,Container } from 'react-bootstrap';
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Menu(){
  const navigate = useNavigate();
  const addQuestion = () =>{
    navigate("/home");
  }
  const choices = () =>{}
  const profile = () =>{
    localStorage.clear();
    navigate("/");
  }
  const addCriteria = () =>{
    navigate("/criteria");
  }

  return (
    <>
      <Navbar fixed="bottom" className='nav-bottom'>
        <Container className='d-flex justify-content-around p-1'> 
          <FaFileCircleQuestion size={27} className='btn-icons' onClick={addQuestion}/>
          <FaCamera size={27} className='btn-icons' onClick={choices}/>
          <FaClipboardList size={27} className='btn-icons' onClick={addCriteria} /> 
          <IoPersonSharp size={27} className='btn-icons' onClick={profile} />
        </Container>
      </Navbar>
    </>
  );
};

export default Menu;