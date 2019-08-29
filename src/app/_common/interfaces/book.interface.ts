export interface IBook {
    id?: string;
    title: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: any;
    updatedAt?: any;
    pages: number;
    author?: string;
    publicationYear?: number;
    // estimatedMinutes: number;
    listened?: boolean;
}
