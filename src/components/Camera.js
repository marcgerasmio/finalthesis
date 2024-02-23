import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';

const Camera = () => {
  const [imageUrl, setImageUrl] = useState(null); // State to store the image URL

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      const imageUrl = image.webPath; // Get the image URL from the captured image
      setImageUrl(imageUrl); // Update the state with the image URL
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  return (
    <>
      <button onClick={takePicture}> CAMERA </button>
      {imageUrl && <img src={imageUrl} alt="Captured" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
    </>
  );
};

export default Camera;
