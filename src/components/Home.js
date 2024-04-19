import React, { useState, useEffect } from 'react';
import { Navbar, Container, Image, Button, Accordion, Modal, Form, FloatingLabel } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";
import Menu from './Menu.js';
import supabase from './config/supabaseClient';
import '../App.css';

function Home() {
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const [editIndex, setEditIndex] = useState(null); 
    const [modalType, setModalType] = useState('add'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const id = localStorage.getItem("id");

    const fetchQuestions = async () => {
        try {
            const { data, error } = await supabase
            .from('question')
            .select('*')
            .eq('user_id', id);

            if (error) {
                throw error;
            }
            setQuestions(data);
            setFilteredQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error.message);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        setTitle('');
        setQuestion('');
        setEditIndex(null);
    };

    const handleShowModal = (index) => {
        setEditIndex(index);
        if (index !== null && questions[index]) {
            setTitle(questions[index].question_title);
            setQuestion(questions[index].question);
        } else {
            setTitle('');
            setQuestion('');
        }
        setShowModal(true);
    };

    const handleAddClick = () => {
        setModalType('add');
        handleShowModal(null);
    };

    const handleEditClick = (index) => {
        setModalType('edit');
        handleShowModal(index);
    };

    const handleAddQuestion = async () => {
        try {
            const { data } = await supabase
            .from('question')
            .insert([
                {
                    question_title: title,
                    question: question,
                    user_id:id,
                },
            ]);
            console.log(data);
            alert("Question Saved!");
            handleCloseModal();
            fetchQuestions();
        } 
        catch (error) {
            console.error('Error during add question:', error.message);
        }
    };

    const handleEditQuestion = async () => {
        try {
            const { data } = await supabase
            .from('question')
            .update({
                question_title: title,
                question: question,
            })
            .eq('id', questions[editIndex].id);
            console.log(data);
            alert("Question Updated!");
            handleCloseModal();
            fetchQuestions();
        } 
        catch (error) {
            console.error('Error during edit question:', error.message);
        }
    };

    const handleTextAreaChange = (e) => {
        setQuestion(e.target.value);
        resizeTextarea();
    };

    const resizeTextarea = () => {
        const textarea = document.getElementById('questionTextarea');
        if (textarea) {
            textarea.style.height = 'auto'; 
            textarea.style.height = `${textarea.scrollHeight}px`; 
        }
    };

    const handleSearch = () => {
        const filtered = questions.filter(
            (q) =>
                q.question_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuestions(filtered);
    };

    useEffect(() => {
        handleSearch(); 
    }, [searchTerm, questions]);

    const handleCheckboxChange = (index, isChecked) => {
        if (isChecked) {
            setSelectedItems([...selectedItems, index]);
        } else {
            const newSelectedItems = selectedItems.filter((item) => item !== index);
            setSelectedItems(newSelectedItems);
        }
    };

    const handleDeleteClick = async () => {
        try {
            if (selectedItems.length === 0) {
                alert("Please select items to delete.");
                return;
            }
    
            // Show confirmation dialog
            if (!window.confirm("Are you sure you want to delete selected items?")) {
                return;
            }
    
            const handleDelete = async () => {
                try {
                    const deletePromises = selectedItems.map(async (index) => {
                        await supabase.from('question').delete().eq('id', questions[index].id);
                    });
                    await Promise.all(deletePromises);
                    alert("Selected questions deleted!");
                    setSelectedItems([]);
                    fetchQuestions();
                } catch (error) {
                    console.error('Error during delete:', error.message);
                }
            };
    
            await handleDelete();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    
    return (
        <>
            <Navbar className='p-3 nav-bottom'>
                <Container className='d-flex justify-content-center'>
                    <Image src='assessmate.png' alt='' className='question-image'/>
                </Container>
            </Navbar>
            <Container>
                <div className='d-flex justify-content-end me-1 mt-4 gap-3'>
                    <Form.Control
                        type='text'
                        placeholder='Search Title . . .'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={handleSearch}
                        className="custom-search-bar w-100"
                    />
                    <Button className='bttn fw-bold p-2 w-25' onClick={handleAddClick}>
                        <IoMdAddCircle size={25} className='mb-1 p-0'/>
                    </Button>
                    <Button variant='danger' className='fw-bold p-2 w-25' onClick={handleDeleteClick}>
                        <FaTrashCan size={20} className='mb-1 p-0' />
                    </Button>
                </div>
            </Container>
            <div className='mt-3 scrollable-container'>
                <div className="scrollable-content">
                    <Container>
                        {(searchTerm ? filteredQuestions : questions).map((question, index) => (
                            <div className='mb-2 d-flex gap-3' key={index}>
                                <Form.Check
                                    type="checkbox"
                                    className={`mt-3 ${selectedItems.includes(index) ? 'checked' : ''}`}
                                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                />
                                <Accordion className='custom-accordion w-100'>
                                    <Accordion.Item eventKey={index.toString()}>
                                        <Accordion.Header>
                                            {question.question_title}
                                        </Accordion.Header>
                                        <Accordion.Body onClick={() => handleEditClick(index)}>
                                            {question.question}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        ))}
                    </Container>
                </div>
            </div>
            <Menu />
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Add Question' : 'Edit Question'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FloatingLabel label="Title" className='mb-3'>
                            <Form.Control 
                                type="text"
                                placeholder="Title" 
                                rows={10}
                                style={{ height: 'auto' }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} 
                                className="custom-form-control"
                            />
                        </FloatingLabel>
                        <FloatingLabel label="Question" className='mb-3'>
                            <Form.Control 
                                id="questionTextarea" // Add an id to the textarea for easy access
                                as="textarea"
                                rows={3} // Set an initial number of rows
                                placeholder="Question" 
                                value={question} 
                                onChange={handleTextAreaChange} // Use the new handler
                                style={{ resize: 'none', overflow: 'hidden' }} // Disable the textarea resizing handle
                                onFocus={resizeTextarea} // Trigger resizing on focus
                                className="custom-form-control"
                            />
                        </FloatingLabel>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        className='bttn rounded-pill fw-bold p-2 w-50' 
                        onClick={modalType === 'edit' ? handleEditQuestion : handleAddQuestion}
                    >
                        {modalType === 'edit' ? 'Save Changes' : 'Save Question'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Home;
