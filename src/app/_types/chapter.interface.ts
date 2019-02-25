export interface IChapter {
    id?: string;
    name: string; // Prologue, 1, 2, 3, Epilogue, etc...
    ownerId: string;
    ownerName: string;
    bookId: string;
    dateCreated: number;
    pages: number;
    // estimatedMinutes: number;
    listened?: boolean;
}
