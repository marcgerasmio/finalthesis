import { Card,Form,Button,FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';
import supabase from './config/supabaseClient';
import { useNavigate } from 'react-router-dom';

function TrialAddQuestion(){
    const id = localStorage.getItem("id");
    const [title, setTitle] = useState('');
    const [question, setQuestion] = useState('');
    const navigate = useNavigate();
   
    const addquestion  = async () => {
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
            navigate("/home");
        } 
        catch (error) {
            console.error('Error during login:', error.message);
        }
    }

    const cancel = async() =>{
        navigate("/home");
    }

    return(
        <>
                    <div className='d-flex justify-content-center' style={{maxWidth: '100%'}}>
                        <Card>
                            <Card.Header className='text-muted'>ADD QUESTION</Card.Header>
                            <Card.Body>
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
                                    <div className='d-flex justify-content-end gap-2 mt-2'>
                                        <Button className='bttn fw-bold' onClick={cancel}>
                                           Cancel
                                        </Button>
                                        <Button className='bttn fw-bold' onClick={addquestion}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
        </>
    );
}

export default TrialAddQuestion;