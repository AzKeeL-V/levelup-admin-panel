import api from './api';
import { Review } from '../types/Review';

const ReviewService = {
    getProductReviews: async (productId: string): Promise<Review[]> => {
        const response = await api.get(`/reviews/product/${productId}`);
        return response.data;
    },

    createReview: async (productId: string, review: Partial<Review>): Promise<Review> => {
        const response = await api.post(`/reviews/product/${productId}`, review);
        return response.data;
    },
};

export default ReviewService;
