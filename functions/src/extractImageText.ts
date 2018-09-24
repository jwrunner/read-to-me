import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Cloud Vision
import * as vision from '@google-cloud/vision';
const visionClient =  new vision.ImageAnnotatorClient();

export const textExtraction = functions.storage
    .object()
    .onFinalize( async object => {
            const fileBucket = object.bucket;
            const filePath = object.name;   

            const imageUri = `gs://${fileBucket}/${filePath}`;

            const docRef  = admin.firestore().collection('pages');

            // Text Extraction
            const textRequest = await visionClient.documentTextDetection(imageUri);
            const fullText = textRequest[0].textAnnotations[0];
            const text =  fullText ? fullText.description : null;

            // Save to Firestore
            const data = { text, filePath }
            return docRef.add(data);
});