import React, { useState, useEffect } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { FaFileCircleQuestion } from 'react-icons/fa6';
import { FaClipboardList } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { FaCamera } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeClicked, setActiveClicked] = useState('');

  useEffect(() => {
    // Update activeClicked based on the current endpoint
    switch (location.pathname) {
      case '/home':
        setActiveClicked('addQuestion');
        break;
      case '/criteria':
        setActiveClicked('addCriteria');
        break;
      case '/camera':
        setActiveClicked('choices');
        break;
      case '/profile':
        setActiveClicked('profile');
        break;
      // Add more cases as needed
      default:
        setActiveClicked('');
        break;
    }
  }, [location.pathname]);

  const addQuestion = () => {
    navigate('/home');
  };

  const choices = () => {
    navigate('/camera');
  };

  const profile = () => {
    navigate('/profile');
  };

  const addCriteria = () => {
    navigate('/criteria');
  };

  return (
    <>
      <Navbar fixed="bottom" className="nav-bottom">
        <Container className="d-flex justify-content-around p-1">
          <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <FaFileCircleQuestion
                size={27}
                className={`btn-icons ${activeClicked === 'addQuestion' ? 'activeClicked' : ''}`}
                onClick={addQuestion}
              />
            </div>
            <span className='text-muted'>Question</span>
          </div>
          <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <FaCamera
                size={27}
                className={`btn-icons ${activeClicked === 'choices' ? 'activeClicked' : ''}`}
                onClick={choices}
              />
            </div>
            <span className='text-muted'>Camera</span>
          </div>
          <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <FaClipboardList
                size={27}
                className={`btn-icons ${activeClicked === 'addCriteria' ? 'activeClicked' : ''}`}
                onClick={addCriteria}
              />
            </div>
            <span className='text-muted'>Criteria</span>
          </div>
          <div className='d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <IoPersonSharp
                size={27}
                className={`btn-icons ${activeClicked === 'profile' ? 'activeClicked' : ''}`}
                onClick={profile}
              />
            </div>
            <span className='text-muted'>Profile</span>
          </div>
        </Container>
      </Navbar> 
    </>
  );
}

export default Menu;
