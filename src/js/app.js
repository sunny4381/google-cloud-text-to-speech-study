'use strict';
import 'babel-polyfill';

document.addEventListener('DOMContentLoaded', () => {
  function synthesis(token, text) {
    const request = {};
    request.input = { text: text };
    // request.voice = { languageCode: 'en-gb', name: 'en-GB-Standard-A', ssmlGender: 'FEMALE' };
    request.voice = { languageCode: 'ja-jp', ssmlGender: 'FEMALE' };
    request.audioConfig = { audioEncoding: 'MP3' };

    return fetch("https://texttospeech.googleapis.com/v1beta1/text:synthesize", {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(request)
    });
  };

  function play(buffer) {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(context.destination);
    source.start(0);
  };

  const context = new window.AudioContext();

  fetch('/credential.json')
    .then((response) => { return response.json(); })
    .then((credentail) => {
      const token = credentail.token;

      const btn = document.querySelector("button[name=synthesis]");
      const text = document.querySelector("textarea[name=text]");
      btn.onclick = (ev) => {
        synthesis(token, text.value)
          .then((response) => { return response.json(); })
          .then((response) => {
            const base64Audio = response.audioContent;
            const binaryAudio = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
            return context.decodeAudioData(binaryAudio.buffer);
          })
          .then((buffer) => { play(buffer) });
      };
    });
});
