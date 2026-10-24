import { ref } from 'vue'
import { promos_api } from '@/api_factory/modules/promos'
import { admin_api } from '@/api_factory/modules/admin'
import { referrals_api } from '@/api_factory/modules/referrals'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const usePromos = () => {
  const promos = ref<any[]>([])
  const referralPromos = ref<any[]>([])
  const statsOverview = ref<any>(null)
  const loading = ref(false)
  const isSubmitting = ref(false)
  const users = ref<any[]>([])
  const vendors = ref<any[]>([])
  const facilitators = ref<any[]>([])
  const { showToast } = useCustomToast()

  const fetchDependencies = async () => {
    try {
      const [usersRes, vendorsRes, facRes] = await Promise.all([
        admin_api.getUsers(),
        admin_api.getVendors(),
        referrals_api.getFacilitators({ active: 'true' }),
      ])
      users.value = usersRes.data?.users || usersRes.data || []
      vendors.value = vendorsRes.data?.vendors || vendorsRes.data || []
      facilitators.value = facRes.data || []
    } catch (e: any) {
      console.error('Failed to load dependencies for promos', e)
    }
  }

  const fetchPromos = async () => {
    loading.value = true
    try {
      const res = await promos_api.getPromoCodes()
      promos.value = res.data || []
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch promo codes',
        toastType: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  const fetchReferralPromos = async (referrerType?: string, search?: string) => {
    loading.value = true
    try {
      const res = await promos_api.getReferralPromos({ referrerType, search })
      referralPromos.value = res.data || []
    } catch (error: any) {
      console.error('Failed to fetch referral promos', error)
    } finally {
      loading.value = false
    }
  }

  const fetchStatsOverview = async () => {
    try {
      const res = await promos_api.getStatsOverview()
      statsOverview.value = res.data || null
    } catch (error: any) {
      console.error('Failed to fetch promo stats overview', error)
    }
  }

  const createPromo = async (payload: any) => {
    isSubmitting.value = true
    try {
      await promos_api.createPromoCode(payload)
      showToast({
        title: 'Success',
        message: 'Promo code created successfully',
        toastType: 'success'
      })
      return true
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create promo code',
        toastType: 'error'
      })
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const toggleStatus = async (promo: any) => {
    try {
      const res = await promos_api.togglePromoStatus(promo._id)
      promo.isActive = res.data.isActive
      showToast({
        title: 'Success',
        message: `Promo code ${promo.isActive ? 'activated' : 'deactivated'}`,
        toastType: 'success'
      })
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: 'Failed to toggle status',
        toastType: 'error'
      })
    }
  }

  const updatePromo = async (id: string, payload: any) => {
    isSubmitting.value = true
    try {
      await promos_api.updatePromoCode(id, payload)
      showToast({
        title: 'Success',
        message: 'Promo code updated successfully',
        toastType: 'success'
      })
      return true
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update promo code',
        toastType: 'error'
      })
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    promos,
    referralPromos,
    statsOverview,
    users,
    vendors,
    facilitators,
    loading,
    isSubmitting,
    fetchPromos,
    fetchReferralPromos,
    fetchStatsOverview,
    fetchDependencies,
    createPromo,
    updatePromo,
    toggleStatus
  }
}
