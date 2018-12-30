export interface Chapter {
    id: string; // Prologue, 1, 2, 3, Epilogue, etc...
    title?: string;
    ownerId: string;
    ownerName: string;
    dateCreated: any; // FieldValue; // import { FieldValue } from '@google-cloud/firestore';
    pages: number;
    // estimatedMinutes: number;
}
