import React, { useState, useEffect } from 'react';
import { Navbar, Container, Image, Button, Card, Accordion, Modal, Form, FloatingLabel } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import Menu from './Menu.js';
import { useNavigate } from 'react-router-dom'
import supabase from './config/supabaseClient';

function Home() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [expandedQuestions, setExpandedQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const id = localStorage.getItem("id");
 

   
        const fetchQuestions = async () => {
            try {
                const id = localStorage.getItem("id");
                const { data, error } = await supabase
                    .from('question')
                    .select('*')
                    .eq('user_id', id);

                if (error) {
                    throw error;
                }
                // Initialize expandedQuestions state to have the same length as the questions array, with each element initially set to false
                setExpandedQuestions(new Array(data.length).fill(false));
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error.message);
            }
        };
        useEffect(() => {
        fetchQuestions();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleAddQuestion = async () => {
        try {
            const { data } = await supabase
            .from('question')
            .insert([
                {
                    user_id : id,
                    question_title : title,
                    question,
                },
            ])
            alert("Question Saved!");
            handleCloseModal();
            fetchQuestions();
        } 
        catch (error) {
            console.error('Error during login:', error.message);
        }
        
    };

    const addQuestion = () => {
        handleShowModal();
    };

    return (
        <>
            <Navbar className='p-3 nav-bottom'>
                <Container className='d-flex justify-content-center'>
                    <Image src='assessmate.png' alt='' className='question-image'/>
                </Container>
            </Navbar>
            <Container>
                <div className='d-flex justify-content-end me-1 mt-4'>
                    <Button className='bttn rounded-pill fw-bold p-2 fs-5' onClick={addQuestion}>
                        <IoMdAddCircle size={17} className='mb-1 p-0'/>
                        &nbsp;Add Question
                    </Button>
                </div>
            </Container>
            <div className='mt-3' style={{ overflowY: 'scroll', maxHeight: '490px' }}>
                <Container>
                    {questions.map((question, index) => (
                        <div className='mb-2'>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>{question.question_title}</Accordion.Header>
                                    <Accordion.Body>{question.question}</Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    ))}
                </Container>
            </div>
            <Menu />
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>ADD QUESTION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel label="Title" className='mb-3'>
                            <Form.Control 
                                type="text"
                                placeholder="Title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Question" className='mb-3'>
                            <Form.Control 
                                type="text" 
                                placeholder="Question" 
                                value={question} 
                                onChange={(e) => setQuestion(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddQuestion}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Home;
