import api from './api';
import { RedemptionOrder } from '../types/RedemptionOrder';

const RedemptionService = {
    getUserRedemptions: async (): Promise<RedemptionOrder[]> => {
        const response = await api.get('/redemptions');
        return response.data;
    },

    createRedemption: async (productId: string, redemption: Partial<RedemptionOrder>): Promise<RedemptionOrder> => {
        const response = await api.post(`/redemptions/${productId}`, redemption);
        return response.data;
    },
};

export default RedemptionService;
