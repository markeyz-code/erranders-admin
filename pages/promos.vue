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
    <UiSideDrawer :is-open="isModalOpen" @close="closeModal" size="lg" :title="isEditing ? 'Edit Promo Code' : 'Create Promo Code'">
      <div class="space-y-6 pt-1">
        <div class="rounded-xl bg-orange-50/60 border border-orange-100 p-3.5 flex items-start gap-3">
          <Sparkles class="w-5 h-5 text-[#FF5C1A] shrink-0 mt-0.5" />
          <div class="text-xs text-gray-700 leading-relaxed">
            <span class="font-bold text-gray-900">Voucher & Campaign Setup:</span>
            Configure custom discount vouchers for marketing campaigns, seasonal sales, or affiliate partner tracking. All fields are clearly labeled with robust targeting options.
          </div>
        </div>

        <form @submit.prevent="submitForm" class="space-y-5">
          <!-- ── Section 1: Promo Code Voucher Identity ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag class="w-3.5 h-3.5 text-[#FF5C1A]" />
                1. Promo Code Identity
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Required</span>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Promo Voucher Code String *</label>
              <input 
                v-model="form.code" 
                type="text" 
                required 
                placeholder="e.g. SUMMER50 or WELCOME20" 
                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono font-black uppercase text-gray-900 tracking-wider focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
              />
              <p class="text-[10px] text-gray-400 mt-1">The voucher code customers will type during checkout.</p>
            </div>
          </div>

          <!-- ── Section 2: Affiliate & Referrer Linkage (Optional) ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-[#FF5C1A]" />
                2. Affiliate & Referrer Linkage (Optional)
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Tracking</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Affiliate Persona Type</label>
                <SearchableSelect
                  v-model="form.referrerType"
                  :options="personaOptions"
                  :show-all-option="false"
                  placeholder="Select affiliate persona..."
                  search-placeholder="Search persona..."
                />
              </div>

              <div v-if="form.referrerType !== 'none'">
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Select Beneficiary Person / Store</label>
                <SearchableSelect
                  v-model="form.selectedReferrerId"
                  :options="affiliateSelectOptions"
                  :show-all-option="false"
                  placeholder="Choose affiliate person..."
                  search-placeholder="Search person or store..."
                />
              </div>
            </div>

            <!-- Reward if affiliate -->
            <div v-if="form.referrerType !== 'none'" class="p-3 bg-orange-50/50 rounded-xl border border-orange-100/80 space-y-2.5">
              <span class="text-xs font-bold text-[#FF5C1A] block">Referrer Commission per Completed Order</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reward Currency</label>
                  <SearchableSelect
                    v-model="form.rewardType"
                    :options="rewardTypeOptions"
                    :show-all-option="false"
                    placeholder="Select currency..."
                    search-placeholder="Search currency..."
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reward Amount</label>
                  <input 
                    v-model.number="form.rewardPerUse" 
                    type="number" 
                    min="0" 
                    placeholder="e.g. 50" 
                    class="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5C1A]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ── Section 3: Customer Discount Terms ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag class="w-3.5 h-3.5 text-[#FF5C1A]" />
                3. Customer Discount Terms
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Discount</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Discount Calculation Method *</label>
                <SearchableSelect
                  v-model="form.discountType"
                  :options="discountTypeOptions"
                  :show-all-option="false"
                  placeholder="Select discount method..."
                  search-placeholder="Search method..."
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  Discount Value ({{ form.discountType === 'percentage' ? '%' : '₦' }}) *
                </label>
                <input 
                  v-model.number="form.value" 
                  type="number" 
                  required 
                  min="1" 
                  :placeholder="form.discountType === 'percentage' ? 'e.g. 15 (for 15% off)' : 'e.g. 1000 (for ₦1,000 off)'"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Minimum Order Subtotal (₦)</label>
                <input 
                  v-model.number="form.minOrderAmount" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 2000 (0 for no minimum)"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
                />
                <span class="text-[10px] text-gray-400 mt-1 block">Order must reach this amount before voucher applies.</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Maximum Discount Cap (₦)</label>
                <input 
                  v-model.number="form.maxDiscountAmount" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 1500 (0 for no cap)"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
                />
                <span class="text-[10px] text-gray-400 mt-1 block">Caps percentage discounts to prevent excessive deductions.</span>
              </div>
            </div>
          </div>

          <!-- ── Section 4: Redemption Limits & Schedule ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp class="w-3.5 h-3.5 text-[#FF5C1A]" />
                4. Redemption Limits & Schedule
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Limits</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Global Redemption Limit</label>
                <input 
                  v-model.number="form.maxUsageCount" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 100 (0 for unlimited)"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
                />
                <span class="text-[10px] text-gray-400 mt-1 block">Total times code can ever be redeemed platform-wide.</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Per-Customer Redemption Limit</label>
                <input 
                  v-model.number="form.maxUsagePerUser" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 1 (0 for unlimited)"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
                />
                <span class="text-[10px] text-gray-400 mt-1 block">Maximum times an individual shopper can use this code.</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Expiration Date & Time</label>
              <input 
                v-model="form.expiresAt" 
                type="datetime-local" 
                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all"
              />
              <span class="text-[10px] text-gray-400 mt-1 block">Leave empty if the promo voucher has no expiration date.</span>
            </div>
          </div>

          <!-- ── Section 5: Advanced Restrictions & Targeting ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Bike class="w-3.5 h-3.5 text-[#FF5C1A]" />
                5. Advanced Restrictions & Targeting
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Optional</span>
            </div>

            <!-- Applicable Order Types -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">
                Eligible Errand & Order Types
                <span class="text-gray-400 font-normal">(Leave empty for All Order Types)</span>
              </label>
              <SearchableMultiSelect
                v-model="form.applicableOrderTypes"
                :options="orderTypeOptions"
                placeholder="All Errand & Order Types eligible"
                search-placeholder="Search errand types..."
              />
            </div>

            <!-- Applicable Vendors -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">
                Eligible Merchant Stores & Vendors
                <span class="text-gray-400 font-normal">(Leave empty for All Vendors)</span>
              </label>
              <SearchableMultiSelect
                v-model="form.applicableVendors"
                :options="vendorMultiSelectOptions"
                placeholder="All Merchant Stores eligible"
                search-placeholder="Search stores by name, email or phone..."
              />
            </div>

            <!-- Applicable Users -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">
                Specific Customer Account Targeting
                <span class="text-gray-400 font-normal">(Leave empty for All Customers)</span>
              </label>
              <SearchableMultiSelect
                v-model="form.applicableUsers"
                :options="customerMultiSelectOptions"
                placeholder="All Customers eligible"
                search-placeholder="Search customers by name, email or phone..."
              />
            </div>

            <!-- Checkbox Restrictions -->
            <div class="space-y-2.5 pt-2 border-t border-gray-200/80">
              <label class="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  v-model="form.onlyForNewUsers" 
                  class="mt-0.5 w-4 h-4 accent-[#FF5C1A] rounded border-gray-300"
                />
                <div>
                  <span class="text-xs font-bold text-gray-800 block">First-Time Customers Only</span>
                  <span class="text-[11px] text-gray-500 block">Valid exclusively on a customer's very 1st completed order.</span>
                </div>
              </label>

              <label class="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  v-model="form.appliesToDeliveryFeeOnly" 
                  class="mt-0.5 w-4 h-4 accent-[#FF5C1A] rounded border-gray-300"
                />
                <div>
                  <span class="text-xs font-bold text-gray-800 block">Apply Discount to Delivery Fee Only</span>
                  <span class="text-[11px] text-gray-500 block">Protects merchant food/item payout; discounts only the errand delivery fee.</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-3">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full flex justify-center items-center gap-2 bg-[#FF5C1A] hover:bg-[#e04f14] text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-all disabled:opacity-70 shadow-md shadow-orange-500/20"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? (isEditing ? 'Saving Promo Code...' : 'Creating Promo Code...') : (isEditing ? 'Save Changes' : 'Create Promo Code') }}</span>
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
import { Search, Plus, Tag, Loader2, Copy, Edit, Sparkles, BarChart3, ShoppingBag, Users, Bike, TrendingUp } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { usePromos } from '@/composables/modules/promos/usePromos'
import { promos_api } from '@/api_factory/modules/promos'
import UiSideDrawer from '@/components/ui/SideDrawer.vue'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import SearchableMultiSelect from '@/components/ui/SearchableMultiSelect.vue'

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

