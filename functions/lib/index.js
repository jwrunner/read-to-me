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
const db = admin.firestore();
const os_1 = require("os");
const path_1 = require("path");
const fs = require("fs");
const fse = require("fs-extra");
// import * as UUID from 'uuidv4';
const UUID = require('uuidv4');
const Storage = require("@google-cloud/storage");
const gcs = new Storage();
const vision = require("@google-cloud/vision");
const visionClient = new vision.ImageAnnotatorClient();
const textToSpeech = require("@google-cloud/text-to-speech");
const client = new textToSpeech.TextToSpeechClient();
const writeFilePromise = (file, data, option) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, option, error => {
            if (error)
                reject(error);
            resolve("File created! Time for the next step!");
        });
    });
};
function increasePageCount(bookId, chapterId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const book = yield db.doc(`books/${bookId}`).get().then(doc => doc.data());
            const increasedBkPageCount = book.pages + 1;
            yield db.doc(`books/${bookId}`).set({ pages: increasedBkPageCount }, { merge: true });
            const chapter = yield db.doc(`books/${bookId}/chapters/${chapterId}`).get().then(doc => doc.data());
            const increasedChPageCount = chapter.pages + 1;
            yield db.doc(`books/${bookId}/chapters/${chapterId}`).set({ pages: increasedChPageCount }, { merge: true });
        }
        catch (err) {
            throw (err);
        }
    });
}
exports.textExtraction = functions.storage
    .object()
    .onFinalize((object) => __awaiter(this, void 0, void 0, function* () {
    if (!object.contentType.includes('image')) {
        console.log('Not image: exiting function');
        return false;
    }
    try {
        // Recognize FilePath
        const fileBucket = object.bucket;
        const filePath = object.name;
        const pageName = filePath.split('/').pop();
        const scansBucketDir = path_1.dirname(filePath);
        const audioBucketDir = scansBucketDir.replace('scans', 'audio');
        // Text Extraction
        const imageUri = `gs://${fileBucket}/${filePath}`;
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
        console.log('Text-to-speech request:', request);
        // Creat temp directory
        const workingDir = path_1.join(os_1.tmpdir(), 'synthesized');
        const tmpFilePath = path_1.join(workingDir, 'output.mp3');
        // Ensure temp directory exists
        yield fse.ensureDir(workingDir);
        // Performs the Text-to-Speech request
        const audioName = `${pageName}.mp3`;
        const responses = yield client.synthesizeSpeech(request);
        const response = responses[0];
        yield writeFilePromise(tmpFilePath, response.audioContent, 'binary');
        const uuid = UUID();
        yield gcs.bucket(fileBucket).upload(tmpFilePath, {
            destination: path_1.join(audioBucketDir, audioName),
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
        const audioPath = `audio/${audioName}`;
        const date = new Date().getTime(); // TODO: Use Moment.js or Firebase
        const pageData = { text, bookId, chapterId, id: page, date, audioPath, mt: uuid };
        const docRef = db.doc(`books/${bookId}/chapters/${chapterId}/pages/${page}`);
        yield docRef.set(pageData);
        yield increasePageCount(bookId, chapterId);
        yield gcs.bucket(fileBucket).file(`scans/${pageName}`).delete();
        // Clean up temp directory
        // return fse.remove(workingDir);
    }
    catch (err) {
        console.log(err);
    }
    return null;
}));
//# sourceMappingURL=index.js.map