import React, { useState, useEffect } from 'react';
import { Navbar, Container, Image, Button, Accordion, Modal, Form, FloatingLabel, Col } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";
import Menu from './Menu.js';
import supabase from './config/supabaseClient';
import '../App.css';

function Criteria() {
    const [questions, setQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null); 
    const [title, setTitle] = useState('');
    const [criteria, setCriteria] = useState('');
    const [modalType, setModalType] = useState('add'); 
    const id = localStorage.getItem("id");
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const fetchQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('rubrics')
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
        setCriteria('');
        setEditIndex(null);
    };

    const handleShowModal = (index) => {
        if (index !== null && questions[index]) {
            setEditIndex(index);
            setTitle(questions[index].title);
            setCriteria(questions[index].criteria);
        }
        setShowModal(true);
    };

    const handleEditClick = (index) => {
        setModalType('edit');
        handleShowModal(index);
    };

    const handleAddClick = () => {
        setModalType('add');
        handleShowModal(null);
    };

    const handleEditCriteria = async () => {
        try {
            const { data } = await supabase
            .from('rubrics')
            .update({
                title,
                criteria,
            })
            .eq('id', questions[editIndex].id);

            alert("Criteria Updated!");
            handleCloseModal();
            fetchQuestions();
        } 
        catch (error) {
            console.error('Error during edit:', error.message);
        }
    };

    const handleAddCriteria = async () => {
        try {
            const { data } = await supabase
            .from('rubrics')
            .insert([
                {
                    user_id : id,
                    title,
                    criteria,
                },
            ]);
            alert("Question Saved!");
            handleCloseModal();
            fetchQuestions();
        } 
        catch (error) {
            console.error('Error during add criteria:', error.message);
        }
    };

    const handleSearch = () => {
        const filtered = questions.filter(
            (q) =>
                q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.criteria.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleDelete = async () => {
        try {
            const deletePromises = selectedItems.map(async (index) => {
                await supabase.from('rubrics').delete().eq('id', questions[index].id);
            });
            await Promise.all(deletePromises);
            alert("Selected items deleted!");
            setSelectedItems([]);
            fetchQuestions();
        } catch (error) {
            console.error('Error during delete:', error.message);
        }
    };

    const handleDeleteClick = () => {
        if (selectedItems.length === 0) {
            alert("Please select items to delete.");
            return;
        }

        // Show confirmation dialog
        if (!window.confirm("Are you sure you want to delete selected items?")) {
            return;
        }

        handleDelete();
    };

    return (
        <>
            <Navbar className='p-3 nav-bottom'>
                <Container className='d-flex justify-content-center'>
                    <Image src='assessmate.png' alt='' className='question-image' />
                </Container>
            </Navbar>
            <Container>
                <div className='d-flex justify-content-end me-1 mt-4 gap-3'>
                    <Form.Control
                        type='text'
                        placeholder='Search Criteria . . .'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={handleSearch}
                        className="custom-search-bar"
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
                                    className='mt-3 custom-checkbox'
                                    checked={selectedItems.includes(index)}
                                    onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                />
                                <Accordion className='custom-accordion w-100'>
                                    <Accordion.Item eventKey={index.toString()}>
                                        <Accordion.Header className="accordion-header">
                                            {question.title || ''}
                                        </Accordion.Header>
                                        <Accordion.Body onClick={() => handleEditClick(index)}>
                                            {question.criteria || ''}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        ))}
                    </Container>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'add' ? 'Add Criteria' : 'Edit Criteria'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex justify-content-center'>
                        <FloatingLabel label='Title' className="mb-3 w-100">
                            <Form.Control 
                                type="text" 
                                placeholder='Title' 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="custom-form-control"
                            />
                        </FloatingLabel>
                    </div>
                    <Form>
                        <Col style={{ flex: '0 0 30%' }}>
                            <FloatingLabel label='Criteria' className="mb-3">
                                <Form.Control 
                                    as="textarea"
                                    placeholder='Criteria'
                                    rows={10}
                                    style={{ height: 'auto' }}
                                    value={criteria}
                                    onChange={(e) => setCriteria(e.target.value)} 
                                    className="custom-form-control"
                                />
                            </FloatingLabel>
                        </Col>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        className="bttn rounded-pill fw-bold p-2 w-50" 
                        onClick={modalType === 'edit' ? handleEditCriteria : handleAddCriteria}
                    >
                        {modalType === 'edit' ? 'Save Changes' : 'Save Criteria'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Menu />
        </>
    );
    
}

export default Criteria;