const personaOptions = [
  { value: 'none', label: 'Platform (None / General Promo)', emoji: '🏢', sublabel: 'General platform marketing voucher' },
  { value: 'errander', label: 'Errand Ninja', emoji: '🛵', sublabel: 'Delivery courier affiliate code' },
  { value: 'student', label: 'Customer / Student', emoji: '🎓', sublabel: 'Campus shopper referral code' },
  { value: 'vendor', label: 'Vendor Partner', emoji: '🏪', sublabel: 'Merchant store promotion' },
  { value: 'facilitator', label: 'Campus Ambassador', emoji: '💎', sublabel: 'Campus rep affiliate voucher' },
]

const discountTypeOptions = [
  { value: 'percentage', label: 'Percentage (%)', emoji: '%' },
  { value: 'flat', label: 'Flat Amount (₦)', emoji: '₦' },
]

const rewardTypeOptions = [
  { value: 'points', label: 'Reward Points ⭐', emoji: '⭐' },
  { value: 'wallet_credit', label: 'Wallet Credit (₦) 💳', emoji: '💳' },
]

const orderTypeOptions = [
  { value: 'inside_campus', label: 'Inside Campus Delivery', emoji: '🏫', sublabel: 'Deliveries strictly within university campus grounds' },
  { value: 'outside_campus', label: 'Outside Campus Delivery', emoji: '🏙️', sublabel: 'Off-campus errands and town delivery locations' },
  { value: 'custom_errand', label: 'Custom Errand / Runner Task', emoji: '⚡', sublabel: 'Personalized customer errand requests' },
  { value: 'group_order', label: 'Group Orders', emoji: '👥', sublabel: 'Pooled multi-order grocery & restaurant deliveries' },
]

