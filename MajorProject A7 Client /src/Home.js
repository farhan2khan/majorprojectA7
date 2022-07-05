import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SignLanguageToSpeech from './SignLanguageToSpeech';
import { useSpeechSynthesis } from "react-speech-kit";

function Home() {
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const { speak } = useSpeechSynthesis();

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
    speak({ text: "Welcome to Sign Language To Speech Converter Application" });
  }

  function handleClose() {
    setShow(false);
    window.location.reload(false);
  }

  return (
    <div>
      <div class="px-4 py-5 my-5 text-center">
        <img class="d-block mx-auto mb-4" src="https://upload.wikimedia.org/wikipedia/commons/7/7d/American_Sign_Language_ASL.svg" alt="" width="400" />
        <h1 class="display-5 fw-bold">Sign Language To Speech Converter</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">A language translator is extensively utilized by the mute people for converting and giving shape to their thoughts. A system is in urgent need of recognizing and translating sign language.</p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Button variant="primary" onClick={handleShow}>
              Start Camera
            </Button>

            <Modal show={show} fullscreen={fullscreen} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Sign Language To Speech Converter</Modal.Title>
              </Modal.Header>
              <Modal.Body><SignLanguageToSpeech /></Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home