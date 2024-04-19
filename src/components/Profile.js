import { Navbar,Container,Image,Button, Row, Col, Card, } from 'react-bootstrap';
import Menu from './Menu.js';
import supabase from './config/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile () {
    const [name, setName] = useState([]);
    const [email, setEmail] = useState([]);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const id = localStorage.getItem("id");
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id);

                console.log(data);
                const name = data[0].user_name;
                setName(name);
                const email = data[0].user_email;
                setEmail(email);
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error fetching questions:', error.message);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    }
    

    return (
        <>
            <div> 
                <Navbar className='p-3 nav-bottom'>
                    <Container className='d-flex justify-content-center'>
                        <Image src='assessmate.png' alt='' className='question-image'/>
                    </Container>
                </Navbar>   
                <Container className="container py-5 h-100">
                    <Row className="justify-content-center align-items-center h-100">
                        <Col md="12" xl="4">
                            <Card.Body className="text-center">
                                <div className="mt-3 mb-4">
                                    <Card.Img 
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                        className="rounded-circle" fluid style={{ width: '100px' }} 
                                    />
                                </div>
                                <h4>{name}</h4>
                                <p className="text-muted mb-4">{email}</p>
                                <Button 
                                    variant="primary" 
                                    className="rounded-pill fw-bold p-2 fs-5 bttn w-50" 
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            </Card.Body>
                        </Col>
                    </Row>
                </Container>
                <Menu />
            </div>
        </>
    );
}

export default Profile;