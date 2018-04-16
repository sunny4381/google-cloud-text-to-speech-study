# Google Cloud Text to Speech API Study

This is trivial study.

## Getting Started

Run following command to build `public/js/bundle.js`.

```
$ npm run build
```

And then create `public/credential.json` like this:

```
{
  "token": "YOUR_ACCESS_TOKEN"
}
```

If you have installed gcloud tools, you can get your access token via: `gcloud auth application-default print-access-token`.

And then run following command to start development web server.

```
$ npm run start
```

And then open <http://localhost:8080/> in your browser.

## See Also

[Google Cloud Text-to-Speech API Documentation](https://cloud.google.com/text-to-speech/docs/)
