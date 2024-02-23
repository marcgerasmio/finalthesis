import '../App.css';
import React, { useState } from 'react';
import supabase from './config/supabaseClient';
import { useNavigate,Link } from 'react-router-dom';
import { Container,Image,FloatingLabel,Form,Button } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('user_email', email)
        .single();

      if (data && data.password === password) {
        console.log('Login successful');
        console.log(data);
        const id = data.id;
        localStorage.setItem('id', id);
        console.log(id);
        navigate("/home");
      } else {
        alert("INVALID CREDENTIALS"); 
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  return (
    <>
      <Container style={{marginTop: '100px'}}>
        <Container className='mt-5'>
          <Image src='assessmate.png' alt='' className='login-image'/>
        </Container>
        <Container>
          <FloatingLabel label="Email address" className="mb-2 mt-4">
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel label="Password" className='mb-3'>
            <Form.Control 
              type="password"
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
          <Form.Check label='Remeber me' className='mb-4' />
          <div className='d-flex justify-content-center rounded-3'>
            <Button className='w-75 fw-bold bttn p-2 fs-5' onClick={handlelogin}>
              Login
            </Button>
          </div>
          <Container className='d-flex justify-content-center mt-4'>
            <p>Don't have an account?&nbsp;</p>
            <Link to='/register'>Register</Link>
          </Container>
        </Container>
      </Container>
    </>
  );
};

export default Login;
