import React, { useState, useEffect } from 'react';
import Popup from '../components/popup/database/database'; 
import Header from "../components/ToolPage/Menu/Menu";
import Body from "../components/ToolPage/Body/Body"

const Tool = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Show the popup as soon as the user enters the page
  useEffect(() => {
    setShowPopup(true); // pop up
  }, []);

  const closePopup = () => setShowPopup(false);

  return (
    <div className="app">
      <Header />
      <Body />

      {/* Show popup if state is true */}
      {showPopup && <Popup closePopup={closePopup} />}
    </div>
  );
};

export default Tool;
