import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Cloud Storage
import * as Storage from '@google-cloud/storage';
const gcs = new Storage();

// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient = new vision.ImageAnnotatorClient();

// Cloud Text to Speech
import * as textToSpeech from '@google-cloud/text-to-speech';
const client = new textToSpeech.TextToSpeechClient();

export const textExtraction = functions.storage
    .object()
    .onFinalize(async object => {
        const fileBucket = object.bucket;
        const filePath = object.name;

        const imageUri = `gs://${fileBucket}/${filePath}`;
        const docRef = admin.firestore().collection('pages');

        // Text Extraction
        const textRequest = await visionClient.documentTextDetection(imageUri);
        const fullText = textRequest[0].textAnnotations[0];
        const text = fullText ? fullText.description : null;

        // Construct the text-to-speech request
        const request = {
            input: { text: text },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            // Select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };
        console.log('finished constructing the text-so-speech request');

        // Performs the Text-to-Speech request
        client.synthesizeSpeech(request, (err, response) => {
            console.log('starting the speech synthesizer');
            if (err) {
                console.error('ERROR:', err);
                return;
            }
            // Upload audio to Firebase Storage
            gcs.bucket(fileBucket).upload(response.audioContent, {
                destination: 'output.mp3'
            })
            .then(() => {console.log('audio uploaded successfully')})
            .catch((error) => {console.log(error)});
        });

        // Save Text to Firestore
        const pageName = filePath.split('/').pop();
        const date = new Date().getTime();
        const data = { text, pageName, date }
        docRef.add(data)
            .then(() => {
                gcs.bucket(fileBucket)
                    .file(pageName)
                    .delete()
                    .then(() => {
                        console.log(`gs://${fileBucket}/${pageName} deleted.`);
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
            }).catch((err) => {
                console.log(err);
            })

        return;
    });