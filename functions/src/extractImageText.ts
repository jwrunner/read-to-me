import * as functions from 'firebase-functions';

// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient =  new vision.ImageAnnotatorClient();

export const textExtraction = functions.storage
    .object()
    .onFinalize( async object => {
            const fileBucket = object.bucket;
            const filePath = object.name;   

            const imageUri = `gs://${fileBucket}/${filePath}`;

            const docId = filePath.split('.jpg')[0];

            // const docRef  = admin.firestore().collection('photos').doc(docId);

            // Text Extraction
            const textRequest = await visionClient.documentTextDetection(imageUri);
            const fullText = textRequest[0].textAnnotations[0];
            const text =  fullText ? fullText.description : null;

            console.log(text)
            // Save to Firestore
            // const data = { text, web, faces, landmarks }
            return;
            // return docRef.set(text);
});