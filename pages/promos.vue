<template>
  <div class="space-y-6">
    <!-- Top Action Bar & Search -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="relative w-full sm:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-gray-400" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-colors sm:text-sm" 
          placeholder="Search promo codes, owners..."
        >
      </div>
      
      <div class="flex items-center gap-2">
        <NuxtLink to="/referrals" class="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold transition-colors">
          <Sparkles class="w-4 h-4 text-[#FF5C1A]" />
          Referrals Hub
        </NuxtLink>

        <button 
          @click="openModal()" 
          class="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus class="w-4 h-4" />
          Create Promo Code
        </button>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Active Codes</p>
        <p class="text-xl font-black text-gray-900 mt-0.5">{{ promos.filter(p => p.isActive).length }} / {{ promos.length }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Redemptions</p>
        <p class="text-xl font-black text-gray-900 mt-0.5">{{ totalRedemptionsCount.toLocaleString() }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Revenue Driven</p>
        <p class="text-xl font-black text-gray-900 mt-0.5">₦{{ totalRevenueGenerated.toLocaleString() }}</p>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Discounts Given</p>
        <p class="text-xl font-black text-amber-600 mt-0.5">₦{{ totalDiscountGiven.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Promo Codes Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
      <div class="max-md:overflow-x-auto md:overflow-visible pb-24 md:pb-0">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/60">
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Code</th>
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Affiliate / Owner</th>
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Discount</th>
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Redemptions</th>
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Revenue</th>
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-16"></div></td>
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-20"></div></td>
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-20"></div></td>
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-12"></div></td>
              <td class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
            </tr>
            <tr v-else-if="filteredPromos.length === 0">
              <td colspan="7" class="px-5 py-14 text-center">
                <div class="flex flex-col items-center justify-center text-gray-400">
                  <Tag class="w-10 h-10 mb-2 opacity-25" />
                  <p class="text-sm font-bold text-gray-900">No promo codes found</p>
                  <p class="text-xs">Create a new promo code or referral code to get started.</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="promo in filteredPromos" :key="promo._id" class="hover:bg-gray-50/50 transition-colors">
              <!-- Code -->
              <td class="px-5 py-4">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900 font-mono tracking-tight">{{ promo.code }}</span>
                  <span v-if="promo.onlyForNewUsers" class="text-[9px] font-bold text-amber-600">New Users Only</span>
                </div>
              </td>

              <!-- Affiliate / Owner -->
              <td class="px-5 py-4">
                <div v-if="promo.isReferralPromo || (promo.referrerType && promo.referrerType !== 'none')" class="flex items-center gap-1.5">
                  <span class="text-sm">{{ getOwnerEmoji(promo.referrerType) }}</span>
                  <div>
                    <p class="text-xs font-bold text-gray-900">{{ getOwnerName(promo) }}</p>
                    <span class="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase"
                      :class="getOwnerBadgeClass(promo.referrerType)">
                      {{ getOwnerRoleLabel(promo.referrerType) }}
                    </span>
                  </div>
                </div>
                <div v-else>
                  <span class="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                    Platform / General
                  </span>
                </div>
              </td>

              <!-- Discount -->
              <td class="px-5 py-4">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900">
                    {{ promo.discountType === 'percentage' ? promo.value + '%' : '₦' + (promo.value || 0).toLocaleString() }}
                  </span>
                  <span v-if="promo.maxDiscountAmount" class="text-[9px] text-gray-400">Up to ₦{{ promo.maxDiscountAmount.toLocaleString() }}</span>
                </div>
              </td>

              <!-- Usage -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-12 bg-gray-100 rounded-full h-1.5">
                    <div class="bg-[#FF5C1A] h-1.5 rounded-full" :style="{ width: getUsagePercentage(promo) + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold text-gray-700">
                    {{ promo.usageCount }}{{ promo.maxUsageCount ? '/' + promo.maxUsageCount : '' }}
                  </span>
                </div>
              </td>

              <!-- Revenue -->
              <td class="px-5 py-4">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900 tabular-nums">₦{{ (promo.totalRevenueGenerated || 0).toLocaleString() }}</span>
                  <span v-if="promo.rewardPerUse" class="text-[9px] text-emerald-600 font-bold">
                    Reward: +{{ promo.rewardPerUse }} {{ promo.rewardType === 'wallet_credit' ? '₦' : 'pts' }}
                  </span>
                </div>
              </td>

              <!-- Status Toggle -->
              <td class="px-5 py-4">
                <button 
                  @click="toggleStatus(promo)"
                  class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 focus:outline-none"
                  :class="promo.isActive ? 'bg-emerald-500' : 'bg-gray-200'"
                >
                  <span 
                    class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"
                    :class="promo.isActive ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </td>

              <!-- Actions -->
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button @click="openRedemptionsDrawer(promo)" 
                    class="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Audit orders placed with this code">
                    <BarChart3 class="w-4 h-4" />
                  </button>
                  <button @click="editPromo(promo)" class="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button @click="copyCode(promo.code)" class="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Promo Drawer -->
    <UiSideDrawer :is-open="isModalOpen" @close="closeModal" size="default">
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-bold text-gray-900">{{ isEditing ? 'Edit Promo Code' : 'Create Promo Code' }}</h2>
          <p class="text-xs text-gray-500">Configure discounts, beneficiary referral affiliation, and usage limits.</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Code -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Promo Code *</label>
            <input v-model="form.code" type="text" required placeholder="e.g. SUMMER50" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono uppercase focus:outline-none focus:border-[#FF5C1A]">
          </div>

          <!-- Affiliate Referrer Assignment (Optional) -->
          <div class="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-gray-800 uppercase flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-[#FF5C1A]" />
                Affiliate Referrer Linkage (Optional)
              </label>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Persona Type</label>
                <select v-model="form.referrerType" class="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-xs font-bold focus:outline-none">
                  <option value="none">Platform (None)</option>
                  <option value="errander">🚲 Errand Ninja</option>
                  <option value="student">🎓 Customer</option>
                  <option value="vendor">🏪 Vendor</option>
                  <option value="facilitator">💎 Ambassador</option>
                </select>
              </div>

              <div v-if="form.referrerType !== 'none'">
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Person</label>
                <select v-model="form.selectedReferrerId" class="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-xs font-medium focus:outline-none truncate">
                  <option value="">-- Choose Person --</option>
                  <option v-for="opt in affiliateSelectOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Reward per Order if Affiliate -->
            <div v-if="form.referrerType !== 'none'" class="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/70">
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reward Type</label>
                <select v-model="form.rewardType" class="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-xs font-bold focus:outline-none">
                  <option value="points">Points</option>
                  <option value="wallet_credit">Wallet Credit (₦)</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reward Value</label>
                <input v-model.number="form.rewardPerUse" type="number" min="0" placeholder="e.g. 50" class="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-2 text-xs font-bold focus:outline-none">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <!-- Type -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Type *</label>
              <select v-model="form.discountType" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#FF5C1A]">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₦)</option>
              </select>
            </div>
            
            <!-- Value -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Value *</label>
              <input v-model.number="form.value" type="number" required min="1" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#FF5C1A]">
            </div>
          </div>

          <!-- Max Discount (Percentage Only) -->
          <div v-if="form.discountType === 'percentage'">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Max Discount Cap (₦)</label>
            <input v-model.number="form.maxDiscountAmount" type="number" min="0" placeholder="e.g. 1000 (0 for no limit)" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#FF5C1A]">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Min Order Amount (₦)</label>
              <input v-model.number="form.minOrderAmount" type="number" min="0" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#FF5C1A]">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Max Global Usage</label>
              <input v-model.number="form.maxUsageCount" type="number" min="0" placeholder="e.g. 100" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#FF5C1A]">
            </div>
          </div>

          <!-- Expiry -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Expiry Date</label>
            <input v-model="form.expiresAt" type="datetime-local" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#FF5C1A]">
          </div>

          <div class="border-t border-gray-100 pt-3 space-y-3">
            <h3 class="text-xs font-bold text-gray-900 uppercase">Restrictions</h3>
            
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.onlyForNewUsers" class="w-4 h-4 text-[#FF5C1A] rounded border-gray-300">
                <span class="text-xs text-gray-700 font-medium">Only for New Users (1st completed order)</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.appliesToDeliveryFeeOnly" class="w-4 h-4 text-[#FF5C1A] rounded border-gray-300">
                <span class="text-xs text-gray-700 font-medium">Apply Discount to Delivery Fee Only</span>
              </label>
            </div>
          </div>

          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 shadow-md"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Promo Code') }}</span>
            </button>
          </div>
        </form>
      </div>
    </UiSideDrawer>

    <!-- SideDrawer: Promo Redemptions Audit -->
    <UiSideDrawer :is-open="isRedemptionsOpen" @close="isRedemptionsOpen = false" size="default">
      <div v-if="selectedPromoForRedemptions" class="space-y-5">
        <div class="border-b border-gray-100 pb-4">
          <div class="flex items-center gap-2">
            <span class="font-mono text-base font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-xl">
              {{ selectedPromoForRedemptions.code }}
            </span>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {{ selectedPromoForRedemptions.discountType === 'percentage' ? `${selectedPromoForRedemptions.value}% OFF` : `₦${selectedPromoForRedemptions.value} OFF` }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Audit trail of all orders placed with this code.</p>
        </div>

        <div v-if="redemptionsLoading" class="py-12 text-center">
          <Loader2 class="w-6 h-6 animate-spin text-[#FF5C1A] mx-auto mb-2" />
          <p class="text-xs text-gray-500">Loading redemption logs...</p>
        </div>

        <div v-else-if="redemptionsList.length === 0" class="py-12 text-center text-gray-400">
          <ShoppingBag class="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p class="text-xs font-bold text-gray-900">No Orders Yet</p>
          <p class="text-[11px] text-gray-500">Orders placed with this promo code will appear here.</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="item in redemptionsList" :key="item._id"
            class="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-bold text-gray-900">
                {{ item.customer?.firstName }} {{ item.customer?.lastName }}
              </span>
              <span class="text-xs font-black text-gray-900 tabular-nums">
                ₦{{ (item.orderTotal || 0).toLocaleString() }}
              </span>
            </div>
            <div class="flex items-center justify-between text-[10px] text-gray-500">
              <span>{{ item.customer?.email }}</span>
              <span class="text-emerald-600 font-bold">-₦{{ (item.discountAmount || 0).toLocaleString() }} off</span>
            </div>
            <div class="flex items-center justify-between text-[9px] text-gray-400 mt-2 pt-2 border-t border-gray-200">
              <span>{{ formatDate(item.createdAt) }}</span>
              <span class="font-bold text-amber-600">+{{ item.rewardAwarded }} {{ item.rewardType }}</span>
            </div>
          </div>
        </div>
      </div>
    </UiSideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, Tag, Loader2, Copy, Edit, Sparkles, BarChart3, ShoppingBag } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { usePromos } from '@/composables/modules/promos/usePromos'
import { promos_api } from '@/api_factory/modules/promos'
import UiSideDrawer from '@/components/ui/SideDrawer.vue'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Promo Codes & Affiliates - Errander Admin' })

const { showToast } = useCustomToast()
const { promos, users, vendors, facilitators, loading, isSubmitting, fetchPromos, fetchDependencies, createPromo, updatePromo, toggleStatus: _toggleStatus } = usePromos()

const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingPromoId = ref('')

// Redemptions Drawer
const isRedemptionsOpen = ref(false)
const redemptionsLoading = ref(false)
const selectedPromoForRedemptions = ref<any>(null)
const redemptionsList = ref<any[]>([])

const form = ref({
  code: '',
  discountType: 'percentage',
  value: 10,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  maxUsageCount: 0,
  expiresAt: '',
  onlyForNewUsers: false,
  appliesToDeliveryFeeOnly: false,
  referrerType: 'none',
  selectedReferrerId: '',
  rewardType: 'points',
  rewardPerUse: 50,
})

const totalRedemptionsCount = computed(() => {
  return promos.value.reduce((acc, p) => acc + (p.usageCount || 0), 0)
})

const totalRevenueGenerated = computed(() => {
  return promos.value.reduce((acc, p) => acc + (p.totalRevenueGenerated || 0), 0)
})

const totalDiscountGiven = computed(() => {
  return promos.value.reduce((acc, p) => acc + (p.totalDiscountGiven || 0), 0)
})

const affiliateSelectOptions = computed(() => {
  if (form.value.referrerType === 'facilitator') {
    return facilitators.value.map(f => ({
      label: `${f.name} (${f.email})`,
      value: f._id,
    }))
  }
  if (form.value.referrerType === 'vendor') {
    return vendors.value.map(v => ({
      label: v.storeName || v.businessName || v.name || v.email,
      value: v.userId || v._id,
    }))
  }
  const filteredUsers = users.value.filter(u => u.role === form.value.referrerType)
  return filteredUsers.map(u => ({
    label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    value: u._id,
  }))
})

const filteredPromos = computed(() => {
  if (!searchQuery.value) return promos.value
  const query = searchQuery.value.toLowerCase()
  return promos.value.filter(p => {
    const codeMatch = p.code.toLowerCase().includes(query)
    const ownerMatch = getOwnerName(p).toLowerCase().includes(query)
    return codeMatch || ownerMatch
  })
})

const getUsagePercentage = (promo: any) => {
  if (!promo.maxUsageCount) return 0
  return Math.min(100, Math.round((promo.usageCount / promo.maxUsageCount) * 100))
}

const getOwnerName = (promo: any) => {
  if (promo.referrerFacilitator) return promo.referrerFacilitator.name
  if (promo.referrerUser) {
    return `${promo.referrerUser.firstName || ''} ${promo.referrerUser.lastName || ''}`.trim() || promo.referrerUser.email
  }
  return 'Platform / General'
}

const getOwnerEmoji = (role?: string) => {
  switch (role) {
    case 'errander': return '🚲'
    case 'student': return '🎓'
    case 'vendor': return '🏪'
    case 'facilitator': return '💎'
    default: return '🎟️'
  }
}

const getOwnerRoleLabel = (role?: string) => {
  switch (role) {
    case 'errander': return 'Errand Ninja'
    case 'student': return 'Customer'
    case 'vendor': return 'Vendor'
    case 'facilitator': return 'Ambassador'
    default: return 'Platform'
  }
}

const getOwnerBadgeClass = (role?: string) => {
  switch (role) {
    case 'errander': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'student': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'vendor': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'facilitator': return 'bg-purple-50 text-purple-700 border-purple-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const openModal = () => {
  isEditing.value = false
  editingPromoId.value = ''
  form.value = {
    code: '',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    maxUsageCount: 0,
    expiresAt: '',
    onlyForNewUsers: false,
    appliesToDeliveryFeeOnly: false,
    referrerType: 'none',
    selectedReferrerId: '',
    rewardType: 'points',
    rewardPerUse: 50,
  }
  isModalOpen.value = true
}

const editPromo = (promo: any) => {
  isEditing.value = true
  editingPromoId.value = promo._id

  let refType = promo.referrerType || 'none'
  let refId = ''
  if (promo.referrerFacilitator) {
    refType = 'facilitator'
    refId = typeof promo.referrerFacilitator === 'object' ? promo.referrerFacilitator._id : promo.referrerFacilitator
  } else if (promo.referrerUser) {
    refId = typeof promo.referrerUser === 'object' ? promo.referrerUser._id : promo.referrerUser
  }

  form.value = {
    code: promo.code || '',
    discountType: promo.discountType || 'percentage',
    value: promo.value || 0,
    minOrderAmount: promo.minOrderAmount || 0,
    maxDiscountAmount: promo.maxDiscountAmount || 0,
    maxUsageCount: promo.maxUsageCount || 0,
    expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : '',
    onlyForNewUsers: promo.onlyForNewUsers || false,
    appliesToDeliveryFeeOnly: promo.appliesToDeliveryFeeOnly || false,
    referrerType: refType,
    selectedReferrerId: refId,
    rewardType: promo.rewardType || 'points',
    rewardPerUse: promo.rewardPerUse || 50,
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
  showToast({ title: 'Copied', message: 'Promo code copied to clipboard', toastType: 'success' })
}

const toggleStatus = async (promo: any) => {
  await _toggleStatus(promo)
}

const openRedemptionsDrawer = async (promo: any) => {
  selectedPromoForRedemptions.value = promo
  isRedemptionsOpen.value = true
  redemptionsLoading.value = true
  try {
    const res = await promos_api.getPromoRedemptions(promo._id)
    redemptionsList.value = res.data?.redemptions || []
  } catch (e) {
    console.error('Failed to load redemptions', e)
    redemptionsList.value = []
  } finally {
    redemptionsLoading.value = false
  }
}

const submitForm = async () => {
  const payload: any = {
    code: form.value.code.trim().toUpperCase(),
    discountType: form.value.discountType,
    value: Number(form.value.value),
    appliesToDeliveryFeeOnly: form.value.appliesToDeliveryFeeOnly,
    onlyForNewUsers: form.value.onlyForNewUsers,
    maxDiscountAmount: form.value.maxDiscountAmount || null,
    minOrderAmount: form.value.minOrderAmount || null,
    maxUsageCount: form.value.maxUsageCount || null,
    expiresAt: form.value.expiresAt ? new Date(form.value.expiresAt) : null,
    referrerType: form.value.referrerType,
    isReferralPromo: form.value.referrerType !== 'none',
    rewardType: form.value.rewardType,
    rewardPerUse: Number(form.value.rewardPerUse) || 0,
  }

  if (form.value.referrerType === 'facilitator' && form.value.selectedReferrerId) {
    payload.referrerFacilitator = form.value.selectedReferrerId
  } else if (form.value.referrerType !== 'none' && form.value.selectedReferrerId) {
    payload.referrerUser = form.value.selectedReferrerId
  }
  
  let success = false
  if (isEditing.value) {
    success = await updatePromo(editingPromoId.value, payload)
  } else {
    success = await createPromo(payload)
  }

  if (success) {
    closeModal()
    fetchPromos()
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchPromos()
  fetchDependencies()
})
</script>
