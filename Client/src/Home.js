import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <link href="https://getbootstrap.com/docs/5.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous" />
      <div class="px-4 py-5 my-5 text-center">
        <img class="d-block mx-auto mb-4" src="https://upload.wikimedia.org/wikipedia/commons/7/7d/American_Sign_Language_ASL.svg" alt="" width="400" />
        <h1 class="display-5 fw-bold">Sign Language To Speech Converter</h1>
        <div class="col-lg-6 mx-auto">
          <p class="lead mb-4">A language translator is extensively utilized by the mute people for converting and giving shape to their thoughts. A system is in urgent need of recognizing and translating sign language.</p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/SignLanguageToSpeech"><button type="button" class="btn btn-primary btn-lg px-4 gap-3">Start Camera</button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home