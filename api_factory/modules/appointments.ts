import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const appointments_api = {
  getAdminAppointments: (query?: Record<string, any>) => {
    let url = '/appointments/admin?';
    if (query) {
      const params = new URLSearchParams();
      Object.keys(query).forEach((k) => {
        if (query[k] !== undefined && query[k] !== null && query[k] !== '') {
          params.append(k, String(query[k]));
        }
      });
      url += params.toString();
    }
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url);
  },

  getAdminAppointment: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/appointments/admin/${id}`);
  },

  updateStatus: (id: string, status: string, note?: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/appointments/admin/${id}/status`, { status, note });
  },

  verifyDirectTransfer: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/appointments/admin/${id}/verify-payment`);
  },

  reschedule: (id: string, payload: { scheduledDate: string; startTime: string; endTime: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/appointments/admin/${id}/reschedule`, payload);
  },

  getSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/appointments/settings');
  },

  getServiceSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/services');
  },

  updateServiceSettings: (payload: {
    serviceFeeType?: 'flat' | 'percentage' | 'both';
    serviceFee?: number;
    serviceFeePercentage?: number;
    commitmentFeePercentage?: number;
    vendorCommissionPercentage?: number;
    minServiceFee?: number;
    isEnabled?: boolean;
  }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/services', payload);
  },
};

