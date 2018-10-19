"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Service account required for accessing public download URL
const serviceAccount = require('../credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://read-books-to-me.firebaseio.com'
});
// Cloud Storage
const Storage = require("@google-cloud/storage");
const gcs = new Storage();
const os_1 = require("os");
const path_1 = require("path");
const fs = require("fs");
const fse = require("fs-extra");
// Cloud Vision
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();
// Cloud Text to Speech
const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();
exports.textExtraction = functions.storage
    .object()
    .onFinalize((object) => __awaiter(this, void 0, void 0, function* () {
    if (!object.contentType.includes('image')) {
        console.log('exiting function');
        return false;
    }
    const fileBucket = object.bucket;
    const filePath = object.name;
    const pageName = filePath.split('/').pop();
    const bucketDir = path_1.dirname(filePath);
    const imageUri = `gs://${fileBucket}/${filePath}`;
    const docRef = admin.firestore().collection('pages');
    // Text Extraction
    const textRequest = yield visionClient.documentTextDetection(imageUri);
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
    const workingDir = path_1.join(os_1.tmpdir(), 'synthesized');
    const tmpFilePath = path_1.join(workingDir, 'output.mp3');
    // Ensure temp directory exists
    yield fse.ensureDir(workingDir);
    // Turn fs.writeFile into a Promise
    const writeFilePromise = (file, data, option) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, data, option, error => {
                if (error)
                    reject(error);
                resolve("File created! Time for the next step!");
            });
        });
    };
    // Performs the Text-to-Speech request
    const audioName = `${pageName}.mp3`;
    let audioPath = 'notRetrieved';
    console.log('about to start the speech synthesizer');
    yield client.synthesizeSpeech(request)
        .then(responses => {
        const response = responses[0];
        console.log('audio response: ', response.audioContent);
        return writeFilePromise(tmpFilePath, response.audioContent, 'binary');
    })
        .then(() => {
        return gcs.bucket(fileBucket).upload(tmpFilePath, {
            destination: path_1.join(bucketDir, audioName)
        });
    })
        .then(() => {
        console.log('audio uploaded successfully');
        const updloadedAudioFile = gcs.bucket(fileBucket).file(audioName);
        return updloadedAudioFile.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
        }).then(signedUrls => {
            audioPath = signedUrls[0];
            console.log('audioPath is: ', signedUrls[0]);
        });
    })
        .catch(error => {
        console.error('Synthesize speech + write + upload error:', error);
    });
    console.log('about to save data to Firestore');
    // Save Text to Firestore
    const date = new Date().getTime();
    const pageData = { text, pageName, date, audioPath };
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
    });
    // Clean up temp directory
    // return fse.remove(workingDir);
    return null;
}));
//# sourceMappingURL=index.js.map