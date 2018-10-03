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
        console.log('finished constructing the text-so-speech request:', request);

        // Creat temp directory
        const workingDir = join(tmpdir(), 'synthesized');
        const tmpFilePath = join(workingDir, 'output.mp3');

        // Ensure temp directory exists
        await fse.ensureDir(workingDir);

        // Turn fs.writeFile into a Promise
        const writeFilePromise = (file, data, option) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(file, data, option, error => {
                    if (error) reject(error);
                    resolve("File created! Time for the next step!");
                });
            });
        };

        // Performs the Text-to-Speech request
        console.log('about to start the speech synthesizer');
        client.synthesizeSpeech(request)
            .then(responses => {
                const response = responses[0];
                console.log('audio response: ', response.audioContent);
                return writeFilePromise(tmpFilePath, response.audioContent, 'binary');
            })
            .then(() => {
                return gcs.bucket(fileBucket).upload(tmpFilePath, {
                    destination: join(bucketDir, pageName)
                });
            })
            .then(() => {
                console.log('audio uploaded successfully');
                return null;
            })
            .catch(error => {
                console.error('Synthesize speech + write + upload error:', error);
            });

        // Save Text to Firestore
        const date = new Date().getTime();
        const pageData = { text, pageName, date }
        docRef.add(pageData)
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
        // return fse.remove(workingDir);
        return null;
    });
