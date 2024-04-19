import '../App.css';
import React, { useState } from 'react';
import supabase from './config/supabaseClient';
import { useNavigate,Link } from 'react-router-dom';
import { Container,Image,Form,FloatingLabel,Button,Spinner } from 'react-bootstrap';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    checkpass(); // Call checkpass to proceed with registration
  };

  const checkpass = () => {
    if(password === confirmPassword){
      register();
    }
    else{
      alert("PASSWORD DO NOT MATCH!");
      setLoading(false); 
    }
  }

  const register = async () => {
    try {
        const { data } = await supabase
        .from('users')
        .insert([
            {
              'user_name' : name,
              'user_email' : email,
              'password' : password,
            },
        ])
        console.log(data);
        alert('Register Successfully');
        navigate('/');
    } 
    catch (error) {
      console.error('Error during login:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container style={{marginTop: '100px'}}>
        <Container className='mt-5'>
          <Image src='assessmate.png' alt='' className='login-image'/>
        </Container>
        <Container>
          <Form id="register" onSubmit={handleRegister}>
            <FloatingLabel label="Full name" className="mb-2 mt-4">
              <Form.Control 
                type="text" 
                placeholder="name@example.com" 
                value={name}
                onChange={handleNameChange}
              />
            </FloatingLabel>
            <FloatingLabel label="Email address" className="mb-2">
              <Form.Control 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={handleEmailChange}
              />
            </FloatingLabel>
            <FloatingLabel label="Password" className='mb-2'>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={handlePasswordChange}
              />
            </FloatingLabel>
            <FloatingLabel label="Confirm password" className='mb-4'>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </FloatingLabel>
            <div className='d-flex justify-content-center rounded-3'>
              <Button 
                className='w-75 fw-bold bttn p-2 fs-5' 
                onClick={checkpass} 
                data-bs-toggle="modal" 
                data-bs-target="#myModal"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                      Loading...
                  </>
                ) : "Register"}
              </Button>
            </div>
            <div className="modal fade" id="myModal">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    <p className="text-center">Account successfully registered!!</p>
                  </div>
                </div>
              </div>
            </div>
            <Container className='d-flex justify-content-center mt-4'>
              <p>Already have an account?&nbsp;</p>
              <Link to='/'>Login</Link>
            </Container>
          </Form>
        </Container>
      </Container>
    </>
  );
};

export default Register;
