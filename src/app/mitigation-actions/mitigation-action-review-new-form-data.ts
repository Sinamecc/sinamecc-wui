export interface MitigationActionReviewNewFormData {
    statuses: ReviewStatus[];
}


export interface ReviewStatus { 
    id: number;
    status: string;
}