const vendorMultiSelectOptions = computed(() => {
  return vendors.value.map(v => ({
    value: v._id || v.userId,
    label: v.storeName || v.businessName || v.name || 'Store',
    sublabel: `${v.email || ''} ${v.phone ? '• ' + v.phone : ''}`.trim(),
    emoji: '🏪'
  }))
})

const customerMultiSelectOptions = computed(() => {
  return users.value
    .filter(u => u.role === 'student' || u.role === 'customer' || !u.role)
    .map(u => ({
      value: u._id,
      label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      sublabel: `${u.email} ${u.phone ? '• ' + u.phone : ''}`.trim(),
      emoji: '🎓'
    }))
})

const form = ref({
  code: '',
  discountType: 'percentage',
  value: 10,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  maxUsageCount: 0,
  maxUsagePerUser: 1,
  expiresAt: '',
  onlyForNewUsers: false,
  appliesToDeliveryFeeOnly: false,
  applicableOrderTypes: [] as string[],
  applicableVendors: [] as string[],
  applicableUsers: [] as string[],
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
      sublabel: `Ambassador • Code: ${f.referralCode || 'None'}`,
    }))
  }
  if (form.value.referrerType === 'vendor') {
    return vendors.value.map(v => ({
      label: v.storeName || v.businessName || v.name || v.email,
      value: v.userId || v._id,
      sublabel: `Vendor • ${v.email}`,
    }))
  }
  const filteredUsers = users.value.filter(u => u.role === form.value.referrerType)
  return filteredUsers.map(u => ({
    label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    value: u._id,
    sublabel: `${u.role === 'errander' ? 'Errand Ninja' : 'Customer'} • ${u.email}`,
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
    maxUsagePerUser: 1,
    expiresAt: '',
    onlyForNewUsers: false,
    appliesToDeliveryFeeOnly: false,
    applicableOrderTypes: [],
    applicableVendors: [],
    applicableUsers: [],
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
    maxUsagePerUser: promo.maxUsagePerUser || 0,
    expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : '',
    onlyForNewUsers: promo.onlyForNewUsers || false,
    appliesToDeliveryFeeOnly: promo.appliesToDeliveryFeeOnly || false,
    applicableOrderTypes: Array.isArray(promo.applicableOrderTypes) ? promo.applicableOrderTypes : [],
    applicableVendors: Array.isArray(promo.applicableVendors) ? promo.applicableVendors.map((v: any) => typeof v === 'object' ? v._id : v) : [],
    applicableUsers: Array.isArray(promo.applicableUsers) ? promo.applicableUsers.map((u: any) => typeof u === 'object' ? u._id : u) : [],
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
    appliesToDeliveryFeeOnly: !!form.value.appliesToDeliveryFeeOnly,
    onlyForNewUsers: !!form.value.onlyForNewUsers,
    maxDiscountAmount: Number(form.value.maxDiscountAmount) || 0,
    minOrderAmount: Number(form.value.minOrderAmount) || 0,
    maxUsageCount: Number(form.value.maxUsageCount) || null,
    maxUsagePerUser: Number(form.value.maxUsagePerUser) || null,
    expiresAt: form.value.expiresAt ? new Date(form.value.expiresAt) : null,
    applicableOrderTypes: form.value.applicableOrderTypes || [],
    applicableVendors: form.value.applicableVendors || [],
    applicableUsers: form.value.applicableUsers || [],
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
