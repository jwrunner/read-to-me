export interface IChapter {
    id?: string;
    name: string; // Prologue, 1, 2, 3, Epilogue, etc...
    createdBy?: string;
    updatedBy?: string;
    createdAt?: any;
    updatedAt?: any;
    pages: number;
    // estimatedMinutes: number;
    listened?: boolean;
}
