import React, { useState, useEffect } from 'react';
import GoogleDrive from '../../../service/googleDriveAPI';
import './db.css';

const Popup = ({ closePopup, onAddImages }) => {
  const [popupVisible, setPopupVisible] = useState(true);
  const [showGoogleDrive, setShowGoogleDrive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState('');

  useEffect(() => {
    const wrapper = document.getElementById('content-wrapper');
    wrapper?.classList.toggle('background-blur', popupVisible);
    return () => wrapper?.classList.remove('background-blur');
  }, [popupVisible]);

  const closeLocalPopup = () => {
    setPopupVisible(false);
    closePopup();
  };

  const selectGoogleDrive = () => setShowGoogleDrive(true);
  const selectOneDrive = () => alert("OneDrive integration coming soon!");

  const downloadJSON = (data, filename = 'vgg_annotations.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectLocalDrive = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.webkitdirectory = true;
    input.accept = "";

    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter(file => file.type.startsWith("image/"));
      const jsonFile = files.find(file => file.name.endsWith(".json"));

      const folderPath = imageFiles[0]?.webkitRelativePath?.split('/')[0] || "Untitled";
      const folderName = folderPath.replace(/[/\\]/g, '');

      if (jsonFile) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result);
            console.log("📄 Found existing JSON:", parsed);
          } catch (err) {
            console.error("❌ Invalid JSON:", err);
          }
        };
        reader.readAsText(jsonFile);
      } else {
        // Auto-generate and trigger download
        const newJSON = {
          project: folderName,
          version: "via-2.0.10",
          files: {},
          metadata: {},
          attributes: {}
        };

        imageFiles.forEach((file, index) => {
          const fileKey = `image_${index}`;
          newJSON.files[fileKey] = {
            fname: file.name,
            type: file.type,
            size: file.size
          };
        });
        if (jsonFile) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const parsed = JSON.parse(reader.result);
              console.log("✅ Loaded existing annotation JSON:", parsed);
              localStorage.setItem('annotationsPreview', JSON.stringify(parsed, null, 2)); // <== Store here
            } catch (e) {
              console.error("❌ Failed to parse JSON:", e);
            }
          };
          reader.readAsText(jsonFile);
        }

        console.log("🆕 No JSON found. Created JSON:", newJSON);
        downloadJSON(newJSON, `${folderName}_annotations.json`);
      }

      if (imageFiles.length > 0) {
        onAddImages(imageFiles);
        setToastText(`✅ ${imageFiles.length} image(s) loaded`);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          closeLocalPopup();
        }, 800);
      }
    };

    input.click();
  };

  return (
    <>
      <div id="content-wrapper"></div>

      {showToast && <div className="popup-success">{toastText}</div>}

      {popupVisible && !showGoogleDrive && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Save Images By</h2>
            <div className="underline"></div>

            <div className="button-container">
              <div className="option" onClick={selectGoogleDrive}>
                <img src="/src/assets/Google_Drive_Logo_512px.png" alt="Google Drive" />
                <p>Google Drive</p>
              </div>
              <div className="option" onClick={selectOneDrive}>
                <img src="/src/assets/Onedrive.png" alt="OneDrive" />
                <p>One Drive</p>
              </div>
              <div className="option" onClick={selectLocalDrive}>
                <img src="/src/assets/local-disk.png" alt="Local Drive" />
                <p>Local Drive</p>
              </div>
            </div>

            <div className="underline"></div>
            <span onClick={closeLocalPopup} className="decide-later">Decide Later</span>
          </div>
        </div>
      )}

      {showGoogleDrive && <GoogleDrive />}
    </>
  );
};

export default Popup;
