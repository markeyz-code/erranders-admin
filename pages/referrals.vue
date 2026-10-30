<template>
  <div class="space-y-6 animate-fade-in pb-24">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-black text-gray-900 font-heading tracking-tight">Referrals & Affiliates Hub</h1>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF5C1A]/10 text-[#FF5C1A] border border-[#FF5C1A]/20">
            <Sparkles class="w-3 h-3" /> Multi-Persona Engine
          </span>
        </div>
        <p class="text-sm text-gray-500">
          Create trackable promo codes and manage referrals for Erranders Staffs, Vendors, Errand Ninjas, Customers/Students & Ambassadors
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button @click="openCreatePromoModal()"
          class="flex items-center gap-2 px-4 h-11 bg-[#FF5C1A] text-white rounded-xl font-bold text-sm hover:bg-[#e04f14] transition-all shadow-sm shadow-[#FF5C1A]/20">
          <Tag class="w-4 h-4" />
          Create Referral Promo
        </button>

        <button @click="showAddStaffModal = true"
          class="flex items-center gap-2 px-4 h-11 bg-white border border-gray-200 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-xs">
          <UserCheck class="w-4 h-4 text-amber-600" />
          Add Staff / Internal Team
        </button>

        <button @click="showAddFacModal = true"
          class="flex items-center gap-2 px-4 h-11 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm">
          <UserPlus class="w-4 h-4" />
          Add Ambassador
        </button>

        <button @click="openCustomCodeModal()"
          class="flex items-center gap-2 px-3.5 h-11 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">
          <Sparkles class="w-4 h-4 text-[#FF5C1A]" />
          Assign Code
        </button>
      </div>
    </div>

    <!-- 6-Grid Stats Cards: Strictly 5 Persona Categories + Total Performance -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <!-- 1. Erranders Staffs or internal team -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base">
            👔
          </div>
          <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Staff</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Erranders Staffs</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData?.personas?.staff?.referrals || statsData?.referralsByType?.staff || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">{{ statsData?.personas?.staff?.total || 0 }} internal team</p>
      </div>

      <!-- 2. Vendors -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
            🏪
          </div>
          <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Vendors</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Vendors</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData?.personas?.vendors?.referrals || statsData?.referralsByType?.vendor || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">{{ statsData?.personas?.vendors?.total || 0 }} merchants</p>
      </div>

      <!-- 3. Errand Ninjas -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
            🛵
          </div>
          <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Ninjas</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Errand Ninjas</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData?.personas?.ninjas?.referrals || statsData?.referralsByType?.errander || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">{{ statsData?.personas?.ninjas?.total || 0 }} registered ninjas</p>
      </div>

      <!-- 4. Customers/Students -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
            🎓
          </div>
          <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Customers</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Customers/Students</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData?.personas?.customers?.referrals || statsData?.referralsByType?.student || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">{{ statsData?.personas?.customers?.total || 0 }} registered</p>
      </div>

      <!-- 5. Ambassadors -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
            💎
          </div>
          <span class="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Ambassadors</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Ambassadors</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData?.personas?.ambassadors?.referrals || statsData?.referralsByType?.facilitator || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">{{ statsData?.totalFacilitators || 0 }} active campus leads</p>
      </div>

      <!-- Total Referrals & Promo Volume -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center font-bold">
            <Gift class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-1.5 py-0.5 rounded">All-Time</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Total Referrals</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData?.totalReferrals || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">
          ₦{{ (statsData?.affiliatePromos?.totalRevenueDriven || 0).toLocaleString() }} promo sales
        </p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
      <div class="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
        <button v-for="tab in mainTabs" :key="tab.key" @click="activeMainTab = tab.key"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
          :class="activeMainTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'">
          <component :is="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
          <span v-if="tab.badge !== undefined" class="text-[10px] px-1.5 py-0.2 rounded-full font-bold"
            :class="activeMainTab === tab.key ? 'bg-gray-100 text-gray-700' : 'bg-gray-200/70 text-gray-500'">
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button @click="refreshAll()" class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh data">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- TAB 1: ALL REFERRERS (MULTI-PERSONA HUB)                       -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div v-if="activeMainTab === 'referrers'" class="space-y-4">
      <!-- Sub-filters & Search -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Persona Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button v-for="persona in personaFilters" :key="persona.key" @click="selectedPersona = persona.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
            :class="selectedPersona === persona.key ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'">
            <span>{{ persona.emoji }}</span>
            <span>{{ persona.label }}</span>
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative w-full md:w-80">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="referrerSearch" type="text" placeholder="Search by name, code, email..."
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-gray-900 focus:bg-white transition-colors" />
        </div>
      </div>

      <!-- Batch Actions Bar (when items are selected) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="selectedReferrersList.length > 0"
          class="bg-gradient-to-r from-rose-950 via-gray-900 to-gray-950 text-white p-3.5 px-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-rose-500/30">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-xs">
              {{ selectedReferrersList.length }}
            </div>
            <div>
              <p class="text-xs font-bold text-white">{{ selectedReferrersList.length }} persona{{ selectedReferrersList.length > 1 ? 's' : '' }} selected</p>
              <p class="text-[10px] text-gray-400">Selected across Erranders Staffs, Vendors, Errand Ninjas, Customers & Ambassadors</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="clearSelection()"
              class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors">
              Deselect All
            </button>
            <button
              type="button"
              @click="confirmDeleteBatch()"
              class="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/40 transition-all">
              <Trash2 class="w-3.5 h-3.5" />
              <span>Batch Delete ({{ selectedReferrersList.length }})</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- Referrers List / Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- List Header with Select All -->
        <div class="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-4 text-xs">
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-2 cursor-pointer font-bold text-gray-700 select-none">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded border-gray-300 text-[#FF5C1A] focus:ring-[#FF5C1A]/20 cursor-pointer"
              />
              <span class="text-xs">Select All ({{ filteredReferrers.length }})</span>
            </label>
            <span v-if="selectedReferrersList.length > 0" class="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
              {{ selectedReferrersList.length }} selected
            </span>
          </div>

          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span class="text-[11px] font-medium text-gray-400">
              Showing {{ filteredReferrers.length }} of {{ referrers.length }} personas
            </span>
            <button
              v-if="selectedReferrersList.length > 0"
              @click="confirmDeleteBatch()"
              class="flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition-colors">
              <Trash2 class="w-3 h-3" />
              <span>Delete Selected ({{ selectedReferrersList.length }})</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="referrersLoading" class="p-8 space-y-4">
          <div v-for="i in 5" :key="`ref-load-${i}`" class="flex items-center gap-4 animate-pulse">
            <div class="w-10 h-10 bg-gray-100 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="w-48 h-3.5 bg-gray-100 rounded"></div>
              <div class="w-32 h-2.5 bg-gray-100 rounded"></div>
            </div>
            <div class="w-20 h-6 bg-gray-100 rounded"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredReferrers.length === 0" class="py-20 text-center">
          <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100 text-gray-400">
            <Users class="w-6 h-6" />
          </div>
          <h3 class="text-sm font-bold text-gray-900">No Referrers Found</h3>
          <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search or persona filter, or assign a referral code to a ninja, customer, or vendor.
          </p>
        </div>

        <!-- Referrers Cards -->
        <div v-else class="divide-y divide-gray-100">
          <div v-for="referrer in filteredReferrers" :key="`${referrer.type}-${referrer._id}`"
            @click="openReferrerProfile(referrer)"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-gray-50/70 transition-all cursor-pointer group"
            :class="{ 'bg-orange-50/30': isSelected(referrer) }">
            
            <!-- Checkbox & Identity & Role -->
            <div class="flex items-center gap-3.5 min-w-0">
              <!-- Selection Checkbox -->
              <div class="flex items-center shrink-0" @click.stop>
                <input
                  type="checkbox"
                  :checked="isSelected(referrer)"
                  @change="toggleSelect(referrer)"
                  class="w-4 h-4 rounded border-gray-300 text-[#FF5C1A] focus:ring-[#FF5C1A]/20 cursor-pointer"
                />
              </div>

              <!-- Avatar -->
              <div class="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
                :class="personaBadgeTheme(referrer.role).avatarClass">
                {{ referrer.name?.charAt(0)?.toUpperCase() || 'U' }}
              </div>

              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ referrer.name }}</h4>
                  <span class="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md border uppercase"
                    :class="personaBadgeTheme(referrer.role).tagClass">
                    {{ personaBadgeTheme(referrer.role).emoji }} {{ personaBadgeTheme(referrer.role).label }}
                  </span>
                  <span :class="tierBadgeClass(referrer.tier)" class="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase">
                    {{ tierEmoji(referrer.tier) }} {{ referrer.tier }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-0.5 text-xs text-gray-500 truncate">
                  <span>{{ referrer.email }}</span>
                  <span v-if="referrer.phone" class="text-gray-300">•</span>
                  <span v-if="referrer.phone">{{ referrer.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Referral Code & Linked Promo Badges -->
            <div class="flex flex-wrap items-center gap-3 shrink-0">
              <!-- Referral Code Box -->
              <div class="flex items-center gap-1.5 bg-gray-100/80 px-2.5 py-1.5 rounded-lg border border-gray-200">
                <span class="text-[10px] font-bold text-gray-400 uppercase">Ref Code:</span>
                <span class="text-xs font-mono font-bold text-gray-900">{{ referrer.referralCode }}</span>
                <button @click.stop="copyText(referrer.referralCode, 'Referral code copied!')" class="text-gray-400 hover:text-gray-900 transition-colors">
                  <Copy class="w-3 h-3" />
                </button>
              </div>

              <!-- Linked Promo Codes Chip -->
              <div v-if="referrer.promoCodes && referrer.promoCodes.length > 0" class="flex items-center gap-1">
                <span v-for="promo in referrer.promoCodes.slice(0, 2)" :key="promo._id"
                  @click.stop="openRedemptionsDrawer(promo)"
                  class="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-[#FF5C1A]/10 text-[#FF5C1A] border border-[#FF5C1A]/20 px-2 py-1 rounded-md hover:bg-[#FF5C1A]/20 transition-colors">
                  <Tag class="w-2.5 h-2.5" />
                  {{ promo.code }} ({{ promo.usageCount }})
                </span>
                <span v-if="referrer.promoCodes.length > 2" class="text-[10px] text-gray-400 font-bold">
                  +{{ referrer.promoCodes.length - 2 }} more
                </span>
              </div>
              <div v-else>
                <button @click.stop="quickAssignPromo(referrer)"
                  class="text-[10px] font-bold text-[#FF5C1A] hover:underline flex items-center gap-1">
                  <Plus class="w-3 h-3" /> Add Promo
                </button>
              </div>
            </div>

            <!-- Performance Stats & Actions -->
            <div class="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <div class="text-left sm:text-right">
                <p class="text-xs font-black text-gray-900 tabular-nums">{{ referrer.totalReferrals || 0 }}</p>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Referrals</p>
              </div>

              <div class="text-left sm:text-right">
                <p class="text-xs font-black text-gray-900 tabular-nums">₦{{ (referrer.totalPromoRevenue || 0).toLocaleString() }}</p>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Promo Sales</p>
              </div>

              <div class="text-left sm:text-right">
                <p class="text-xs font-black text-amber-600 tabular-nums">{{ (referrer.pointsEarned || 0).toLocaleString() }} pts</p>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Earned</p>
              </div>

              <div class="flex items-center gap-1">
                <button @click.stop="quickAssignPromo(referrer)"
                  class="p-2 text-gray-400 hover:text-[#FF5C1A] hover:bg-[#FF5C1A]/10 rounded-lg transition-colors" title="Create dedicated promo code for this person">
                  <Tag class="w-4 h-4" />
                </button>
                <button @click.stop="confirmDeleteSingle(referrer)"
                  class="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  :title="`Delete ${referrer.name}`">
                  <Trash2 class="w-4 h-4" />
                </button>
                <button @click.stop="openReferrerProfile(referrer)"
                  class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="View 360° Profile & Activity">
                  <ChevronRight class="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- TAB 2: REFERRAL PROMO CODES (TRACKING & REDEMPTIONS)           -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div v-if="activeMainTab === 'referralPromos'" class="space-y-4">
      <!-- Search & Filters -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-1.5">
          <button v-for="persona in promoPersonaFilters" :key="persona.key" @click="selectedPromoPersona = persona.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
            :class="selectedPromoPersona === persona.key ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'">
            <span>{{ persona.emoji }}</span>
            <span>{{ persona.label }}</span>
          </button>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <div class="relative w-full sm:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="promoSearch" type="text" placeholder="Search promo codes..."
              class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-gray-900 focus:bg-white transition-colors" />
          </div>
          <button @click="openCreatePromoModal()"
            class="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF5C1A] text-white rounded-xl font-bold text-xs hover:bg-[#e04f14] transition-colors shrink-0">
            <Plus class="w-3.5 h-3.5" /> New Promo
          </button>
        </div>
      </div>

      <!-- Referral Promo Codes Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/60">
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Promo Code</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Affiliate / Owner</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Discount</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Referrer Reward</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Redemptions</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Revenue Driven</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th class="px-5 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-if="promosLoading" v-for="i in 5" :key="`p-load-${i}`" class="animate-pulse">
                <td colspan="8" class="px-5 py-4"><div class="h-4 bg-gray-100 rounded w-full"></div></td>
              </tr>
              <tr v-else-if="filteredReferralPromos.length === 0">
                <td colspan="8" class="px-5 py-16 text-center text-gray-400">
                  <Tag class="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p class="text-sm font-bold text-gray-900">No Referral Promo Codes Found</p>
                  <p class="text-xs">Create a dedicated promo code for an Errand Ninja, Customer, Vendor, or Ambassador.</p>
                </td>
              </tr>
              <tr v-else v-for="promo in filteredReferralPromos" :key="promo._id" class="hover:bg-gray-50/50 transition-colors">
                <!-- Code -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                      {{ promo.code }}
                    </span>
                    <button @click="copyText(promo.code, 'Promo code copied!')" class="text-gray-400 hover:text-gray-900">
                      <Copy class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>

                <!-- Owner -->
                <td class="px-5 py-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm">{{ personaBadgeTheme(promo.referrerType).emoji }}</span>
                    <div>
                      <p class="text-xs font-bold text-gray-900">{{ getPromoOwnerName(promo) }}</p>
                      <span class="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border"
                        :class="personaBadgeTheme(promo.referrerType).tagClass">
                        {{ personaBadgeTheme(promo.referrerType).label }}
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Discount Value -->
                <td class="px-5 py-4">
                  <span class="text-xs font-bold text-gray-900">
                    {{ promo.discountType === 'percentage' ? `${promo.value}%` : `₦${(promo.value || 0).toLocaleString()}` }}
                  </span>
                  <span v-if="promo.maxDiscountAmount" class="block text-[10px] text-gray-400">
                    Cap: ₦{{ promo.maxDiscountAmount.toLocaleString() }}
                  </span>
                </td>

                <!-- Referrer Reward -->
                <td class="px-5 py-4">
                  <span class="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                    +{{ promo.rewardPerUse || 50 }} {{ promo.rewardType === 'wallet_credit' ? '₦' : 'pts' }}/order
                  </span>
                </td>

                <!-- Usage -->
                <td class="px-5 py-4">
                  <div class="text-xs font-bold text-gray-900">
                    {{ promo.usageCount || 0 }} {{ promo.maxUsageCount ? `/ ${promo.maxUsageCount}` : 'uses' }}
                  </div>
                </td>

                <!-- Revenue Driven -->
                <td class="px-5 py-4">
                  <div class="text-xs font-black text-gray-900 tabular-nums">
                    ₦{{ (promo.totalRevenueGenerated || 0).toLocaleString() }}
                  </div>
                  <span class="text-[9px] text-gray-400 font-medium">₦{{ (promo.totalDiscountGiven || 0).toLocaleString() }} discounted</span>
                </td>

                <!-- Status -->
                <td class="px-5 py-4">
                  <button @click="togglePromoStatus(promo)"
                    class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200"
                    :class="promo.isActive ? 'bg-emerald-500' : 'bg-gray-200'">
                    <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200"
                      :class="promo.isActive ? 'translate-x-4' : 'translate-x-0'" />
                  </button>
                </td>

                <!-- Actions -->
                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button @click="openRedemptionsDrawer(promo)"
                      class="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-lg transition-colors"
                      title="View all customer orders placed with this code">
                      <BarChart3 class="w-3.5 h-3.5 text-gray-500" />
                      <span>Audit Orders</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- TAB 3: ALL REFERRALS (AUDIT TRAIL LOG)                         -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div v-if="activeMainTab === 'referrals'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-gray-900 text-sm">Referral Audit Trail</h3>
          <p class="text-xs text-gray-500">Real-time log of users registered and orders converted through referrals</p>
        </div>
        <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">{{ referralData?.total || 0 }} events</span>
      </div>

      <div v-if="referralsLoading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="`r-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-8 h-8 bg-gray-100 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="w-40 h-3 bg-gray-100 rounded"></div>
            <div class="w-24 h-2 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="!referralData?.referrals?.length" class="py-20 text-center text-gray-400">
        <Gift class="w-10 h-10 mx-auto mb-2 opacity-30" />
        <h4 class="text-sm font-bold text-gray-900">No Referrals Recorded</h4>
        <p class="text-xs text-gray-500">Referrals will automatically show up when users sign up or place orders with referral codes.</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="ref in referralData.referrals" :key="ref._id"
          class="flex items-center justify-between gap-4 p-4 hover:bg-gray-50/60 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center border font-bold text-xs"
              :class="personaBadgeTheme(ref.referrerType).avatarClass">
              {{ personaBadgeTheme(ref.referrerType).emoji }}
            </div>
            <div>
              <p class="text-xs text-gray-900">
                <span class="font-bold">{{ getReferrerName(ref) }}</span>
                <span class="text-gray-400 mx-1.5">referred</span>
                <span class="font-bold text-gray-800">{{ ref.referred?.firstName }} {{ ref.referred?.lastName }}</span>
              </p>
              <div class="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
                <span class="font-mono text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded font-bold">{{ ref.referralCode }}</span>
                <span>•</span>
                <span>{{ formatDate(ref.createdAt) }}</span>
                <span>•</span>
                <span class="font-bold" :class="ref.firstOrderCompleted ? 'text-emerald-600' : 'text-amber-600'">
                  {{ ref.firstOrderCompleted ? '✓ First Order Placed' : '⏳ Awaiting First Order' }}
                </span>
              </div>
            </div>
          </div>

          <div class="text-right">
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              +{{ ref.referrerPointsAwarded || 100 }} pts
            </span>
            <span class="block text-[10px] text-gray-400 mt-1 uppercase font-bold">{{ ref.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- TAB 4: LEADERBOARD                                            -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div v-if="activeMainTab === 'leaderboard'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="font-bold text-gray-900 text-sm">Top Affiliates Leaderboard</h3>
          <p class="text-xs text-gray-500">Highest referral and order-converting participants across Erranders</p>
        </div>

        <!-- Role Filter for Leaderboard -->
        <div class="flex items-center gap-1 bg-gray-100/70 p-1 rounded-xl">
          <button v-for="lb in leaderboardFilters" :key="lb.key" @click="selectedLeaderboardRole = lb.key; fetchLeaderboard()"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            :class="selectedLeaderboardRole === lb.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'">
            {{ lb.label }}
          </button>
        </div>
      </div>

      <div v-if="leaderboardLoading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="`lb-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="w-36 h-3 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="leaderboard.length === 0" class="py-20 text-center text-gray-400">
        <Trophy class="w-10 h-10 mx-auto mb-2 opacity-30" />
        <h4 class="text-sm font-bold text-gray-900">Leaderboard Empty</h4>
        <p class="text-xs text-gray-500">No referrals found for this role category.</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="(entry, idx) in leaderboard" :key="`${entry.type}-${entry.id}`"
          class="flex items-center gap-4 p-4 hover:bg-gray-50/60 transition-colors">
          <!-- Rank Badge -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border shrink-0"
            :class="idx === 0 ? 'bg-amber-100 text-amber-800 border-amber-300' : idx === 1 ? 'bg-gray-100 text-gray-800 border-gray-300' : idx === 2 ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-white text-gray-500 border-gray-200'">
            {{ idx < 3 ? ['🥇', '🥈', '🥉'][idx] : `#${idx + 1}` }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-xs font-bold text-gray-900 truncate">{{ entry.name }}</h4>
              <span class="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase"
                :class="personaBadgeTheme(entry.type).tagClass">
                {{ entry.roleEmoji }} {{ entry.roleLabel }}
              </span>
              <span :class="tierBadgeClass(entry.tier)" class="text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase">
                {{ tierEmoji(entry.tier) }} {{ entry.tier }}
              </span>
            </div>
            <p class="text-[10px] text-gray-400 mt-0.5 font-mono">{{ entry.referralCode }} • {{ entry.email }}</p>
          </div>

          <div class="flex items-center gap-6 shrink-0 text-right">
            <div>
              <p class="text-xs font-black text-gray-900">{{ entry.referralCount || 0 }}</p>
              <p class="text-[9px] font-bold text-gray-400 uppercase">Referrals</p>
            </div>
            <div>
              <p class="text-xs font-black text-amber-600">{{ (entry.pointsEarned || 0).toLocaleString() }}</p>
              <p class="text-[9px] font-bold text-gray-400 uppercase">Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- DRAWER 1: CREATE REFERRAL PROMO CODE                           -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <SideDrawer :isOpen="showPromoModal" @close="showPromoModal = false" size="lg" title="Create Referral Promo Code">
      <div class="space-y-6 pt-1">
        <!-- Subheader with clear guidance -->
        <div class="rounded-xl bg-orange-50/60 border border-orange-100 p-3.5 flex items-start gap-3">
          <Sparkles class="w-5 h-5 text-[#FF5C1A] shrink-0 mt-0.5" />
          <div class="text-xs text-gray-700 leading-relaxed">
            <span class="font-bold text-gray-900">Affiliate Voucher Generation:</span>
            Configure an exclusive promo code for an Errand Ninja, Vendor, Customer, or Ambassador. When shoppers use this code, they get an instant discount while the affiliate automatically earns reward commissions.
          </div>
        </div>

        <form @submit.prevent="handleCreatePromo" class="space-y-5">
          <!-- ── Section 1: Affiliate Partner Linkage ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users class="w-3.5 h-3.5 text-[#FF5C1A]" />
                1. Affiliate Beneficiary Linkage
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Required</span>
            </div>

            <!-- Persona Selector Tabs -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">
                Affiliate Category <span class="text-gray-400 font-normal">(Who earns commissions?)</span> *
              </label>
              <div class="grid grid-cols-5 gap-1.5">
                <button 
                  v-for="roleOption in [
                    { key: 'staff', label: 'Staff', emoji: '👔', desc: 'Internal' },
                    { key: 'vendor', label: 'Vendor', emoji: '🏪', desc: 'Merchant' },
                    { key: 'errander', label: 'Ninja', emoji: '🛵', desc: 'Rider' },
                    { key: 'student', label: 'Customer', emoji: '🎓', desc: 'Shopper' },
                    { key: 'facilitator', label: 'Ambassador', emoji: '💎', desc: 'Rep' },
                  ]" 
                  :key="roleOption.key" 
                  type="button" 
                  @click="onSelectPromoPersona(roleOption.key)"
                  class="py-2.5 px-1.5 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1"
                  :class="promoForm.targetRole === roleOption.key ? 'bg-gray-900 text-white border-gray-900 shadow-md ring-2 ring-gray-900/10' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100/80'"
                >
                  <span class="text-base">{{ roleOption.emoji }}</span>
                  <span class="text-[11px] font-bold truncate leading-tight">{{ roleOption.label }}</span>
                  <span class="text-[9px] opacity-60 uppercase tracking-tighter">{{ roleOption.desc }}</span>
                </button>
              </div>
            </div>

            <!-- Beneficiary Person Selector -->
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">
                Select Beneficiary Person or Store *
              </label>
              <SearchableSelect
                v-model="promoForm.selectedPersonId"
                :options="personOptions"
                :show-all-option="false"
                placeholder="Choose affiliate person or merchant store..."
                :search-placeholder="`Search ${promoForm.targetRole} by name, email or phone...`"
                @update:model-value="onPersonSelected"
              />
            </div>

            <!-- Promo Code String (Auto-suggested) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-gray-700">
                  Promo Voucher Code String *
                </label>
                <button type="button" @click="suggestCodeString()" class="text-xs font-bold text-[#FF5C1A] hover:underline flex items-center gap-1 transition-colors">
                  <Sparkles class="w-3.5 h-3.5" /> Regenerate Code
                </button>
              </div>
              <input 
                v-model="promoForm.code" 
                type="text" 
                required 
                placeholder="e.g. NINJA-MUSA10"
                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono font-black uppercase text-gray-900 tracking-wider focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all" 
              />
              <p class="text-[10px] text-gray-400 mt-1">This is the code customers enter at checkout to unlock their discount.</p>
            </div>
          </div>

          <!-- ── Section 2: Discount & Pricing Configuration ── -->
          <div class="space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag class="w-3.5 h-3.5 text-[#FF5C1A]" />
                2. Customer Discount Terms
              </span>
              <span class="text-[10px] font-bold text-gray-400 uppercase">Pricing</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Discount Calculation Method *</label>
                <SearchableSelect
                  v-model="promoForm.discountType"
                  :options="discountTypeOptions"
                  :show-all-option="false"
                  placeholder="Select discount method..."
                  search-placeholder="Search method..."
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  Discount Value ({{ promoForm.discountType === 'percentage' ? '%' : '₦' }}) *
                </label>
                <input 
                  v-model.number="promoForm.value" 
                  type="number" 
                  required 
                  min="1"
                  :placeholder="promoForm.discountType === 'percentage' ? 'e.g. 10 (for 10% off)' : 'e.g. 500 (for ₦500 off)'"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all" 
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  Minimum Order Subtotal (₦)
                </label>
                <input 
                  v-model.number="promoForm.minOrderAmount" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 2000 (0 for no minimum)"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all" 
                />
                <span class="text-[10px] text-gray-400 mt-1 block">Order must reach this amount before voucher applies.</span>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  Maximum Discount Cap (₦)
                </label>
                <input 
                  v-model.number="promoForm.maxDiscountAmount" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 1500 (0 for no cap)"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all" 
                />
                <span class="text-[10px] text-gray-400 mt-1 block">Caps percentage discounts to prevent excessive deductions.</span>
              </div>
            </div>
          </div>

          <!-- ── Section 3: Referrer Commission & Earnings ── -->
          <div class="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-[#FF5C1A]/25 p-4 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-[#FF5C1A] uppercase tracking-wider flex items-center gap-1.5">
                <Star class="w-3.5 h-3.5 text-[#FF5C1A]" />
                3. Referrer Commission & Reward
              </span>
              <span class="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Per Order</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Reward Currency *</label>
                <SearchableSelect
                  v-model="promoForm.rewardType"
                  :options="rewardTypeOptions"
                  :show-all-option="false"
                  placeholder="Select reward currency..."
                  search-placeholder="Search reward type..."
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">
                  Commission Amount ({{ promoForm.rewardType === 'wallet_credit' ? '₦' : 'Points' }}) *
                </label>
                <input 
                  v-model.number="promoForm.rewardPerUse" 
                  type="number" 
                  min="0" 
                  placeholder="e.g. 50"
                  class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all" 
                />
              </div>
            </div>
            <p class="text-[11px] text-gray-600 leading-snug">
              Every time a customer places and completes an order using this code, this amount is instantly credited to the affiliate's wallet or point balance.
            </p>
          </div>

          <!-- ── Section 4: Global Limits & Expiry ── -->
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
                  v-model.number="promoForm.maxUsageCount" 
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
                  v-model.number="promoForm.maxUsagePerUser" 
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
                v-model="promoForm.expiresAt" 
                type="datetime-local" 
                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 transition-all" 
              />
              <span class="text-[10px] text-gray-400 mt-1 block">Leave empty if the promo voucher has no expiration date.</span>
            </div>
          </div>

          <!-- ── Section 5: Errand Types & Advanced Restrictions ── -->
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
                v-model="promoForm.applicableOrderTypes"
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
                v-model="promoForm.applicableVendors"
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
                v-model="promoForm.applicableUsers"
                :options="customerMultiSelectOptions"
                placeholder="All Customers eligible"
                search-placeholder="Search customers by name, email or phone..."
              />
            </div>

            <!-- Checkbox Restrictions -->
            <div class="space-y-2.5 pt-2 border-t border-gray-200/80">
              <label class="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  v-model="promoForm.onlyForNewUsers" 
                  type="checkbox" 
                  class="mt-0.5 w-4 h-4 accent-[#FF5C1A] rounded border-gray-300" 
                />
                <div>
                  <span class="text-xs font-bold text-gray-800 block">First-Time Customers Only</span>
                  <span class="text-[11px] text-gray-500 block">Valid exclusively on a customer's very 1st completed order.</span>
                </div>
              </label>

              <label class="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  v-model="promoForm.appliesToDeliveryFeeOnly" 
                  type="checkbox" 
                  class="mt-0.5 w-4 h-4 accent-[#FF5C1A] rounded border-gray-300" 
                />
                <div>
                  <span class="text-xs font-bold text-gray-800 block">Apply Discount to Delivery Fee Only</span>
                  <span class="text-[11px] text-gray-500 block">Protects merchant food/item payout; discounts only the errand delivery fee.</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="promoError" class="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 font-medium flex items-center gap-2">
            <AlertTriangle class="w-4 h-4 shrink-0 text-rose-600" />
            <span>{{ promoError }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3 pt-2">
            <button 
              type="button" 
              @click="showPromoModal = false"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="creatingPromo"
              class="flex-[2] py-3 bg-[#FF5C1A] text-white rounded-xl font-bold text-xs hover:bg-[#e04f14] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
            >
              <Loader2 v-if="creatingPromo" class="w-3.5 h-3.5 animate-spin" />
              <span>{{ creatingPromo ? 'Generating Referral Code...' : 'Create Referral Promo Code' }}</span>
            </button>
          </div>
        </form>
      </div>
    </SideDrawer>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- MODAL 2: ADD ERRANDERS STAFF / INTERNAL TEAM                   -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showAddStaffModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4" @click.self="showAddStaffModal = false">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold">👔</span>
                <h2 class="text-lg font-black text-gray-900">Add Erranders Staff</h2>
              </div>
              <p class="text-xs text-gray-500 mt-1">Register an internal team member or staff to track their referrals. Only the full name is compulsory.</p>
            </div>

            <form @submit.prevent="handleAddStaff" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input v-model="newStaff.name" type="text" required placeholder="e.g. Samuel Okafor"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-gray-700 uppercase">Email</label>
                  <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                </div>
                <input v-model="newStaff.email" type="email" placeholder="samuel@erranders.org (optional)"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-xs font-bold text-gray-700 uppercase">Phone</label>
                    <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                  </div>
                  <input v-model="newStaff.phone" type="tel" placeholder="08012345678"
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
                </div>
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-xs font-bold text-gray-700 uppercase">Department</label>
                    <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                  </div>
                  <input v-model="newStaff.department" type="text" placeholder="e.g. Operations"
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-gray-700 uppercase">Custom Code</label>
                  <span class="text-[10px] text-gray-400 font-medium">Auto if blank</span>
                </div>
                <input v-model="newStaff.referralCode" type="text" placeholder="e.g. ERR-SAMUEL"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white uppercase font-mono" />
              </div>

              <div v-if="addStaffError" class="p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium">
                {{ addStaffError }}
              </div>

              <div class="flex gap-2 pt-2">
                <button type="button" @click="showAddStaffModal = false"
                  class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="addingStaff"
                  class="flex-1 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Loader2 v-if="addingStaff" class="w-3.5 h-3.5 animate-spin" />
                  <span>{{ addingStaff ? 'Adding Staff...' : 'Add Staff' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- MODAL 3: ADD AMBASSADOR (FACILITATOR)                          -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showAddFacModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4" @click.self="showAddFacModal = false">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">💎</span>
                <h2 class="text-lg font-black text-gray-900">Add Ambassador</h2>
              </div>
              <p class="text-xs text-gray-500 mt-1">Register a campus ambassador. Only the full name is compulsory; other details are optional.</p>
            </div>

            <form @submit.prevent="handleAddFacilitator" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name <span class="text-red-500">*</span>
                </label>
                <input v-model="newFac.name" type="text" required placeholder="e.g. Tunde Adeyemi"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-gray-700 uppercase">Email</label>
                  <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                </div>
                <input v-model="newFac.email" type="email" placeholder="tunde@university.edu.ng (optional)"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-gray-700 uppercase">Phone Number</label>
                  <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                </div>
                <input v-model="newFac.phone" type="tel" placeholder="08012345678 (optional)"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-xs font-bold text-gray-700 uppercase">Matric No.</label>
                    <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                  </div>
                  <input v-model="newFac.matricNumber" type="text" placeholder="Optional"
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
                </div>
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-xs font-bold text-gray-700 uppercase">Skill / Niche</label>
                    <span class="text-[10px] text-gray-400 font-medium">Optional</span>
                  </div>
                  <input v-model="newFac.skill" type="text" placeholder="e.g. Content Creator"
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white" />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-xs font-bold text-gray-700 uppercase">Custom Code</label>
                  <span class="text-[10px] text-gray-400 font-medium">Auto if blank</span>
                </div>
                <input v-model="newFac.referralCode" type="text" placeholder="e.g. ERR-TUNDE"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:bg-white uppercase font-mono" />
              </div>

              <div v-if="newFac.email" class="flex items-center gap-2 pt-1">
                <input v-model="newFac.sendWelcomeEmail" type="checkbox" id="fac-send-email"
                  class="w-4 h-4 accent-gray-900 rounded border-gray-300" />
                <label for="fac-send-email" class="text-xs font-medium text-gray-700 cursor-pointer">
                  Send welcome email with referral link
                </label>
              </div>

              <div v-if="addFacError" class="p-2.5 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium">
                {{ addFacError }}
              </div>

              <div class="flex gap-2 pt-2">
                <button type="button" @click="showAddFacModal = false"
                  class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="addingFac"
                  class="flex-1 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Loader2 v-if="addingFac" class="w-3.5 h-3.5 animate-spin" />
                  <span>{{ addingFac ? 'Registering...' : 'Register' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- MODAL 3: ASSIGN / GENERATE CUSTOM REFERRAL CODE               -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showCustomCodeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4" @click.self="showCustomCodeModal = false">
          <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 space-y-4">
            <div>
              <h2 class="text-lg font-black text-gray-900">Assign Referral Code</h2>
              <p class="text-xs text-gray-500 mt-0.5">Customize or generate a branded referral code for any user.</p>
            </div>

            <form @submit.prevent="handleAssignCustomCode" class="space-y-3.5">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Target Persona *</label>
                <SearchableSelect
                  v-model="customCodeForm.targetRole"
                  :options="personaDropdownOptions"
                  :show-all-option="false"
                  placeholder="Select persona..."
                  search-placeholder="Search target persona..."
                  @change="onSelectCustomCodePersona(customCodeForm.targetRole)"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Select Person *</label>
                <SearchableSelect
                  v-model="customCodeForm.targetId"
                  :options="personOptionsForCustomCode"
                  placeholder="Select person..."
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Custom Referral Code (Optional)</label>
                <input v-model="customCodeForm.code" type="text" placeholder="e.g. ERR-CHOP-FAST"
                  class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:bg-white" />
                <p class="text-[10px] text-gray-400 mt-1">Leave blank to auto-generate a smart branded code.</p>
              </div>

              <div v-if="customCodeError" class="p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                {{ customCodeError }}
              </div>

              <div class="flex gap-2 pt-2">
                <button type="button" @click="showCustomCodeModal = false"
                  class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="assigningCode"
                  class="flex-1 py-2 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Loader2 v-if="assigningCode" class="w-3.5 h-3.5 animate-spin" />
                  <span>{{ assigningCode ? 'Saving...' : 'Save Code' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- DRAWER 1: 360° REFERRER PROFILE DRAWER                         -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <SideDrawer :isOpen="showProfileDrawer" @close="showProfileDrawer = false; selectedProfile = null">
      <div v-if="profileLoading" class="p-8 text-center">
        <Loader2 class="w-8 h-8 animate-spin text-[#FF5C1A] mx-auto mb-2" />
        <p class="text-xs text-gray-500 font-bold">Loading 360° Referrer Profile...</p>
      </div>

      <template v-else-if="selectedProfile">
        <!-- Drawer Header -->
        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center justify-between gap-3.5">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border shrink-0"
                :class="personaBadgeTheme(selectedProfile.profile.role).avatarClass">
                {{ selectedProfile.profile.name?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-base font-black text-gray-900 truncate">{{ selectedProfile.profile.name }}</h3>
                  <span class="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border uppercase"
                    :class="personaBadgeTheme(selectedProfile.profile.role).tagClass">
                    {{ personaBadgeTheme(selectedProfile.profile.role).emoji }} {{ personaBadgeTheme(selectedProfile.profile.role).label }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5 truncate">{{ selectedProfile.profile.email }}</p>
              </div>
            </div>

            <button
              type="button"
              @click="confirmDeleteSingle(selectedProfile.profile)"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl font-bold text-xs transition-all shrink-0"
              title="Delete Persona Record"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-3 gap-2 mt-4">
            <div class="bg-white p-2.5 rounded-xl border border-gray-200 text-center">
              <p class="text-[9px] font-bold text-gray-400 uppercase">Referrals</p>
              <p class="text-sm font-black text-gray-900 mt-0.5">{{ selectedProfile.metrics?.totalReferrals || 0 }}</p>
            </div>
            <div class="bg-white p-2.5 rounded-xl border border-gray-200 text-center">
              <p class="text-[9px] font-bold text-gray-400 uppercase">Promo Sales</p>
              <p class="text-sm font-black text-gray-900 mt-0.5">₦{{ (selectedProfile.metrics?.totalRevenueDriven || 0).toLocaleString() }}</p>
            </div>
            <div class="bg-white p-2.5 rounded-xl border border-gray-200 text-center">
              <p class="text-[9px] font-bold text-gray-400 uppercase">Earned</p>
              <p class="text-sm font-black text-amber-600 mt-0.5">{{ (selectedProfile.profile?.pointsEarned || 0).toLocaleString() }} pts</p>
            </div>
          </div>

          <!-- Referral Code Banner -->
          <div class="mt-4 flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl">
            <div>
              <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Referral Code</p>
              <p class="text-sm font-mono font-black text-[#FF5C1A]">{{ selectedProfile.profile.referralCode }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button @click="copyText(selectedProfile.profile.referralCode, 'Referral code copied!')"
                class="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors">
                <Copy class="w-3 h-3" /> Copy
              </button>
              <button @click="quickAssignPromo(selectedProfile.profile)"
                class="px-2.5 py-1.5 bg-[#FF5C1A] hover:bg-[#e04f14] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors">
                <Tag class="w-3 h-3" /> Issue Promo
              </button>
            </div>
          </div>
        </div>

        <!-- Drawer Content Tabs / Lists -->
        <div class="p-6 space-y-6">
          <!-- Active Promo Codes -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag class="w-3.5 h-3.5 text-[#FF5C1A]" />
                Linked Promo Codes ({{ selectedProfile.promoCodes?.length || 0 }})
              </h4>
              <button @click="quickAssignPromo(selectedProfile.profile)" class="text-xs font-bold text-[#FF5C1A] hover:underline">
                + Create Another
              </button>
            </div>

            <div v-if="!selectedProfile.promoCodes?.length" class="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
              No promo codes created for this referrer yet.
            </div>

            <div v-else class="space-y-2">
              <div v-for="promo in selectedProfile.promoCodes" :key="promo._id"
                class="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-black text-gray-900">{{ promo.code }}</span>
                    <span class="text-[10px] font-bold text-gray-500">
                      {{ promo.discountType === 'percentage' ? `${promo.value}% OFF` : `₦${promo.value} OFF` }}
                    </span>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-0.5">
                    {{ promo.usageCount || 0 }} orders • ₦{{ (promo.totalRevenueGenerated || 0).toLocaleString() }} revenue
                  </p>
                </div>
                <button @click="openRedemptionsDrawer(promo)"
                  class="px-2 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-[10px] font-bold rounded-md">
                  View Orders
                </button>
              </div>
            </div>
          </div>

          <!-- Onboarded Users Log -->
          <div>
            <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users class="w-3.5 h-3.5 text-blue-600" />
              Onboarded Referrals ({{ selectedProfile.referrals?.length || 0 }})
            </h4>

            <div v-if="!selectedProfile.referrals?.length" class="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
              No users have signed up with this referral code yet.
            </div>

            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div v-for="ref in selectedProfile.referrals" :key="ref._id"
                class="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <p class="font-bold text-gray-900">{{ ref.referred?.firstName }} {{ ref.referred?.lastName }}</p>
                  <p class="text-[10px] text-gray-400">{{ ref.referred?.email }} • {{ formatDate(ref.createdAt) }}</p>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded border"
                  :class="ref.firstOrderCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'">
                  {{ ref.firstOrderCompleted ? 'Completed Order' : 'Signed Up' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Promo Code Redemptions Log -->
          <div>
            <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShoppingBag class="w-3.5 h-3.5 text-emerald-600" />
              Promo Redemptions ({{ selectedProfile.redemptions?.length || 0 }})
            </h4>

            <div v-if="!selectedProfile.redemptions?.length" class="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
              No promo code orders recorded yet.
            </div>

            <div v-else class="space-y-2 max-h-60 overflow-y-auto">
              <div v-for="redemption in selectedProfile.redemptions" :key="redemption._id"
                class="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <div>
                  <p class="font-bold text-gray-900">
                    {{ redemption.customer?.firstName }} {{ redemption.customer?.lastName }}
                    <span class="text-[10px] font-mono text-gray-500 font-normal">({{ redemption.promoCode }})</span>
                  </p>
                  <p class="text-[10px] text-gray-400">{{ formatDate(redemption.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">₦{{ (redemption.orderTotal || 0).toLocaleString() }}</p>
                  <p class="text-[10px] text-emerald-600 font-bold">+{{ redemption.rewardAwarded }} {{ redemption.rewardType }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone: Permanent Deletion -->
          <div class="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <Trash2 class="w-3.5 h-3.5 text-rose-600" /> Permanent Account Deletion
              </p>
              <p class="text-[11px] text-rose-700 mt-0.5">Permanently remove this persona, unlink promo codes, and clear platform records.</p>
            </div>
            <button
              type="button"
              @click="confirmDeleteSingle(selectedProfile.profile)"
              class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm shadow-rose-600/30"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>
          </div>

        </div>
      </template>
    </SideDrawer>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- DRAWER 2: PROMO REDEMPTIONS DRAWER                             -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <SideDrawer :isOpen="showRedemptionsDrawer" @close="showRedemptionsDrawer = false; selectedRedemptionPromo = null">
      <template v-if="selectedRedemptionPromo">
        <div class="p-6 border-b border-gray-100 bg-gray-50/60">
          <div class="flex items-center gap-2">
            <span class="text-lg font-mono font-black text-gray-900 bg-white px-3 py-1 rounded-xl border border-gray-200 shadow-sm">
              {{ selectedRedemptionPromo.code }}
            </span>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {{ selectedRedemptionPromo.discountType === 'percentage' ? `${selectedRedemptionPromo.value}% OFF` : `₦${selectedRedemptionPromo.value} OFF` }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-4">
            <div class="bg-white p-3 rounded-xl border border-gray-200">
              <p class="text-[10px] font-bold text-gray-400 uppercase">Total Orders</p>
              <p class="text-base font-black text-gray-900 mt-0.5">{{ selectedRedemptionPromo.usageCount || 0 }}</p>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-200">
              <p class="text-[10px] font-bold text-gray-400 uppercase">Revenue Driven</p>
              <p class="text-base font-black text-gray-900 mt-0.5">₦{{ (selectedRedemptionPromo.totalRevenueGenerated || 0).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">
            Customer Orders Audit Trail ({{ promoRedemptionsList.length }})
          </h4>

          <div v-if="redemptionsLoading" class="py-12 text-center">
            <Loader2 class="w-6 h-6 animate-spin text-[#FF5C1A] mx-auto mb-2" />
            <p class="text-xs text-gray-500 font-medium">Fetching redemption history...</p>
          </div>

          <div v-else-if="promoRedemptionsList.length === 0" class="py-12 text-center text-gray-400">
            <ShoppingBag class="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p class="text-xs font-bold text-gray-900">No Orders Placed Yet</p>
            <p class="text-[11px] text-gray-500">Orders placed with this code will appear here instantly.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="redemption in promoRedemptionsList" :key="redemption._id"
              class="p-3.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-gray-900">
                  {{ redemption.customer?.firstName }} {{ redemption.customer?.lastName }}
                </span>
                <span class="text-xs font-black text-gray-900 tabular-nums">
                  ₦{{ (redemption.orderTotal || 0).toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-gray-400">
                <span>{{ redemption.customer?.email }}</span>
                <span class="font-medium text-emerald-600">Discount: -₦{{ (redemption.discountAmount || 0).toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-200/60">
                <span>{{ formatDate(redemption.createdAt) }}</span>
                <span class="font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                  Referrer Reward: +{{ redemption.rewardAwarded }} {{ redemption.rewardType }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </SideDrawer>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- MODAL 4: CUSTOM CONFIRMATION MODAL BEFORE DELETE               -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteConfirmModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4 overflow-y-auto"
          @click.self="!isDeleting && (showDeleteConfirmModal = false)"
        >
          <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 space-y-5 animate-scale-in">
            <!-- Header with Warning Icon -->
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-sm shadow-rose-100">
                <Trash2 class="w-6 h-6 animate-pulse" />
              </div>
              <div class="space-y-1 min-w-0">
                <h3 class="text-lg font-black text-gray-900 tracking-tight">
                  {{ deleteModalType === 'single' ? `Delete ${itemToDelete?.name || 'Persona'}?` : `Batch Delete ${selectedReferrersList.length} Personas?` }}
                </h3>
                <p class="text-xs text-gray-500 font-medium leading-relaxed">
                  This action is permanent and will completely remove the persona from database records, unlink promo codes, and clear associated performance history.
                </p>
              </div>
            </div>

            <!-- Single Item Preview Details Box -->
            <div v-if="deleteModalType === 'single' && itemToDelete" class="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border"
                  :class="personaBadgeTheme(itemToDelete.role).avatarClass">
                  {{ itemToDelete.name?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-gray-900 truncate">{{ itemToDelete.name }}</p>
                    <span class="text-[9px] font-black px-1.5 py-0.5 rounded border uppercase"
                      :class="personaBadgeTheme(itemToDelete.role).tagClass">
                      {{ personaBadgeTheme(itemToDelete.role).emoji }} {{ personaBadgeTheme(itemToDelete.role).label }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 truncate">{{ itemToDelete.email }}</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-rose-100/60 text-gray-600">
                <div>
                  <span class="text-[10px] uppercase font-bold text-gray-400">Ref Code:</span>
                  <span class="font-mono font-bold text-gray-900 ml-1">{{ itemToDelete.referralCode || 'None' }}</span>
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-gray-400">Referrals:</span>
                  <span class="font-bold text-gray-900 ml-1">{{ itemToDelete.totalReferrals || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Batch Items Preview Box -->
            <div v-else-if="deleteModalType === 'batch'" class="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-rose-800">
                <span>Selected for deletion:</span>
                <span class="bg-rose-100 px-2 py-0.5 rounded-full">{{ selectedReferrersList.length }} items</span>
              </div>
              <div class="max-h-36 overflow-y-auto divide-y divide-rose-100/70 pr-1 space-y-1.5">
                <div v-for="item in selectedReferrersList" :key="`${item.type}-${item._id}`" class="flex items-center justify-between text-xs pt-1.5">
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-xs">{{ personaBadgeTheme(item.role).emoji }}</span>
                    <span class="font-bold text-gray-900 truncate">{{ item.name }}</span>
                    <span class="text-[10px] text-gray-400">({{ item.referralCode }})</span>
                  </div>
                  <span class="text-[9px] font-bold text-rose-600 shrink-0 uppercase">{{ personaBadgeTheme(item.role).label.split(' ')[0] }}</span>
                </div>
              </div>
            </div>

            <!-- Error Message Display -->
            <div v-if="deleteError" class="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-medium">
              {{ deleteError }}
            </div>

            <!-- Modal Footer Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                :disabled="isDeleting"
                @click="showDeleteConfirmModal = false"
                class="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                :disabled="isDeleting"
                @click="executeDelete"
                class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
              >
                <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
                <span>{{ isDeleting ? 'Deleting...' : (deleteModalType === 'single' ? 'Yes, Delete Permanently' : `Yes, Delete ${selectedReferrersList.length} Personas`) }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { referrals_api } from '@/api_factory/modules/referrals'
import { promos_api } from '@/api_factory/modules/promos'
import { admin_api } from '@/api_factory/modules/admin'
import { useCustomToast } from '@/composables/core/useCustomToast'
import SideDrawer from '@/components/ui/SideDrawer.vue'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import SearchableMultiSelect from '@/components/ui/SearchableMultiSelect.vue'
import {
  Gift, Users, UserPlus, UserCheck, Trophy, Search,
  TrendingUp, Loader2, Star, X, Tag, Plus, Check, Copy,
  RefreshCw, BarChart3, ShoppingBag, Bike, Store, GraduationCap, Sparkles, ChevronRight,
  Trash2, AlertTriangle
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Referrals & Affiliates Hub - Errander Admin' })

const { showToast } = useCustomToast()

// ─── Dropdown Options ────────────────────────────────────────────

const discountTypeOptions = [
  { value: 'percentage', label: 'Percentage (%)', emoji: '%' },
  { value: 'flat', label: 'Flat Amount (₦)', emoji: '₦' },
]

const rewardTypeOptions = [
  { value: 'points', label: 'Reward Points', emoji: '⭐' },
  { value: 'wallet_credit', label: 'Wallet Credit (₦)', emoji: '💳' },
]

const personaDropdownOptions = [
  { value: 'staff', label: 'Erranders Staffs or internal team', emoji: '👔', sublabel: 'Internal team & system operators' },
  { value: 'vendor', label: 'Vendors', emoji: '🏪', sublabel: 'Registered merchants and store owners' },
  { value: 'errander', label: 'Errand Ninjas', emoji: '🛵', sublabel: 'Delivery riders & dispatchers' },
  { value: 'student', label: 'Customers/Students', emoji: '🎓', sublabel: 'Campus students & app shoppers' },
  { value: 'facilitator', label: 'Ambassadors', emoji: '💎', sublabel: 'Campus leads & affiliate ambassadors' },
]

// ─── Batch Selection & Deletion State ─────────────────────────────

const selectedReferrerKeys = ref<Set<string>>(new Set())
const showDeleteConfirmModal = ref(false)
const deleteModalType = ref<'single' | 'batch'>('single')
const itemToDelete = ref<any>(null)
const isDeleting = ref(false)
const deleteError = ref('')

const isSelected = (referrer: any) => {
  return selectedReferrerKeys.value.has(`${referrer.type}:${referrer._id}`)
}

const toggleSelect = (referrer: any) => {
  const key = `${referrer.type}:${referrer._id}`
  if (selectedReferrerKeys.value.has(key)) {
    selectedReferrerKeys.value.delete(key)
  } else {
    selectedReferrerKeys.value.add(key)
  }
}

const isAllSelected = computed(() => {
  if (filteredReferrers.value.length === 0) return false
  return filteredReferrers.value.every(r => selectedReferrerKeys.value.has(`${r.type}:${r._id}`))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedReferrerKeys.value.clear()
  } else {
    filteredReferrers.value.forEach(r => selectedReferrerKeys.value.add(`${r.type}:${r._id}`))
  }
}

const clearSelection = () => {
  selectedReferrerKeys.value.clear()
}

const selectedReferrersList = computed(() => {
  return referrers.value.filter(r => selectedReferrerKeys.value.has(`${r.type}:${r._id}`))
})

const confirmDeleteSingle = (referrer: any) => {
  deleteModalType.value = 'single'
  itemToDelete.value = referrer
  deleteError.value = ''
  showDeleteConfirmModal.value = true
}

const confirmDeleteBatch = () => {
  if (selectedReferrersList.value.length === 0) return
  deleteModalType.value = 'batch'
  itemToDelete.value = null
  deleteError.value = ''
  showDeleteConfirmModal.value = true
}

const executeDelete = async () => {
  isDeleting.value = true
  deleteError.value = ''
  try {
    if (deleteModalType.value === 'single' && itemToDelete.value) {
      await referrals_api.deleteReferrer(itemToDelete.value.type, itemToDelete.value._id)
      showToast({
        title: 'Deleted Successfully',
        message: `${itemToDelete.value.name} has been permanently deleted`,
        toastType: 'success'
      })
      if (selectedProfile.value && (selectedProfile.value.profile?._id === itemToDelete.value._id || selectedProfile.value._id === itemToDelete.value._id)) {
        showProfileDrawer.value = false
      }
      selectedReferrerKeys.value.delete(`${itemToDelete.value.type}:${itemToDelete.value._id}`)
    } else if (deleteModalType.value === 'batch') {
      const items = selectedReferrersList.value.map(r => ({ type: r.type, id: r._id }))
      await referrals_api.batchDeleteReferrers(items)
      showToast({
        title: 'Batch Delete Completed',
        message: `Permanently deleted ${items.length} records across personas`,
        toastType: 'success'
      })
      clearSelection()
    }
    showDeleteConfirmModal.value = false
    await refreshAll()
  } catch (err: any) {
    deleteError.value = err?.response?.data?.message || err?.message || 'Failed to delete. Please try again.'
    showToast({
      title: 'Deletion Failed',
      message: deleteError.value,
      toastType: 'error'
    })
  } finally {
    isDeleting.value = false
  }
}

// ─── State ───────────────────────────────────────────────────────

const activeMainTab = ref<'referrers' | 'referralPromos' | 'referrals' | 'leaderboard'>('referrers')
const isRefreshing = ref(false)

// Stats
const statsLoading = ref(true)
const statsData = ref<any>(null)

// Unified Referrers
const referrers = ref<any[]>([])
const referrersLoading = ref(true)
const selectedPersona = ref<string>('all')
const referrerSearch = ref('')

// Referral Promo Codes
const referralPromos = ref<any[]>([])
const promosLoading = ref(true)
const selectedPromoPersona = ref<string>('all')
const promoSearch = ref('')

// All Referrals Log
const referralData = ref<any>(null)
const referralsLoading = ref(false)
const referralPage = ref(1)

// Leaderboard
const leaderboard = ref<any[]>([])
const leaderboardLoading = ref(false)
const selectedLeaderboardRole = ref('all')

// Dependencies for selection (Users, Vendors, Facilitators)
const rawUsers = ref<any[]>([])
const rawVendors = ref<any[]>([])
const rawFacilitators = ref<any[]>([])

// Create Promo Modal
const showPromoModal = ref(false)
const creatingPromo = ref(false)
const promoError = ref('')
const promoForm = reactive({
  targetRole: 'errander',
  selectedPersonId: '',
  code: '',
  discountType: 'percentage',
  value: 10,
  maxDiscountAmount: 0,
  minOrderAmount: 0,
  maxUsageCount: 0,
  maxUsagePerUser: 1,
  expiresAt: '',
  rewardType: 'points',
  rewardPerUse: 50,
  onlyForNewUsers: false,
  appliesToDeliveryFeeOnly: false,
  applicableOrderTypes: [] as string[],
  applicableVendors: [] as string[],
  applicableUsers: [] as string[],
})

// Add Staff / Internal Team Modal
const showAddStaffModal = ref(false)
const addingStaff = ref(false)
const addStaffError = ref('')
const newStaff = reactive({
  name: '',
  email: '',
  phone: '',
  department: '',
  referralCode: '',
})

// Add Ambassador Modal
const showAddFacModal = ref(false)
const addingFac = ref(false)
const addFacError = ref('')
const newFac = reactive({
  name: '',
  email: '',
  phone: '',
  matricNumber: '',
  skill: '',
  referralCode: '',
  sendWelcomeEmail: true,
})

// Assign Custom Code Modal
const showCustomCodeModal = ref(false)
const assigningCode = ref(false)
const customCodeError = ref('')
const customCodeForm = reactive({
  targetRole: 'errander',
  targetId: '',
  code: '',
})

// 360° Profile Drawer
const showProfileDrawer = ref(false)
const profileLoading = ref(false)
const selectedProfile = ref<any>(null)

// Promo Redemptions Drawer
const showRedemptionsDrawer = ref(false)
const redemptionsLoading = ref(false)
const selectedRedemptionPromo = ref<any>(null)
const promoRedemptionsList = ref<any[]>([])

// ─── Tabs Configuration ──────────────────────────────────────────

const mainTabs = computed(() => [
  { key: 'referrers', label: 'All Referrers', icon: Users, badge: referrers.value.length },
  { key: 'referralPromos', label: 'Referral Promo Codes', icon: Tag, badge: referralPromos.value.length },
  { key: 'referrals', label: 'All Referrals Audit', icon: Gift },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
])

const personaFilters = [
  { key: 'all', label: 'All Personas', emoji: '👥' },
  { key: 'staff', label: 'Erranders Staffs or internal team', emoji: '👔' },
  { key: 'vendor', label: 'Vendors', emoji: '🏪' },
  { key: 'errander', label: 'Errand Ninjas', emoji: '🛵' },
  { key: 'student', label: 'Customers/Students', emoji: '🎓' },
  { key: 'facilitator', label: 'Ambassadors', emoji: '💎' },
]

const promoPersonaFilters = [
  { key: 'all', label: 'All Affiliates', emoji: '👥' },
  { key: 'staff', label: 'Erranders Staffs or internal team', emoji: '👔' },
  { key: 'vendor', label: 'Vendors', emoji: '🏪' },
  { key: 'errander', label: 'Errand Ninjas', emoji: '🛵' },
  { key: 'student', label: 'Customers/Students', emoji: '🎓' },
  { key: 'facilitator', label: 'Ambassadors', emoji: '💎' },
]

const leaderboardFilters = [
  { key: 'all', label: 'All' },
  { key: 'staff', label: 'Staff / Internal' },
  { key: 'vendor', label: 'Vendors' },
  { key: 'errander', label: 'Errand Ninjas' },
  { key: 'student', label: 'Customers/Students' },
  { key: 'facilitator', label: 'Ambassadors' },
]

// ─── Computed Filters & Options ──────────────────────────────────

const filteredReferrers = computed(() => {
  return referrers.value.filter(r => {
    // Persona filter
    if (selectedPersona.value !== 'all') {
      if (selectedPersona.value === 'staff') {
        if (r.role !== 'staff' && r.role !== 'admin') return false
      } else if (r.role !== selectedPersona.value) {
        return false
      }
    }
    // Search filter
    if (referrerSearch.value) {
      const q = referrerSearch.value.toLowerCase()
      const matches = (
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.referralCode?.toLowerCase().includes(q)
      )
      if (!matches) return false
    }
    return true
  })
})

const filteredReferralPromos = computed(() => {
  return referralPromos.value.filter(p => {
    if (selectedPromoPersona.value !== 'all') {
      if (selectedPromoPersona.value === 'staff') {
        if (p.referrerType !== 'staff' && p.referrerType !== 'admin') return false
      } else if (p.referrerType !== selectedPromoPersona.value) {
        return false
      }
    }
    if (promoSearch.value) {
      const q = promoSearch.value.toLowerCase()
      const ownerName = getPromoOwnerName(p).toLowerCase()
      const matches = p.code?.toLowerCase().includes(q) || ownerName.includes(q)
      if (!matches) return false
    }
    return true
  })
})

const personOptions = computed(() => {
  if (promoForm.targetRole === 'facilitator') {
    return rawFacilitators.value.map(f => ({
      label: `${f.name} (${f.email})`,
      value: f._id,
      sublabel: `Ambassador • Code: ${f.referralCode || 'None'}`,
    }))
  }
  if (promoForm.targetRole === 'vendor') {
    return rawVendors.value.map(v => ({
      label: v.storeName || v.businessName || v.name || v.email,
      value: v.userId || v._id,
      sublabel: `Vendor • ${v.email}`,
    }))
  }
  if (promoForm.targetRole === 'staff') {
    const staffUsers = rawUsers.value.filter(u => u.role === 'admin' || u.role === 'staff')
    return staffUsers.map(u => ({
      label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      value: u._id,
      sublabel: `Staff / Internal • ${u.email}`,
    }))
  }
  // Users (Errander or Student)
  const filteredUsers = rawUsers.value.filter(u => u.role === promoForm.targetRole)
  return filteredUsers.map(u => ({
    label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    value: u._id,
    sublabel: `${u.role === 'errander' ? 'Errand Ninja' : 'Customer/Student'} • ${u.email}`,
  }))
})

const personOptionsForCustomCode = computed(() => {
  if (customCodeForm.targetRole === 'facilitator') {
    return rawFacilitators.value.map(f => ({
      label: `${f.name} (${f.email})`,
      value: f._id,
    }))
  }
  if (customCodeForm.targetRole === 'vendor') {
    return rawVendors.value.map(v => ({
      label: v.storeName || v.businessName || v.name || v.email,
      value: v.userId || v._id,
    }))
  }
  if (customCodeForm.targetRole === 'staff') {
    const staffUsers = rawUsers.value.filter(u => u.role === 'admin' || u.role === 'staff')
    return staffUsers.map(u => ({
      label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      value: u._id,
    }))
  }
  const filteredUsers = rawUsers.value.filter(u => u.role === customCodeForm.targetRole)
  return filteredUsers.map(u => ({
    label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
    value: u._id,
  }))
})

const orderTypeOptions = [
  { value: 'inside_campus', label: 'Inside Campus Delivery', emoji: '🏫', sublabel: 'Deliveries strictly within university campus grounds' },
  { value: 'outside_campus', label: 'Outside Campus Delivery', emoji: '🏙️', sublabel: 'Off-campus errands and town delivery locations' },
  { value: 'custom_errand', label: 'Custom Errand / Runner Task', emoji: '⚡', sublabel: 'Personalized customer errand requests' },
  { value: 'group_order', label: 'Group Orders', emoji: '👥', sublabel: 'Pooled multi-order grocery & restaurant deliveries' },
]

const vendorMultiSelectOptions = computed(() => {
  return rawVendors.value.map(v => ({
    value: v._id || v.userId,
    label: v.storeName || v.businessName || v.name || 'Store',
    sublabel: `${v.email || ''} ${v.phone ? '• ' + v.phone : ''}`.trim(),
    emoji: '🏪'
  }))
})

const customerMultiSelectOptions = computed(() => {
  return rawUsers.value
    .filter(u => u.role === 'student' || u.role === 'customer' || !u.role)
    .map(u => ({
      value: u._id,
      label: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
      sublabel: `${u.email} ${u.phone ? '• ' + u.phone : ''}`.trim(),
      emoji: '🎓'
    }))
})

// ─── Fetchers ────────────────────────────────────────────────────

const fetchStats = async () => {
  statsLoading.value = true
  try {
    const res = await referrals_api.getStats()
    statsData.value = res.data || {}
  } catch (e) {
    console.error('Stats fetch error', e)
  } finally {
    statsLoading.value = false
  }
}

const fetchReferrers = async () => {
  referrersLoading.value = true
  try {
    const res = await referrals_api.getAllReferrers({ role: 'all', limit: 300 })
    referrers.value = res.data?.referrers || []
  } catch (e) {
    console.error('Referrers fetch error', e)
  } finally {
    referrersLoading.value = false
  }
}

const fetchReferralPromos = async () => {
  promosLoading.value = true
  try {
    const res = await promos_api.getReferralPromos()
    referralPromos.value = res.data || []
  } catch (e) {
    console.error('Referral promos fetch error', e)
  } finally {
    promosLoading.value = false
  }
}

const fetchReferrals = async () => {
  referralsLoading.value = true
  try {
    const res = await referrals_api.getAllReferrals({ page: referralPage.value, limit: 50 })
    referralData.value = res.data || {}
  } catch (e) {
    console.error('Referrals audit fetch error', e)
  } finally {
    referralsLoading.value = false
  }
}

const fetchLeaderboard = async () => {
  leaderboardLoading.value = true
  try {
    const res = await referrals_api.getLeaderboard(30, selectedLeaderboardRole.value)
    leaderboard.value = res.data || []
  } catch (e) {
    console.error('Leaderboard fetch error', e)
  } finally {
    leaderboardLoading.value = false
  }
}

const fetchDependencies = async () => {
  try {
    const [usersRes, vendorsRes, facRes] = await Promise.all([
      admin_api.getUsers(),
      admin_api.getVendors(),
      referrals_api.getFacilitators({ active: 'true' }),
    ])
    rawUsers.value = usersRes.data?.users || usersRes.data || []
    rawVendors.value = vendorsRes.data?.vendors || vendorsRes.data || []
    rawFacilitators.value = facRes.data || []
  } catch (e) {
    console.error('Dependencies fetch error', e)
  }
}

const refreshAll = async () => {
  isRefreshing.value = true
  await Promise.all([
    fetchStats(),
    fetchReferrers(),
    fetchReferralPromos(),
    fetchDependencies(),
  ])
  if (activeMainTab.value === 'referrals') fetchReferrals()
  if (activeMainTab.value === 'leaderboard') fetchLeaderboard()
  isRefreshing.value = false
  showToast({ title: 'Refreshed', message: 'Referral engine data updated', toastType: 'success' })
}

// ─── Actions: Promo Codes ────────────────────────────────────────

const openCreatePromoModal = () => {
  promoError.value = ''
  promoForm.targetRole = 'errander'
  promoForm.selectedPersonId = ''
  promoForm.code = ''
  promoForm.discountType = 'percentage'
  promoForm.value = 10
  promoForm.minOrderAmount = 0
  promoForm.maxDiscountAmount = 0
  promoForm.maxUsageCount = 0
  promoForm.maxUsagePerUser = 1
  promoForm.expiresAt = ''
  promoForm.rewardType = 'points'
  promoForm.rewardPerUse = 50
  promoForm.onlyForNewUsers = false
  promoForm.appliesToDeliveryFeeOnly = false
  promoForm.applicableOrderTypes = []
  promoForm.applicableVendors = []
  promoForm.applicableUsers = []
  showPromoModal.value = true
}

const quickAssignPromo = (person: any) => {
  promoError.value = ''
  promoForm.targetRole = person.role || (person.type === 'facilitator' ? 'facilitator' : 'student')
  promoForm.selectedPersonId = person._id
  suggestCodeString(person.name)
  promoForm.discountType = 'percentage'
  promoForm.value = 10
  promoForm.minOrderAmount = 0
  promoForm.maxDiscountAmount = 0
  promoForm.maxUsageCount = 0
  promoForm.maxUsagePerUser = 1
  promoForm.expiresAt = ''
  promoForm.rewardType = 'points'
  promoForm.rewardPerUse = 50
  promoForm.onlyForNewUsers = false
  promoForm.appliesToDeliveryFeeOnly = false
  promoForm.applicableOrderTypes = []
  promoForm.applicableVendors = []
  promoForm.applicableUsers = []
  showPromoModal.value = true
}

const onSelectPromoPersona = (role: string) => {
  promoForm.targetRole = role
  promoForm.selectedPersonId = ''
  suggestCodeString()
}

const onPersonSelected = (val: string) => {
  const selected = personOptions.value.find(o => o.value === val)
  if (selected) {
    suggestCodeString(selected.label)
  }
}

const suggestCodeString = (nameInput?: string) => {
  const rolePrefix = promoForm.targetRole === 'staff'
    ? 'STAFF'
    : promoForm.targetRole === 'vendor'
      ? 'VENDOR'
      : promoForm.targetRole === 'errander' 
        ? 'NINJA' 
        : promoForm.targetRole === 'student'
          ? 'CUST'
          : 'AMB'

  let base = 'AFF'
  if (nameInput) {
    base = nameInput.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6)
  }
  const suffix = Math.floor(10 + Math.random() * 90)
  promoForm.code = `${rolePrefix}-${base}${suffix}`
}

const handleCreatePromo = async () => {
  if (!promoForm.selectedPersonId) {
    promoError.value = 'Please select a beneficiary person or store'
    return
  }
  if (!promoForm.code) {
    promoError.value = 'Promo code string is required'
    return
  }

  creatingPromo.value = true
  promoError.value = ''
  try {
    const payload: any = {
      code: promoForm.code.trim().toUpperCase(),
      discountType: promoForm.discountType,
      value: Number(promoForm.value),
      rewardType: promoForm.rewardType,
      rewardPerUse: Number(promoForm.rewardPerUse) || 0,
      minOrderAmount: Number(promoForm.minOrderAmount) || null,
      maxDiscountAmount: Number(promoForm.maxDiscountAmount) || null,
      maxUsageCount: Number(promoForm.maxUsageCount) || null,
      maxUsagePerUser: Number(promoForm.maxUsagePerUser) || null,
      expiresAt: promoForm.expiresAt ? new Date(promoForm.expiresAt) : null,
      onlyForNewUsers: !!promoForm.onlyForNewUsers,
      appliesToDeliveryFeeOnly: !!promoForm.appliesToDeliveryFeeOnly,
      applicableOrderTypes: promoForm.applicableOrderTypes || [],
      applicableVendors: promoForm.applicableVendors || [],
      applicableUsers: promoForm.applicableUsers || [],
      isReferralPromo: true,
      referrerType: promoForm.targetRole,
    }

    if (promoForm.targetRole === 'facilitator') {
      payload.referrerFacilitator = promoForm.selectedPersonId
    } else {
      payload.referrerUser = promoForm.selectedPersonId
    }

    await promos_api.createPromoCode(payload)
    showToast({
      title: 'Promo Created! 🚀',
      message: `Referral promo code ${payload.code} is now live and tracked`,
      toastType: 'success'
    })

    showPromoModal.value = false
    fetchReferralPromos()
    fetchReferrers()
    fetchStats()
  } catch (e: any) {
    promoError.value = e?.response?.data?.message || 'Failed to create promo code'
  } finally {
    creatingPromo.value = false
  }
}

const togglePromoStatus = async (promo: any) => {
  try {
    const res = await promos_api.togglePromoStatus(promo._id)
    promo.isActive = res.data.isActive
    showToast({
      title: 'Status Updated',
      message: `Promo code ${promo.code} is now ${promo.isActive ? 'active' : 'paused'}`,
      toastType: 'success'
    })
  } catch (e: any) {
    showToast({ title: 'Error', message: 'Failed to update promo status', toastType: 'error' })
  }
}

// ─── Actions: Staff / Internal Team ──────────────────────────────

const handleAddStaff = async () => {
  if (!newStaff.name?.trim()) {
    addStaffError.value = 'Full name is compulsory'
    return
  }
  addStaffError.value = ''
  addingStaff.value = true
  try {
    const payload = {
      name: newStaff.name.trim(),
      email: newStaff.email?.trim() || undefined,
      phone: newStaff.phone?.trim() || undefined,
      department: newStaff.department?.trim() || undefined,
      referralCode: newStaff.referralCode?.trim()?.toUpperCase() || undefined,
    }
    const res = await referrals_api.createStaff(payload)
    if (res?.type === 'ERROR') throw res
    showToast({
      title: 'Staff Member Added!',
      message: `${newStaff.name} has been registered to Erranders internal team.`,
      toastType: 'success'
    })
    showAddStaffModal.value = false
    Object.assign(newStaff, { name: '', email: '', phone: '', department: '', referralCode: '' })
    fetchReferrers()
    fetchStats()
    fetchDependencies()
  } catch (e: any) {
    addStaffError.value = e?.response?.data?.message || 'Failed to add staff member'
  } finally {
    addingStaff.value = false
  }
}

// ─── Actions: Ambassador / Facilitator ───────────────────────────

const handleAddFacilitator = async () => {
  if (!newFac.name?.trim()) {
    addFacError.value = 'Full name is compulsory'
    return
  }
  addFacError.value = ''
  addingFac.value = true
  try {
    const payload = {
      name: newFac.name.trim(),
      email: newFac.email?.trim() || undefined,
      phone: newFac.phone?.trim() || undefined,
      matricNumber: newFac.matricNumber?.trim() || undefined,
      skill: newFac.skill?.trim() || undefined,
      referralCode: newFac.referralCode?.trim()?.toUpperCase() || undefined,
      sendWelcomeEmail: newFac.email ? newFac.sendWelcomeEmail : false,
    }
    const res = await referrals_api.createFacilitator(payload)
    if (res?.type === 'ERROR') throw res
    showToast({
      title: 'Ambassador Registered!',
      message: `${newFac.name} has been added and code generated.`,
      toastType: 'success'
    })
    showAddFacModal.value = false
    Object.assign(newFac, { name: '', email: '', phone: '', matricNumber: '', skill: '', referralCode: '', sendWelcomeEmail: true })
    fetchReferrers()
    fetchStats()
    fetchDependencies()
  } catch (e: any) {
    addFacError.value = e?.response?.data?.message || 'Failed to create ambassador'
  } finally {
    addingFac.value = false
  }
}

// ─── Actions: Custom Code Assignment ─────────────────────────────

const openCustomCodeModal = () => {
  customCodeError.value = ''
  customCodeForm.targetRole = 'errander'
  customCodeForm.targetId = ''
  customCodeForm.code = ''
  showCustomCodeModal.value = true
}

const onSelectCustomCodePersona = (role: string) => {
  customCodeForm.targetRole = role
  customCodeForm.targetId = ''
}

const handleAssignCustomCode = async () => {
  if (!customCodeForm.targetId) {
    customCodeError.value = 'Please select a recipient'
    return
  }

  assigningCode.value = true
  customCodeError.value = ''
  try {
    const payload = {
      type: customCodeForm.targetRole === 'facilitator' ? ('facilitator' as const) : ('user' as const),
      id: customCodeForm.targetId,
      customCode: customCodeForm.code ? customCodeForm.code.trim().toUpperCase() : undefined,
    }
    const res = await referrals_api.generateCode(payload)
    showToast({
      title: 'Referral Code Assigned',
      message: `Referral code ${res.data?.referralCode || 'updated'} is active.`,
      toastType: 'success'
    })
    showCustomCodeModal.value = false
    fetchReferrers()
  } catch (e: any) {
    customCodeError.value = e?.response?.data?.message || 'Failed to assign referral code'
  } finally {
    assigningCode.value = false
  }
}

// ─── Drawers: Profile & Redemptions ──────────────────────────────

const openReferrerProfile = async (referrer: any) => {
  showProfileDrawer.value = true
  profileLoading.value = true
  try {
    const res = await referrals_api.getReferrerProfile(referrer.type, referrer._id)
    selectedProfile.value = res.data || null
  } catch (e) {
    console.error('Failed to load profile', e)
    showToast({ title: 'Error', message: 'Failed to load profile', toastType: 'error' })
  } finally {
    profileLoading.value = false
  }
}

const openRedemptionsDrawer = async (promo: any) => {
  selectedRedemptionPromo.value = promo
  showRedemptionsDrawer.value = true
  redemptionsLoading.value = true
  try {
    const res = await promos_api.getPromoRedemptions(promo._id)
    promoRedemptionsList.value = res.data?.redemptions || []
  } catch (e) {
    console.error('Failed to load redemptions', e)
    promoRedemptionsList.value = []
  } finally {
    redemptionsLoading.value = false
  }
}

// ─── Utility Helpers ─────────────────────────────────────────────

const personaBadgeTheme = (role: string) => {
  switch (role) {
    case 'staff':
    case 'admin':
      return {
        label: 'Erranders Staffs or internal team',
        emoji: '👔',
        tagClass: 'bg-amber-50 text-amber-800 border-amber-300',
        avatarClass: 'bg-amber-50 text-amber-700 border-amber-200',
      }
    case 'vendor':
      return {
        label: 'Vendors',
        emoji: '🏪',
        tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        avatarClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      }
    case 'errander':
      return {
        label: 'Errand Ninjas',
        emoji: '🛵',
        tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
        avatarClass: 'bg-blue-50 text-blue-600 border-blue-200',
      }
    case 'student':
      return {
        label: 'Customers/Students',
        emoji: '🎓',
        tagClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        avatarClass: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      }
    case 'facilitator':
      return {
        label: 'Ambassadors',
        emoji: '💎',
        tagClass: 'bg-purple-50 text-purple-700 border-purple-200',
        avatarClass: 'bg-purple-50 text-purple-600 border-purple-200',
      }
    default:
      return {
        label: 'Affiliate',
        emoji: '👤',
        tagClass: 'bg-gray-50 text-gray-700 border-gray-200',
        avatarClass: 'bg-gray-100 text-gray-700 border-gray-200',
      }
  }
}

const tierEmoji = (tier: string) => ({ starter: '🌱', hustler: '🔥', ambassador: '💎', legend: '👑' }[tier] || '🌱')

const tierBadgeClass = (tier: string) => ({
  starter: 'bg-gray-50 text-gray-600 border-gray-200',
  hustler: 'bg-orange-50 text-orange-700 border-orange-200',
  ambassador: 'bg-purple-50 text-purple-700 border-purple-200',
  legend: 'bg-amber-50 text-amber-700 border-amber-200',
}[tier] || 'bg-gray-50 text-gray-600 border-gray-200')

const getPromoOwnerName = (promo: any) => {
  if (promo.referrerFacilitator) return promo.referrerFacilitator.name
  if (promo.referrerUser) {
    return `${promo.referrerUser.firstName || ''} ${promo.referrerUser.lastName || ''}`.trim() || promo.referrerUser.email
  }
  return 'Platform / General'
}

const getReferrerName = (ref: any) => {
  if (ref.facilitatorReferrer) return ref.facilitatorReferrer.name
  if (ref.referrer) return `${ref.referrer.firstName} ${ref.referrer.lastName}`
  return 'Unknown Referrer'
}

const copyText = (text: string, successMsg: string) => {
  if (!text) return
  navigator.clipboard.writeText(text)
  showToast({ title: 'Copied', message: successMsg, toastType: 'success' })
}

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Watchers ────────────────────────────────────────────────────

watch(activeMainTab, (tab) => {
  if (tab === 'referralPromos' && referralPromos.value.length === 0) fetchReferralPromos()
  if (tab === 'referrals' && !referralData.value) fetchReferrals()
  if (tab === 'leaderboard' && leaderboard.value.length === 0) fetchLeaderboard()
})

// ─── Lifecycle ───────────────────────────────────────────────────

onMounted(() => {
  fetchStats()
  fetchReferrers()
  fetchReferralPromos()
  fetchDependencies()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
