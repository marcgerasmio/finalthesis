import supabase from './config/supabaseClient';
import { useEffect, useState } from 'react';
import OpenAI from "openai";
import { Navbar, Container, Image, Button, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true 
});

function Result() {
  const quest = localStorage.getItem("question");
  const crit = localStorage.getItem("criteria");
  const ans = localStorage.getItem("answer");
  const id = localStorage.getItem("id");
  const [questions, setQuestions] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [completionData, setCompletionData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchCriteria = async (question) => {
    try {
      const { data, error } = await supabase
        .from('rubrics')
        .select('*')
        .eq('title', crit)
        .eq('user_id', id);

      if (error) {
        throw error;
      }
      const criteria = data[0].criteria;
      fetchCompletion(question, criteria);
    } catch (error) {
      console.error('Error fetching questions:', error.message);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('question')
        .select('*')
        .eq('question_title', quest)
        .eq('user_id', id);

      if (error) {
        throw error;
      }
      const question = data[0].question;
      fetchCriteria(question);
    } catch (error) {
      console.error('Error fetching questions:', error.message);
    }
  };

  const fetchCompletion = async (question, criteria) => {
    const content1 = "Does this answer:";
    const content2 = "fits with this question:"
    const content3 = "If NO, score it 0 and if YES then rate it based on this criteria and response with only the number of score:";
    const prompt = content1 + ans + content2 + question + content3 + criteria;
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": prompt,
          }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const data = response.choices[0].message.content;
      setCompletionData(data);
    } catch (error) {
      console.error("Error fetching completion:", error.message);
    } finally {
      setLoading(false); // Set loading to false once the data is fetched
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const close = async () => {
    navigate("/camera");
  }

  return (
    <>
      <Navbar className='p-3 nav-bottom'>
        <Container className='d-flex justify-content-center'>
          <Image src='assessmate.png' alt='' className='question-image' />
        </Container>
      </Navbar>

      <Container className='mt-5'> 
        <Card className='p-5'>
          <Card.Body>
            <Card.Title className='d-flex justify-content-center'>
              {loading && (
                <div className="text-center mt-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p>Loading score...</p>
                </div>
              )}
              {completionData && 
                <div className="data-box mt-3">
                  <h5 className='fw-bold'>SCORE : {completionData}</h5>
                </div>
              }
            </Card.Title>
            <Card.Text className='mt-4'>
              <span className='fw-bold'>Question:</span> {quest}<br/>
              <span className='fw-bold'>Criteria:</span> {crit}
            </Card.Text>
            <Card.Text>
              <div className='d-flex flex-column align-items-center justify-content-center'>
                <Button 
                  variant="primary" 
                  className="mt-4 bttn fw-bold" 
                  onClick={close}
                >
                  CHECK ANOTHER PAPER
                </Button>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Result;
