export interface Book {
    id?: string;
    title: string;
    ownerId: string;
    ownerName: string;
    dateCreated: any; // FieldValue; // import { FieldValue } from '@google-cloud/firestore';
    pages: number;
    author?: string;
    publicationYear?: number;
}