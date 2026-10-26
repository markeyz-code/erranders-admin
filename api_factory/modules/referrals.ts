import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const referrals_api = {
  // Stats with persona breakdown
  getStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/referrals/stats');
  },

  // Multi-persona referrers (Errand Ninjas, Customers, Vendors, Ambassadors)
  getAllReferrers: (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.role) query.set('role', params.role);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/all-referrers?${query.toString()}`);
  },

  // Full 360-degree referrer profile with linked promo codes and redemptions
  getReferrerProfile: (type: 'facilitator' | 'user', id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/referrer-profile/${type}/${id}`);
  },

  // Generate / update custom referral code
  generateCode: (data: { type: 'facilitator' | 'user'; id: string; customCode?: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/admin/referrals/generate-code', data);
  },

  // All individual referral events log
  getAllReferrals: (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals?${query.toString()}`);
  },

  // Leaderboard with optional role filter
  getLeaderboard: (limit = 20, role?: string) => {
    const query = new URLSearchParams();
    query.set('limit', limit.toString());
    if (role) query.set('role', role);
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/leaderboard?${query.toString()}`);
  },

  // Facilitators
  getFacilitators: (params?: { search?: string; active?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.active) query.set('active', params.active);
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/facilitators?${query.toString()}`);
  },

  createFacilitator: (data: { name: string; email?: string; phone?: string; matricNumber?: string; skill?: string; referralCode?: string; sendWelcomeEmail?: boolean }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/admin/referrals/facilitators', data);
  },

  createStaff: (data: { name: string; email?: string; phone?: string; department?: string; referralCode?: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/admin/referrals/staff', data);
  },

  getFacilitator: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/facilitators/${id}`);
  },

  updateFacilitator: (id: string, data: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/referrals/facilitators/${id}`, data);
  },

  deactivateFacilitator: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/admin/referrals/facilitators/${id}`);
  },

  getFacilitatorReferrals: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/facilitators/${id}/referrals`);
  },

  resendWelcomeEmail: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/admin/referrals/facilitators/${id}/resend-email`);
  },

  seedFacilitators: (facilitators: Array<{ name: string; email: string; matricNumber?: string; skill?: string }>) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/admin/referrals/facilitators/seed', { facilitators });
  },

  getUserReferrals: (userId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/user/${userId}`);
  },
};
