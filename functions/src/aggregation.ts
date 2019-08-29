import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

const increment = admin.firestore.FieldValue.increment(1);
const decrement = admin.firestore.FieldValue.increment(-1);

export const increasePageCount = functions.firestore
    .document('books/{bookId}/chapters/{chapterId}/pages/{pageId}')
    .onCreate(async (snapshot, context) => {
        const bookId = context.params.bookId;
        const chapterId = context.params.chapterId;
        const bookRef = db.doc(`books/${bookId}`);
        const chapterRef = db.doc(`books/${bookId}/chapters/${chapterId}`);
        await bookRef.update({ pages: increment });
        await chapterRef.update({ pages: increment });
        return true;
    });

export const decreasePageCount = functions.firestore
    .document('books/{bookId}/chapters/{chapterId}/pages/{pageId}')
    .onDelete(async (snapshot, context) => {
        const bookId = context.params.bookId;
        const chapterId = context.params.chapterId;
        const bookRef = db.doc(`books/${bookId}`);
        const chapterRef = db.doc(`books/${bookId}/chapters/${chapterId}`);
        await bookRef.update({ pages: decrement });
        await chapterRef.update({ pages: decrement });
        return true;
    });