export interface ITour {
    name: string;
    duration: number;
    slug?: string;
    maxGroupSize: number;
    difficulty: 'easy' | 'medium' | 'difficult';
    ratingsQuantity?: number;
    ratingsAverage?: number;
    price: number;
    priceDiscount?: number; 
    summary: string;
    description: string;
    imageCover: string;
    images?: string[];
    createdAt?: Date;
    startDates?: Date[];
    secretTour?: boolean;
 }