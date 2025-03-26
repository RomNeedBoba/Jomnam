import React, { useState, useEffect } from 'react';
import './db.css';

const Popup = () => {
  const [popupVisible, setPopupVisible] = useState(true);

  useEffect(() => {
    const wrapper = document.getElementById('content-wrapper');
    if (popupVisible) {
      wrapper.classList.add('background-blur');
    } else {
      wrapper.classList.remove('background-blur');
    }

    return () => {
      wrapper.classList.remove('background-blur');
    };
  }, [popupVisible]);

  const closePopup = () => {
    setPopupVisible(false);
  };

  const selectGoogleDrive = () => {
    alert("Google Drive integration coming soon!");
  };

  const selectOneDrive = () => {
    alert("OneDrive integration coming soon!");
  };

  const selectLocalDrive = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      let file = e.target.files[0];
      if (file) {
        let url = URL.createObjectURL(file);
        alert("Image uploaded: " + file.name);
        console.log("Image URL:", url);
      }
    };
    input.click();
  };

  return (
    <>
      {/* Wrapper for the entire page */}
      <div id="content-wrapper"></div>

      {popupVisible && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Save Images By</h2>
            <div className="underline"></div>
            <div className="button-container">
              <div className="option" onClick={selectGoogleDrive}>
                <img src="/src/assets/Google_Drive_Logo_512px.png" alt="Google Drive" />
                <p style={{ textAlign: 'center' }}>Google Drive</p>
              </div>
              <div className="option" onClick={selectOneDrive}>
                <img src="/src/assets/Onedrive.png" alt="OneDrive" />
                <p style={{ textAlign: 'center' }}>One Drive</p>
              </div>
              <div className="option" onClick={selectLocalDrive}>
                <img src="/src/assets/local-disk.png" alt="Local Drive" />
                <p style={{ textAlign: 'center' }}>Local Drive</p>
              </div>
            </div>
            <div className="underline"></div>
            <span onClick={closePopup} className="decide-later">Decide Later</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
