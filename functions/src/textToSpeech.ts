// import * as textToSpeech from '@google-cloud/text-to-speech';
// import * as Storage from '@google-cloud/storage';
// const gcs = new Storage();

// // Creates a client
// const client = new textToSpeech.TextToSpeechClient();

// // The text to synthesize
// const text = 'Hello, world!';

// // Construct the request
// const request = {
//   input: {text: text},
//   // Select the language and SSML Voice Gender (optional)
//   voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
//   // Select the type of audio encoding
//   audioConfig: {audioEncoding: 'MP3'},
// };

// // Performs the Text-to-Speech request
// client.synthesizeSpeech(request, (err, response) => {
//   if (err) {
//     console.error('ERROR:', err);
//     return;
//   }
//   gcs.bucket('read-books-to-me').upload(response.audioContent, {
//       destination: 'output.mp3'
//   } )

//   //Write the binary audio content to a local file
// //   fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
// //     if (err) {
// //       console.error('ERROR:', err);
// //       return;
// //     }
// //     console.log('Audio content written to file: output.mp3');
// //   });
// });