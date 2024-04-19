import React, { useState, useEffect } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import Menu from './Menu.js';
import { Navbar, Container, Image, FloatingLabel, Form, Button, Spinner } from 'react-bootstrap';
import { FaCircleCheck } from "react-icons/fa6";
import supabase from './config/supabaseClient';
import { useNavigate } from 'react-router-dom';

function TakeCamera() {
  const [imageUrl, setImageUrl] = useState(null);
  const [questions, setQuestions] = useState([]); 
  const [criteria, setCriteria] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(""); // Set default value to an empty string
  const [selectedCriteria, setSelectedCriteria] = useState(""); // Set default value to an empty string
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      const imageUrl = image.webPath;
      setImageUrl(imageUrl);
      
      // Convert captured image to File
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });

      // Call the API with the captured image file
      callAPI(file);
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const callAPI = async (imageFile) => {
    setLoading(true); // Set loading state to true
    const url = 'https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/';
    const data = new FormData();
    data.append('srcImg', imageFile);
    data.append('Session', 'string');

    const options = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': 'ccf0c8673emshdd6ce28def39c50p115972jsn1766e2f29e8a',
        'X-RapidAPI-Host': 'pen-to-print-handwriting-ocr.p.rapidapi.com'
      },
      body: data
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const answer = result.value;
      console.log(answer);
      localStorage.setItem("answer", answer);
      navigate("/result");
      setLoading(false); // Set loading state to false after receiving response
    } catch (error) {
      console.error(error);
      setLoading(false); // Set loading state to false in case of error
    }
  };

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
      setQuestions(data); 
      if (data.length > 0) {
        setSelectedQuestion(data[0].question_title); // Set default value based on the first data in the dropdown
      }
    } catch (error) {
      console.error('Error fetching questions:', error.message);
    }
  };

  const fetchCriteria = async () => {
    try {
      const id = localStorage.getItem("id");
      const { data, error } = await supabase
        .from('rubrics')
        .select('*')
        .eq('user_id', id);

      if (error) {
        throw error;
      }
      setCriteria(data); 
      if (data.length > 0) {
        setSelectedCriteria(data[0].title); // Set default value based on the first data in the dropdown
      }
    } catch (error) {
      console.error('Error fetching criteria:', error.message);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCriteria();
  }, []);

  const handleStartChecking = () => {
    localStorage.setItem("question", selectedQuestion);
    localStorage.setItem("criteria", selectedCriteria);
    takePicture();
  };

  return (
    <>
      <Navbar className='p-3 nav-bottom'>
        <Container className='d-flex justify-content-center'>
          <Image src='assessmate.png' alt='' className='question-image' />
        </Container>
      </Navbar>
      <Container>
        <div className='mb-3'>
          <Form.Group>
            <Form.Label className='fw-bold mt-5 ms-2'>Select Question</Form.Label>
            <FloatingLabel label="Select Question :">
              <Form.Select value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}>
                {questions.map(question => (
                  <option key={question.id} value={question.question_title}>
                    {question.question_title}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>
        </div>
        <div className='mb-5'>
          <Form.Group>
            <Form.Label className='fw-bold mt-2 ms-2'>Select Criteria</Form.Label>
            <FloatingLabel label="Select Rubrics :">
              <Form.Select value={selectedCriteria} onChange={(e) => setSelectedCriteria(e.target.value)}>
                {criteria.map(criteria => (
                  <option key={criteria.id} value={criteria.title}>
                    {criteria.title}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Form.Group>
        </div>
        <div className='d-flex justify-content-center'>
          <Button className='bttn fw-bold rounded-pill p-2' onClick={handleStartChecking}>
            <FaCircleCheck size={20} className='mb-1 p-0' />
            &nbsp;Start Checking&nbsp;
          </Button>
        </div>
      </Container>
      {loading && (
                <div className="text-center mt-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p>Extracting Text</p>
                </div>
              )}
      <Menu />
    </>
  );
}

export default TakeCamera;
