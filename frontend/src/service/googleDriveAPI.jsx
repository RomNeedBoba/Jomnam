import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import './google.css'; 

const CLIENT_ID = "681416786237-nuq16sgll0j487f7akik4vrr0v0c06vv.apps.googleusercontent.com";
const API_KEY = "AIzaSyBlB6fQ_tVmQXktYPMBoIUu3rrplZIuTM8";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

const GoogleDrive = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [popupVisible, setPopupVisible] = useState(true);

    // Initialize Google API Client
    useEffect(() => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                scope: SCOPES,
                discoveryDocs: DISCOVERY_DOCS,
            });
        });
    }, []);

    // Handle Google Drive login
    const handleLogin = () => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            setIsLoggedIn(true);
            setPopupVisible(false); // Close popup after successful login
        });
    };

    // Close the popup
    const closePopup = () => {
        setPopupVisible(false);
    };

    return (
        <>
            <div id="content-wrapper"></div>

            {/* Popup for selecting storage */}
            {popupVisible && (
                <div className="popup-overlay">
                    <div className="popup-box">

                        <h2>Authorize Google Drive</h2>
                        <div className="underline"></div>
                        <div className="button-container">
                            <button
                                onClick={handleLogin}
                                className="authorize-button"
                                style={{
                                    backgroundColor: '#12284C',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={closePopup}
                                className="cancel-button"
                                style={{
                                    backgroundColor: 'white',
                                    color: '#12284C',
                                    border: '2px solid #12284C',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GoogleDrive;
