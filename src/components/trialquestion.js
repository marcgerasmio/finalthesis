import React, { useState, useEffect } from 'react';
import supabase from './config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap'; // Assuming you have imported these components from react-bootstrap

function Trialquestion() {
  const id = localStorage.getItem("id");
  const [questions, setQuestions] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
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

    fetchQuestion();
  }, [id]);

  const addQuestion = () => {
    navigate("/addquestion");
  };

  const toggleQuestion = index => {
    setExpandedQuestions(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className='mt-3' style={{ overflowY: 'scroll', maxHeight: '490px' }}>
      <Container>
        <button onClick={addQuestion} className='btn btn-primary mb-2'>ADD QUESTION</button>
        {questions.map((question, index) => (
          <Card key={question.id} className='w-100 mb-2'>
            <Card.Body>
              <Card.Text onClick={() => toggleQuestion(index)} style={{ cursor: 'pointer' }}>
                {question.question_title}
              </Card.Text>
              {expandedQuestions[index] && <Card.Text>{question.question}</Card.Text>}
              {/* Add other fields here as needed */}m
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
}

export default Trialquestion;
