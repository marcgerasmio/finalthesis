import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

const OCRComponent = () => {
  const [file, setFile] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [showSubmitAnotherButton, setShowSubmitAnotherButton] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const recognizeImage = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setLoading(true);

    const startTime = Date.now(); // Record start time
    const url = 'https://pen-to-print-handwriting-ocr.p.rapidapi.com/recognize/';
    const data = new FormData();
    data.append('srcImg', file);
    data.append('Session', 'string');

    const options = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': '5af92c2a18msh142259cb90d2962p14e575jsne0fe3470e0e4',
        'X-RapidAPI-Host': 'pen-to-print-handwriting-ocr.p.rapidapi.com'
      },
      body: data
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const res = result.value;
      
      setResponseText(res);
      setShowSubmitAnotherButton(true); // Show the button after displaying the response
    } catch (error) {
      console.error(error);
    } finally {
      const endTime = Date.now(); // Record end time
      const durationInSeconds = (endTime - startTime) / 1000; // Calculate duration in seconds
      setResponseTime(durationInSeconds);
      setLoading(false);
    }
  };

  const resetState = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1>TESTING OCR ACCURACY</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={recognizeImage} disabled={loading}>Recognize Image</button>
      {showSubmitAnotherButton && <button onClick={resetState}>Submit Another Image</button>}
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Extracting Text</p>
        </div>
      )}
      {responseText && (
        <div>
          <div>Response: {responseText}</div>
          <div>Response Time: {responseTime} seconds</div>
        </div>
      )}
    </div>
  );
};

export default OCRComponent;
