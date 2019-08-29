export interface IUser {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    // role?: 'reader' | 'editor' | 'admin';
    // stripeCustomerId?: string;
    subscriptions?: {
        [key: string]: 'active' | 'pastDue' | 'cancelled';
    };
}
