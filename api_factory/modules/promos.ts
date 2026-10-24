import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const promos_api = {
  getPromoCodes: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/promo-codes');
  },
  getReferralPromos: (params?: { referrerType?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.referrerType) query.set('referrerType', params.referrerType);
    if (params?.search) query.set('search', params.search);
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/promo-codes/referral-promos?${query.toString()}`);
  },
  getStatsOverview: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/promo-codes/stats/overview');
  },
  getAllRedemptions: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/promo-codes/all-redemptions?${query.toString()}`);
  },
  getPromoRedemptions: (id: string, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/promo-codes/${id}/redemptions?${query.toString()}`);
  },
  createPromoCode: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/promo-codes', payload);
  },
  togglePromoStatus: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/promo-codes/${id}/toggle`);
  },
  updatePromoCode: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/promo-codes/${id}`, payload);
  },
};
