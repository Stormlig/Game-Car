
import { useEffect, useState } from "react";

// Function to handle camera movement
const handleCameraMovement = (setMouseStationary) => {
  let isMouseStationary = true;
  let mouseMoveTimeout;
  
  const onMouseMove = () => {
    if (!isMouseStationary) {
      clearTimeout(mouseMoveTimeout);
    }
    
    isMouseStationary = false;
    mouseMoveTimeout = setTimeout(() => {
      isMouseStationary = true;
      setMouseStationary(true);
    }, 60000); // 1 minute
  };

  const onDocumentClick = () => {
    setMouseStationary(false);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("click", onDocumentClick);

  return () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("click", onDocumentClick);
  };
};

// Function to handle electron quantity and rotation
const handleElectronInteraction = (isMouseStationary, setElectronQuantity) => {
  useEffect(() => {
    if (isMouseStationary) {
      // Check for conditions to increase electron quantity and rotation
      // You can adjust the conditions as per your requirements
      if (Math.random() > 0.5) {
        setElectronQuantity((prevQuantity) => prevQuantity + 10);
      }
    }
  }, [isMouseStationary, setElectronQuantity]);
};

// Component using the above functions
export default function Scene() {
  const [isMouseStationary, setMouseStationary] = useState(true);
  const [electronQuantity, setElectronQuantity] = useState(0);

  // Call the camera movement function
  handleCameraMovement(setMouseStationary);

  // Call the electron interaction function
  handleElectronInteraction(isMouseStationary, setElectronQuantity);

  // Rest of your component code
  // ...

  // You can use 'electronQuantity' in your 'Float' components to set the quantity dynamically
  return (
    // ...
  );
}
