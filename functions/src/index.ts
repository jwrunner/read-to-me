import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Service account required for accessing public download URL
const serviceAccount = require('../credentials.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://read-books-to-me.firebaseio.com'
});

const db = admin.firestore();

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as fs from 'fs';
import * as fse from 'fs-extra';
// import * as UUID from 'uuidv4';
const UUID = require('uuidv4');

import * as Storage from '@google-cloud/storage';
const gcs = new Storage();

import * as vision from '@google-cloud/vision';
const visionClient = new vision.ImageAnnotatorClient();

import * as textToSpeech from '@google-cloud/text-to-speech';
const client = new textToSpeech.TextToSpeechClient();


const writeFilePromise = (file, data, option) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, option, error => {
            if (error) reject(error);
            resolve("File created! Time for the next step!");
        });
    });
};

async function increasePageCount(bookId: string, chapterId: string) {
    try {
        const book = await db.doc(`books/${bookId}`).get().then(doc => doc.data());
        const increasedBkPageCount = book.pages + 1;
        await db.doc(`books/${bookId}`).set({ pages: increasedBkPageCount }, { merge: true });

        const chapter = await db.doc(`books/${bookId}/chapters/${chapterId}`).get().then(doc => doc.data());
        const increasedChPageCount = chapter.pages + 1;
        await db.doc(`books/${bookId}/chapters/${chapterId}`).set({ pages: increasedChPageCount }, { merge: true });
    } catch (err) {
        throw (err);
    }
}


export const textExtraction = functions.storage
    .object()
    .onFinalize(async object => {
        if (!object.contentType.includes('image')) {
            console.log('Not image: exiting function');
            return false;
        }

        try {
            // Recognize FilePath
            const fileBucket = object.bucket;
            const filePath = object.name;
            const pageName = filePath.split('/').pop();
            const scansBucketDir = dirname(filePath);
            const audioBucketDir = scansBucketDir.replace('scans', 'audio');

            // Text Extraction
            const imageUri = `gs://${fileBucket}/${filePath}`;
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
            console.log('Text-to-speech request:', request);

            // Creat temp directory
            const workingDir = join(tmpdir(), 'synthesized');
            const tmpFilePath = join(workingDir, 'output.mp3');

            // Ensure temp directory exists
            await fse.ensureDir(workingDir);

            // Performs the Text-to-Speech request
            const audioName = `${pageName}.mp3`;
            let audioPath = 'notRetrieved';

            const responses = await client.synthesizeSpeech(request)
            const response = responses[0];
            await writeFilePromise(tmpFilePath, response.audioContent, 'binary');

            const uuid = UUID();

            await gcs.bucket(fileBucket).upload(tmpFilePath, {
                destination: join(audioBucketDir, audioName),
                metadata: {
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            });

            // Save Text to Firestore
            const bookId = pageName.match(/^BK(.+)_CH/)[1];
            const chapterId = pageName.match(/_CH(.+)_PG/)[1];
            const page = pageName.match(/_PG(.+)_/)[1];

            const date = new Date().getTime();
            const pageData = { text, bookId, chapterId, id: page, date, audioPath, mt: uuid }

            const docRef = db.doc(`books/${bookId}/chapters/${chapterId}/pages/${page}`);
            await docRef.set(pageData)

            await increasePageCount(bookId, chapterId);

            await gcs.bucket(fileBucket).file(`scans/${pageName}`).delete()

            // Clean up temp directory
            // return fse.remove(workingDir);
        } catch (err) {
            console.log(err);
        }
        return null;
    });

