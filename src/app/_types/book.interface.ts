export interface IBook {
    id?: string;
    title: string;
    ownerId: string;
    ownerName: string;
    dateCreated: number;
    pages: number;
    author?: string;
    publicationYear?: number;
    // estimatedMinutes: number;
    listened?: boolean;
}
