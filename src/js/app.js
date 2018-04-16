'use strict';
import 'babel-polyfill';

document.addEventListener('DOMContentLoaded', () => {
  function synthesis(token, text, voiceConfig) {
    const request = {};
    request.input = { text: text };
    request.voice = voiceConfig;
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
  const languageCode = 'ja-JP';

  let token;
  fetch('/credential.json')
    .then((response) => { return response.json(); })
    .then((credentail) => {
      token = credentail.token;
      return fetch("https://texttospeech.googleapis.com/v1beta1/voices", {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${token}`
        })
      })
    })
    .then((response) => { return response.json(); })
    .then((json) => {
      const select = document.querySelector("select[name=voice]");

      json.voices.forEach((val,index,ar) => {
        if (! val.languageCodes.includes(languageCode)) {
          return;
        }

        const option = document.createElement("option");
        option.appendChild(document.createTextNode(val.name));
        option.defaultValue = val.name;
        option.dataset.ssmlGender = val.ssmlGender;
        select.appendChild(option);
      });

      const btn = document.querySelector("button[name=synthesis]");
      const text = document.querySelector("textarea[name=text]");
      btn.onclick = (ev) => {
        const option = select.querySelectorAll('option:checked')[0];

        synthesis(token, text.value, { languageCode: languageCode, name: option.value, ssmlGender: option.dataset.ssmlGender })
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
