// learned from AngularFirebase - Image Resize Cloud Function, https://youtu.be/OKW8x8-qYs0

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// could also use admin.storage();
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage();

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as fs from 'fs-extra';

// @ts-ignore
import * as vision from '@google-cloud/vision';
const visionClient = new vision.ImageAnnotatorClient();

// @ts-ignore
import * as textToSpeech from '@google-cloud/text-to-speech';
const client = new textToSpeech.TextToSpeechClient();

const writeFilePromise = (file: any, data: any, option: any) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, option, error => {
            if (error) reject(error);
            resolve("File created! Time for the next step!");
        });
    });
};

export const textExtraction = functions.storage
    .object()
    .onFinalize(async object => {
        if (!object.contentType.includes('image')) {
            console.log('Not image: exiting function');
            return false;
        }
        
        try {
            // Recognize FilePath
            const fileBucket = object.bucket; // example: read-books-to-me.appspot.com
            const filePath = object.name; // example: scans/introduction-to-global-mi/3/2_1567110326912
            const pageName = filePath.split('/').pop(); // example: 2_1567110326912
            const scansBucketDir = dirname(filePath);
            const audioBucketDir = scansBucketDir.replace('scans', 'audio');

            // Text Extraction
            const imageUri = `gs://${fileBucket}/${filePath}`;
            const textRequest = await visionClient.documentTextDetection(imageUri);
            const fullText = textRequest[0].textAnnotations[0];
            const text = fullText ? fullText.description : null;
            const deHyphenatedText = text.replace(/-\n/gm, '')

            // Construct the text-to-speech request
            const request = {
                input: { text: deHyphenatedText },
                // Select the language and SSML Voice Gender (optional)
                voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
                // Select the type of audio encoding
                audioConfig: { audioEncoding: 'MP3' },
            };
            console.log('Text-to-speech request:', request);

            // Creat temp directory
            const workingDir = join(tmpdir(), 'synthesized');
            const tmpFilePath = join(workingDir, 'output.mp3');

            // Ensure temp directory exists
            await fs.ensureDir(workingDir);

            // Performs the Text-to-Speech request
            const audioName = `${pageName}.mp3`;

            const responses = await client.synthesizeSpeech(request)
            const response = responses[0];
            await writeFilePromise(tmpFilePath, response.audioContent, 'binary');

            await gcs.bucket(fileBucket).upload(tmpFilePath, {
                destination: join(audioBucketDir, audioName)
            });

            // Save Text to Firestore
            // pageName will look like 'intro-to-global/3/4_1232324'
            const bookId = filePath.match(/scans\/([^\/]+)/)[1]; // capture anything before the first slash
            const chapterId = filePath.match(/.+\/([^\/]+)\//)[1]; // capture anything after first slash before second slash
            const pageNumber = +pageName.match(/^([^_]+)/)[1]; // capture anything after two slashes but not an underscore or after an underscore
            const audioPath = `audio/${bookId}/${chapterId}/${audioName}`;
            const dateCreated = Date.now();
            const pageData = { text, pageNumber, dateCreated, audioPath }

            const docRef = db.doc(`books/${bookId}/chapters/${chapterId}/pages/${pageNumber}`);
            await docRef.set(pageData);

            await gcs.bucket(fileBucket).file(`scans/${pageName}`).delete()

            // Clean up temp directory
            // return fs.remove(workingDir); // throws an error
        } catch (err) {
            console.log(err);
        }
        return null;
    });

