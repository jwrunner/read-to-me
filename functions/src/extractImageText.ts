import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Cloud Storage
import * as Storage from '@google-cloud/storage';
const gcs = new Storage();

import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';

// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient = new vision.ImageAnnotatorClient();

// Cloud Text to Speech
import * as textToSpeech from '@google-cloud/text-to-speech';
const client = new textToSpeech.TextToSpeechClient();



export const textExtraction = functions.storage
    .object()
    .onFinalize(async object => {
        if (!object.contentType.includes('image')) {
            console.log('exiting function');
            return false;
        }

        const fileBucket = object.bucket;
        const filePath = object.name;
        const pageName = filePath.split('/').pop();
        const bucketDir = dirname(filePath);

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

        // Creat temp directory
        const workingDir = join(tmpdir(), 'synthesized');
        const tmpFilePath = join(workingDir, 'output.mp3');

        // Ensure temp directory exists
        await fse.ensureDir(workingDir);

        // Performs the Text-to-Speech request
        console.log('about to start the speech synthesizer');
        client.synthesizeSpeech(request)
            .then(responses => {
                const response = responses[0];
                console.log('synthesizeSpeech response: ', response);
                console.log('synthesizeSpeech response.audioContent: ', response.audioContent);
                // Write the binary audio content to a local file in temp directory
                fs.writeFile(tmpFilePath, response.audioContent, 'binary', writeErr => {
                    if (writeErr) {
                        console.error('Write ERROR:', writeErr);
                        return;
                    }
                    console.log('Audio content written to: ', tmpFilePath);
                    // Upload audio to Firebase Storage
                    gcs.bucket(fileBucket).upload(tmpFilePath, {
                        destination: join(bucketDir, pageName)
                    })
                        .then(() => { console.log('audio uploaded successfully') })
                        .catch((error) => { console.log(error) });
                });
            })
            .catch(err => {
                console.error('Synthesize ERROR:', err);
            });

        // Save Text to Firestore
        const date = new Date().getTime();
        const data = { text, pageName, date }
        docRef.add(data)
            .then(() => {
                // Delete image
                gcs.bucket(fileBucket)
                    .file(pageName)
                    .delete()
                    .then(() => {
                        console.log(`gs://${fileBucket}/${pageName} deleted.`);
                    })
                    .catch(err => {
                        console.error('Delete image ERROR:', err);
                    });
            }).catch((err) => {
                console.log(err);
            })

        // Clean up temp directory
        return fse.remove(workingDir);
    });
