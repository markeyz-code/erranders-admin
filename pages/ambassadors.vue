<template>
  <div class="space-y-6 animate-fade-in pb-24">
    <!-- Header & Action Row -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2.5 flex-wrap">
          <h1 class="text-2xl font-black text-gray-900 font-heading tracking-tight">Ambassadors & Referral Tracking</h1>
          <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FF5C1A]/10 text-[#FF5C1A] border border-[#FF5C1A]/20">
            <Sparkles class="w-3.5 h-3.5" /> Full Spend & Order Visibility
          </span>
        </div>
        <p class="text-sm text-gray-500">
          Monitor ambassador activities, signup referral codes, trackable promo code usage, referred people, orders made, and exact platform spend.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <button
          @click="loadData"
          :disabled="loading"
          class="flex items-center gap-2 px-3.5 h-10 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>

        <button
          @click="exportCsv"
          :disabled="!rows.length"
          class="flex items-center gap-2 px-3.5 h-10 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50"
        >
          <Download class="w-3.5 h-3.5 text-gray-500" />
          Export CSV
        </button>

        <NuxtLink
          to="/referrals"
          class="flex items-center gap-2 px-4 h-10 bg-[#FF5C1A] text-white rounded-xl font-bold text-xs hover:bg-[#e04f14] transition-all shadow-sm shadow-[#FF5C1A]/20"
        >
          <Gift class="w-3.5 h-3.5" />
          Manage Referrals & Promo Codes
        </NuxtLink>
      </div>
    </div>

    <!-- 6-Grid Real-Time KPI Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <!-- 1. Campus Ambassadors -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
            💎
          </div>
          <span class="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Ambassadors</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Campus Leads</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData.totalAmbassadors || 0).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">
          {{ statsData.activeAmbassadors || 0 }} active on campus
        </p>
      </div>

      <!-- 2. Total Reffered People -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
            👥
          </div>
          <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Acquired</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Referred People</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData.totalReferredPeople || totalReferredCount).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">
          {{ statsData.personaBreakdown?.student || 0 }}s · {{ statsData.personaBreakdown?.vendor || 0 }}v · {{ statsData.personaBreakdown?.errander || 0 }}r
        </p>
      </div>

      <!-- 3. Paid Orders Placed -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
            🛒
          </div>
          <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Orders</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Orders Driven</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData.totalOrdersFromReferrals || totalOrdersPlacedCount).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-emerald-600 mt-1 font-bold truncate">
          {{ statsData.payingReferredUsers || activePayingCustomersCount }} paying customers
        </p>
      </div>

      <!-- 4. Total Platform Spend Driven -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center font-bold text-base">
            💰
          </div>
          <span class="text-[10px] font-bold text-[#FF5C1A] bg-orange-50 px-1.5 py-0.5 rounded">Revenue</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Total Spend Driven</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          ₦{{ statsLoading ? '...' : (statsData.totalSpendFromReferrals || totalSpendDrivenAmount).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">gross customer spend</p>
      </div>

      <!-- 5. Promo Code Redemptions -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base">
            🏷️
          </div>
          <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Promos</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Promo Orders</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData.totalPromoRedemptions || totalPromoUsesCount).toLocaleString() }}
        </h3>
        <p class="text-[10px] text-amber-700 mt-1 font-bold truncate">
          ₦{{ (statsData.totalPromoDiscountsGiven || totalDiscountsGivenAmount).toLocaleString() }} off
        </p>
      </div>

      <!-- 6. Conversion Rate -->
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-sm transition-all">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base">
            📈
          </div>
          <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Conversion</span>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">Conversion Rate</p>
        <h3 class="text-xl font-black text-gray-900 mt-0.5 tabular-nums">
          {{ statsLoading ? '...' : (statsData.conversionRate || platformConversionRate) }}%
        </h3>
        <p class="text-[10px] text-gray-400 mt-1 font-medium truncate">signups to paid orders</p>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
      <!-- Persona Tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="tab in personaTabs"
          :key="tab.value"
          @click="selectPersona(tab.value)"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
          :class="selectedPersona === tab.value
            ? 'bg-gray-900 text-white shadow-sm'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'"
        >
          <span>{{ tab.emoji }}</span>
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count !== undefined"
            class="text-[10px] px-1.5 py-0.2 rounded-full font-black"
            :class="selectedPersona === tab.value ? 'bg-white/20 text-white' : 'bg-gray-200/70 text-gray-700'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search, Activity Filter, and Sorting Controls -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <!-- Live Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, email, referral code, or promo code..."
            class="w-full pl-9 pr-8 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] placeholder:text-gray-400"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Activity Filter -->
          <div class="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100 text-xs">
            <button
              v-for="act in activityFilters"
              :key="act.value"
              @click="selectedActivity = act.value"
              class="px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors"
              :class="selectedActivity === act.value ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'"
            >
              {{ act.label }}
            </button>
          </div>

          <!-- Sort Select -->
          <div class="relative">
            <select
              v-model="selectedSort"
              class="appearance-none bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
            >
              <option value="spend_desc">Highest Spend Driven (₦)</option>
              <option value="orders_desc">Most Orders Placed</option>
              <option value="referrals_desc">Most People Referred</option>
              <option value="conversion_desc">Highest Conversion Rate</option>
              <option value="promo_desc">Most Promo Redemptions</option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-2xs">
      <Loader2 class="w-8 h-8 animate-spin text-[#FF5C1A] mx-auto mb-3" />
      <p class="text-sm font-bold text-gray-800">Loading Ambassadors & Referrals...</p>
      <p class="text-xs text-gray-400 mt-1">Aggregating signup codes, promo redemptions, and customer spend...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!processedRows.length" class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-16 text-center">
      <div class="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center mx-auto mb-3 text-xl font-bold">
        💎
      </div>
      <p class="text-sm font-bold text-gray-900">No Ambassadors or Referrers Found</p>
      <p class="mx-auto mt-1 max-w-md text-xs text-gray-500">
        {{ searchQuery ? `No matches for "${searchQuery}". Try adjusting your search query or filter.` : 'Add facilitators with referral codes or assign promo codes to see their sign-ups, orders, and spend here.' }}
      </p>
      <button
        v-if="searchQuery"
        @click="searchQuery = ''; selectedPersona = 'all'; selectedActivity = 'all'"
        class="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
      >
        Reset Filters
      </button>
    </div>

    <!-- Main Ambassadors & Referrers Table -->
    <div v-else class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xs">
      <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-black text-gray-900">Referrer Directory</h3>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {{ processedRows.length }} shown
          </span>
        </div>
        <p class="text-xs text-gray-400">Click "Referred People & Spend" to drill down into individual customer orders</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
            <tr>
              <th class="px-4 py-3.5">Referrer</th>
              <th class="px-4 py-3.5">Codes & Promos</th>
              <th class="px-4 py-3.5">Referred People</th>
              <th class="px-4 py-3.5">Conversion</th>
              <th class="px-4 py-3.5 text-center">Orders</th>
              <th class="px-4 py-3.5">Spend Driven</th>
              <th class="px-4 py-3.5">Promo Usage</th>
              <th class="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <template v-for="row in processedRows" :key="row.id">
              <tr class="hover:bg-gray-50/70 transition-colors" :class="{ 'bg-orange-50/30': expandedRowId === row.id }">
                <!-- Ambassador / Referrer Info -->
                <td class="px-4 py-3.5">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border"
                      :class="getPersonaTheme(row.role).avatarClass"
                    >
                      <span>{{ row.roleEmoji }}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <p class="text-xs font-black text-gray-900 truncate">{{ row.name }}</p>
                        <span
                          class="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border"
                          :class="getPersonaTheme(row.role).tagClass"
                        >
                          {{ row.roleLabel }}
                        </span>
                      </div>
                      <p class="text-[11px] text-gray-500 truncate">{{ row.email || row.phone || 'No contact email' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Codes & Linked Promos -->
                <td class="px-4 py-3.5">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="rounded-lg bg-orange-50 border border-orange-100 px-2 py-0.5 text-[11px] font-mono font-black text-[#FF5C1A]">
                        {{ row.referralCode || '—' }}
                      </span>
                      <button
                        v-if="row.referralCode"
                        @click="copyCode(row.referralCode)"
                        title="Copy code"
                        class="text-gray-400 hover:text-gray-600 p-0.5"
                      >
                        <Copy class="w-3 h-3" />
                      </button>
                    </div>
                    <!-- Linked Promo Badges -->
                    <div v-if="row.promoCodes?.length" class="flex items-center gap-1 flex-wrap">
                      <span
                        v-for="p in row.promoCodes.slice(0, 2)"
                        :key="p._id"
                        class="text-[9px] font-mono font-bold bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded border border-gray-200"
                      >
                        🏷️ {{ p.code }}
                      </span>
                      <span v-if="row.promoCodes.length > 2" class="text-[9px] text-gray-400 font-bold">
                        +{{ row.promoCodes.length - 2 }} more
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Referred People (Breakdown) -->
                <td class="px-4 py-3.5">
                  <div>
                    <span class="text-xs font-black text-gray-900">{{ row.totalReferrals }}</span>
                    <span class="text-xs text-gray-400 ml-1">people</span>
                    <div class="flex items-center gap-1 mt-0.5 text-[10px] text-gray-500 font-medium">
                      <span class="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">{{ row.referred?.student || 0 }} stu</span>
                      <span class="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">{{ row.referred?.vendor || 0 }} ven</span>
                      <span class="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">{{ row.referred?.errander || 0 }} nin</span>
                    </div>
                  </div>
                </td>

                <!-- Conversion -->
                <td class="px-4 py-3.5">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span
                        class="text-xs font-black"
                        :class="row.activeReferrals ? 'text-emerald-600' : 'text-gray-400'"
                      >
                        {{ row.activeReferrals }}
                      </span>
                      <span class="text-[10px] text-gray-400">paying</span>
                    </div>
                    <div class="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        class="bg-emerald-500 h-full rounded-full transition-all"
                        :style="{ width: `${Math.min(100, row.conversionRate || 0)}%` }"
                      ></div>
                    </div>
                    <span class="text-[9px] font-bold text-gray-400">{{ row.conversionRate || 0 }}% rate</span>
                  </div>
                </td>

                <!-- Orders Count -->
                <td class="px-4 py-3.5 text-center">
                  <span class="text-xs font-black text-gray-900 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                    {{ row.ordersPlaced }}
                  </span>
                </td>

                <!-- Total Spend Driven (Prominent) -->
                <td class="px-4 py-3.5">
                  <div class="space-y-0.5">
                    <p class="text-sm font-black text-gray-900 tabular-nums">₦{{ (row.spend || 0).toLocaleString() }}</p>
                    <p class="text-[10px] text-gray-400 font-medium">customer orders</p>
                  </div>
                </td>

                <!-- Promo Usage & Discounts Given -->
                <td class="px-4 py-3.5">
                  <div class="space-y-0.5">
                    <p class="text-xs font-bold text-gray-800">{{ row.promoRedemptions || 0 }} uses</p>
                    <p v-if="row.promoDiscountGiven" class="text-[10px] text-amber-600 font-semibold">
                      -₦{{ (row.promoDiscountGiven || 0).toLocaleString() }} off
                    </p>
                    <p v-else class="text-[10px] text-gray-400">no discounts</p>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3.5 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      @click="toggleRow(row.id)"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      :class="expandedRowId === row.id
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                    >
                      <span>{{ expandedRowId === row.id ? 'Hide Details' : `Referred (${row.people?.length || 0})` }}</span>
                      <ChevronDown class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': expandedRowId === row.id }" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expandable Sub-Section: Complete Referred People & Spend -->
              <tr v-if="expandedRowId === row.id" class="bg-gradient-to-b from-orange-50/40 via-gray-50/50 to-gray-50">
                <td colspan="8" class="p-4 sm:p-6 border-b-2 border-orange-200/80">
                  <div class="space-y-4">
                    <!-- Top Cohort Hero Banner -->
                    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div class="space-y-1">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5C1A] flex items-center justify-center font-bold text-base shadow-2xs">
                            👥
                          </span>
                          <h4 class="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                            Referred Network for {{ row.name }}
                          </h4>
                          <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-50 text-[#FF5C1A] border border-orange-200">
                            {{ row.people?.length || 0 }} Members
                          </span>
                        </div>
                        <p class="text-xs text-gray-500 pl-10">
                          Directly onboarded via code <span class="font-mono font-bold text-[#FF5C1A]">{{ row.referralCode || 'N/A' }}</span>
                          <span v-if="row.promoCodes?.length"> and linked affiliate promos</span>.
                        </p>
                      </div>

                      <!-- Quick Impact Badges -->
                      <div class="flex items-center gap-2.5 flex-wrap">
                        <div class="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-left">
                          <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Spend</p>
                          <p class="text-xs font-black text-gray-900">
                            ₦{{ (row.spend || 0).toLocaleString() }}
                            <span class="text-[10px] font-normal text-gray-500">({{ row.ordersPlaced || 0 }} orders)</span>
                          </p>
                        </div>
                        <div class="px-3 py-2 rounded-xl bg-blue-50/60 border border-blue-100 text-left">
                          <p class="text-[10px] font-bold uppercase tracking-wider text-blue-500">Ninja Deliveries</p>
                          <p class="text-xs font-black text-blue-900">
                            {{ getCohortNinjaDeliveries(row).count }} done
                            <span class="text-[10px] font-normal text-blue-600">(₦{{ getCohortNinjaDeliveries(row).fees.toLocaleString() }})</span>
                          </p>
                        </div>
                        <div class="px-3 py-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-left">
                          <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active Rate</p>
                          <p class="text-xs font-black text-emerald-900">
                            {{ row.conversionRate || 0 }}%
                            <span class="text-[10px] font-normal text-emerald-700">({{ row.activeReferrals || 0 }} active)</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Filter & View Controls Toolbar -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                      <!-- Persona Quick Pills -->
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <button
                          v-for="tab in getCohortPersonaTabs(row)"
                          :key="tab.value"
                          @click="cohortPersonaFilter = tab.value"
                          class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border"
                          :class="cohortPersonaFilter === tab.value
                            ? 'bg-gray-900 text-white border-gray-900 shadow-2xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
                        >
                          <span>{{ tab.emoji }}</span>
                          <span>{{ tab.label }}</span>
                          <span
                            class="px-1.5 py-0.2 rounded-full text-[10px]"
                            :class="cohortPersonaFilter === tab.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'"
                          >
                            {{ tab.count }}
                          </span>
                        </button>
                      </div>

                      <!-- Search & View Toggle -->
                      <div class="flex items-center gap-2">
                        <div class="relative w-full sm:w-48">
                          <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            v-model="cohortSearchQuery"
                            type="text"
                            placeholder="Filter cohort..."
                            class="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF5C1A] text-gray-800 placeholder-gray-400"
                          />
                          <button
                            v-if="cohortSearchQuery"
                            @click="cohortSearchQuery = ''"
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X class="w-3 h-3" />
                          </button>
                        </div>

                        <!-- View Toggle -->
                        <div class="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 shrink-0">
                          <button
                            @click="cohortViewMode = 'grid'"
                            title="Grid View"
                            class="p-1.5 rounded-md transition-colors"
                            :class="cohortViewMode === 'grid' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-700'"
                          >
                            <LayoutGrid class="w-3.5 h-3.5" />
                          </button>
                          <button
                            @click="cohortViewMode = 'list'"
                            title="List View"
                            class="p-1.5 rounded-md transition-colors"
                            :class="cohortViewMode === 'list' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-700'"
                          >
                            <List class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State for Cohort Filter -->
                    <div
                      v-if="!getFilteredCohortPeople(row).length"
                      class="p-8 bg-white rounded-2xl border border-gray-200 text-center space-y-2 shadow-2xs"
                    >
                      <div class="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-lg">
                        🔍
                      </div>
                      <p class="text-xs font-bold text-gray-700">No referred people match this filter</p>
                      <p class="text-[11px] text-gray-400">Try clearing the search or choosing "All" personas</p>
                      <button
                        @click="cohortPersonaFilter = 'all'; cohortSearchQuery = ''"
                        class="mt-2 text-xs font-bold text-[#FF5C1A] hover:underline"
                      >
                        Reset Cohort Filters
                      </button>
                    </div>

                    <!-- 1. GRID CARDS VIEW -->
                    <div
                      v-else-if="cohortViewMode === 'grid'"
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5"
                    >
                      <div
                        v-for="person in getFilteredCohortPeople(row)"
                        :key="person.id"
                        class="bg-white rounded-2xl border border-gray-200/90 hover:border-orange-300 hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 relative group shadow-2xs"
                      >
                        <!-- Card Top: Avatar, Name, Persona & Channel -->
                        <div class="space-y-2.5">
                          <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center gap-2.5 min-w-0">
                              <div
                                class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-2xs"
                                :class="getPersonaTheme(person.role).avatarClass"
                              >
                                <span>{{ getPersonaTheme(person.role).emoji }}</span>
                              </div>
                              <div class="min-w-0">
                                <h5 class="text-xs font-black text-gray-900 truncate flex items-center gap-1.5" :title="person.name">
                                  {{ person.name }}
                                </h5>
                                <div class="flex items-center gap-1.5 mt-0.5">
                                  <span
                                    class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border"
                                    :class="getPersonaTheme(person.role).tagClass"
                                  >
                                    {{ getPersonaTheme(person.role).label }}
                                  </span>
                                  <span class="text-[10px] text-gray-400">
                                    {{ formatJoinedDate(person.joinedAt) }}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <!-- Attribution Tag -->
                            <div class="shrink-0 text-right">
                              <span
                                v-if="person.attributionType === 'signup_code'"
                                class="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#FF5C1A] bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-md"
                              >
                                🔑 {{ person.signupReferralCode || row.referralCode || 'Code' }}
                              </span>
                              <span
                                v-else-if="person.attributionType === 'promo_code'"
                                class="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md"
                              >
                                🏷️ {{ person.promoCodesUsed?.[0] || 'Promo' }}
                              </span>
                              <span
                                v-else
                                class="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md"
                              >
                                ✨ Code + Promo
                              </span>
                            </div>
                          </div>

                          <!-- Contact Info Row -->
                          <div class="text-[11px] text-gray-500 space-y-0.5 bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                            <div class="flex items-center gap-1.5 truncate">
                              <Mail class="w-3 h-3 text-gray-400 shrink-0" />
                              <span class="truncate" :title="person.email">{{ person.email || 'No email provided' }}</span>
                            </div>
                            <div v-if="person.phone" class="flex items-center gap-1.5 truncate">
                              <Phone class="w-3 h-3 text-gray-400 shrink-0" />
                              <span>{{ person.phone }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Card Activity & Ecosystem Impact Box -->
                        <div class="space-y-2 pt-1 border-t border-gray-100">
                          <!-- Errand Ninja Specific Metrics -->
                          <div
                            v-if="person.role === 'errander'"
                            class="p-2.5 rounded-xl border"
                            :class="person.deliveriesCount ? 'bg-blue-50/60 border-blue-100' : 'bg-gray-50/60 border-gray-100'"
                          >
                            <div class="flex items-center justify-between text-xs">
                              <span class="text-[11px] font-bold" :class="person.deliveriesCount ? 'text-blue-900' : 'text-gray-500'">
                                🛵 Rider Deliveries
                              </span>
                              <span class="font-black text-xs" :class="person.deliveriesCount ? 'text-blue-700' : 'text-gray-400'">
                                {{ person.deliveriesCount || 0 }} completed
                              </span>
                            </div>
                            <div class="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                              <span>Delivery Fees Earned:</span>
                              <strong class="text-gray-900">₦{{ (person.deliveryFeesEarned || 0).toLocaleString() }}</strong>
                            </div>
                          </div>

                          <!-- Vendor Specific Metrics -->
                          <div
                            v-else-if="person.role === 'vendor'"
                            class="p-2.5 rounded-xl border"
                            :class="person.vendorOrdersCount ? 'bg-emerald-50/60 border-emerald-100' : 'bg-gray-50/60 border-gray-100'"
                          >
                            <div class="flex items-center justify-between text-xs">
                              <span class="text-[11px] font-bold" :class="person.vendorOrdersCount ? 'text-emerald-900' : 'text-gray-500'">
                                🏪 Store Orders
                              </span>
                              <span class="font-black text-xs" :class="person.vendorOrdersCount ? 'text-emerald-700' : 'text-gray-400'">
                                {{ person.vendorOrdersCount || 0 }} orders
                              </span>
                            </div>
                            <div class="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                              <span>Store GMV:</span>
                              <strong class="text-gray-900">₦{{ (person.vendorGmv || 0).toLocaleString() }}</strong>
                            </div>
                          </div>

                          <!-- Customer Orders & Platform Spend -->
                          <div class="grid grid-cols-2 gap-2">
                            <div class="p-2 rounded-xl bg-gray-50 border border-gray-100 text-center">
                              <span class="text-[9px] font-bold uppercase text-gray-400 block">Orders Made</span>
                              <span
                                class="text-xs font-black"
                                :class="person.orders ? 'text-emerald-600' : 'text-gray-400'"
                              >
                                {{ person.orders || 0 }}
                              </span>
                            </div>
                            <div class="p-2 rounded-xl bg-gray-50 border border-gray-100 text-center">
                              <span class="text-[9px] font-bold uppercase text-gray-400 block">Total Spent</span>
                              <span
                                class="text-xs font-black tabular-nums"
                                :class="person.spend ? 'text-gray-900' : 'text-gray-400'"
                              >
                                ₦{{ (person.spend || 0).toLocaleString() }}
                              </span>
                            </div>
                          </div>

                          <!-- Action: Audit Orders Drawer Trigger -->
                          <button
                            @click="openPersonOrdersDrawer(person)"
                            class="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border"
                            :class="person.orders > 0
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 shadow-2xs'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'"
                          >
                            <span>{{ person.orders > 0 ? `Audit ${person.orders} Order Receipts` : 'Audit Account & Activity' }}</span>
                            <ArrowUpRight class="w-3.5 h-3.5 text-current" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- 2. DENSE LIST VIEW -->
                    <div v-else class="space-y-2">
                      <div
                        v-for="person in getFilteredCohortPeople(row)"
                        :key="person.id"
                        class="bg-white rounded-xl border border-gray-200/90 hover:border-orange-300 hover:shadow-xs transition-all p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
                      >
                        <!-- Left Info -->
                        <div class="flex items-center gap-3 min-w-0">
                          <div
                            class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border"
                            :class="getPersonaTheme(person.role).avatarClass"
                          >
                            <span>{{ getPersonaTheme(person.role).emoji }}</span>
                          </div>
                          <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                              <p class="text-xs font-black text-gray-900 truncate">{{ person.name }}</p>
                              <span
                                class="text-[9px] font-black uppercase px-1.5 py-0.2 rounded border"
                                :class="getPersonaTheme(person.role).tagClass"
                              >
                                {{ getPersonaTheme(person.role).label }}
                              </span>
                              <span class="text-[10px] text-gray-400">
                                {{ formatJoinedDate(person.joinedAt) }}
                              </span>
                            </div>
                            <div class="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                              <span class="truncate">{{ person.email || 'No email' }}</span>
                              <span v-if="person.phone" class="text-gray-400">· {{ person.phone }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Center Metrics -->
                        <div class="flex items-center gap-3 text-xs flex-wrap">
                          <!-- Attribution -->
                          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-orange-50 text-[#FF5C1A] border border-orange-100">
                            🔑 {{ person.signupReferralCode || row.referralCode || 'Code' }}
                          </span>

                          <!-- Ninja Role -->
                          <span
                            v-if="person.role === 'errander'"
                            class="px-2 py-0.5 rounded-md text-[11px] font-bold"
                            :class="person.deliveriesCount ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-500'"
                          >
                            🛵 {{ person.deliveriesCount || 0 }} deliveries (₦{{ (person.deliveryFeesEarned || 0).toLocaleString() }})
                          </span>

                          <!-- Customer Orders & Spend -->
                          <div class="px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 flex items-center gap-1.5">
                            <span class="text-[11px] text-gray-500">Orders:</span>
                            <strong :class="person.orders ? 'text-emerald-700' : 'text-gray-600'">{{ person.orders || 0 }}</strong>
                            <span class="text-gray-300">|</span>
                            <span class="text-[11px] text-gray-500">Spent:</span>
                            <strong class="text-gray-900">₦{{ (person.spend || 0).toLocaleString() }}</strong>
                          </div>

                          <!-- Action -->
                          <button
                            @click="openPersonOrdersDrawer(person)"
                            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 flex items-center gap-1"
                            :class="person.orders > 0
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'"
                          >
                            <span>Audit</span>
                            <ArrowUpRight class="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- DRAWER: ITEMIZED ORDER & SPEND AUDIT FOR REFERRED PERSON       -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <SideDrawer :isOpen="showOrderDrawer" @close="showOrderDrawer = false; selectedPerson = null" size="lg" title="Order & Spend Audit">
      <div v-if="personOrdersLoading" class="p-12 text-center">
        <Loader2 class="w-8 h-8 animate-spin text-[#FF5C1A] mx-auto mb-3" />
        <p class="text-xs text-gray-500 font-bold">Retrieving customer order records & spend receipts...</p>
      </div>

      <template v-else-if="selectedPerson">
        <!-- Customer Profile Card -->
        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
          <div class="flex items-center gap-3.5">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border shrink-0"
              :class="getPersonaTheme(selectedPerson.role).avatarClass"
            >
              {{ selectedPerson.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-black text-gray-900 truncate">{{ selectedPerson.name }}</h3>
                <span
                  class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                  :class="getPersonaTheme(selectedPerson.role).tagClass"
                >
                  {{ selectedPerson.role }}
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5 truncate">{{ selectedPerson.email }} • {{ selectedPerson.phone || 'No phone' }}</p>
            </div>
          </div>

          <!-- Total Metrics Snapshot -->
          <div class="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-gray-200/60">
            <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Spent</p>
              <p class="text-base font-black text-gray-900 mt-0.5">₦{{ (personOrdersData.totalSpent || 0).toLocaleString() }}</p>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Paid Orders</p>
              <p class="text-base font-black text-emerald-600 mt-0.5">{{ personOrdersData.ordersCount || 0 }}</p>
            </div>
            <div class="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Joined</p>
              <p class="text-xs font-bold text-gray-700 mt-1">
                {{ selectedPerson.joinedAt ? new Date(selectedPerson.joinedAt).toLocaleDateString() : '—' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Orders Itemized List -->
        <div class="p-6 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag class="w-3.5 h-3.5 text-[#FF5C1A]" />
              Placed Orders ({{ personOrdersData.orders?.length || 0 }})
            </h4>
            <span class="text-[10px] text-gray-400 font-medium">Non-cancelled / confirmed deliveries</span>
          </div>

          <div v-if="!personOrdersData.orders?.length" class="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
            <Package class="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p class="font-bold text-gray-700">No Paid Orders Recorded</p>
            <p class="text-gray-400 mt-0.5">This referred user has signed up but has not placed a completed paid order yet.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="order in personOrdersData.orders"
              :key="order._id"
              class="p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-2xs space-y-2.5 transition-all"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                    #{{ order.orderNumber }}
                  </span>
                  <span class="text-xs font-bold text-gray-800">{{ order.storeName }}</span>
                </div>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                  :class="getOrderStatusBadgeClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </div>

              <!-- Items Summary -->
              <div v-if="order.items?.length" class="text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 space-y-1">
                <div v-for="(it, idx) in order.items" :key="idx" class="flex items-center justify-between text-[11px]">
                  <span>{{ it.quantity }}x {{ it.name }}</span>
                  <span class="font-semibold text-gray-800">₦{{ (it.price * it.quantity).toLocaleString() }}</span>
                </div>
              </div>

              <!-- Price & Date Breakdown -->
              <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                <div class="flex items-center gap-2 text-gray-400 text-[10px]">
                  <span>{{ new Date(order.createdAt).toLocaleString() }}</span>
                  <span v-if="order.promoCode" class="text-amber-600 font-mono font-bold bg-amber-50 px-1 rounded">
                    🏷️ {{ order.promoCode }}
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-black text-gray-900">₦{{ (order.total || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Ninja Deliveries (if applicable) -->
          <div v-if="personOrdersData.deliveries?.length" class="mt-6 pt-4 border-t border-gray-100 space-y-3">
            <h4 class="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bike class="w-3.5 h-3.5 text-blue-600" />
              Completed Deliveries as Errand Ninja ({{ personOrdersData.deliveries.length }})
            </h4>
            <div class="space-y-2">
              <div
                v-for="deliv in personOrdersData.deliveries"
                :key="deliv._id"
                class="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p class="font-bold text-gray-900">#{{ deliv.orderNumber }} · {{ deliv.storeName }}</p>
                  <p class="text-[10px] text-gray-400">{{ new Date(deliv.createdAt).toLocaleString() }}</p>
                </div>
                <span class="font-black text-blue-700">₦{{ (deliv.deliveryFee || 0).toLocaleString() }} earned</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

import { ref, computed, onMounted } from 'vue';
import {
  Sparkles,
  RefreshCw,
  Download,
  Gift,
  Search,
  X,
  ChevronDown,
  Copy,
  Users,
  ShoppingBag,
  Package,
  Bike,
  Loader2,
  LayoutGrid,
  List,
  Mail,
  Phone,
  ArrowUpRight,
} from 'lucide-vue-next';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';

const { showToast } = useToast();

// State
const rows = ref<any[]>([]);
const statsData = ref<any>({});
const loading = ref(true);
const statsLoading = ref(true);
const expandedRowId = ref<string | null>(null);

// Cohort In-Expansion Filter State
const cohortPersonaFilter = ref<string>('all');
const cohortSearchQuery = ref<string>('');
const cohortViewMode = ref<'grid' | 'list'>('grid');

// Filters & Controls
const selectedPersona = ref<string>('all');
const searchQuery = ref<string>('');
const selectedActivity = ref<string>('all');
const selectedSort = ref<string>('spend_desc');

// SideDrawer State
const showOrderDrawer = ref(false);
const selectedPerson = ref<any>(null);
const personOrdersLoading = ref(false);
const personOrdersData = ref<any>({ orders: [], totalSpent: 0, ordersCount: 0 });

// Persona Tabs Definition
const personaTabs = computed(() => {
  const facCount = rows.value.filter((r) => r.role === 'facilitator').length;
  const ninjaCount = rows.value.filter((r) => r.role === 'errander').length;
  const studentCount = rows.value.filter((r) => r.role === 'student').length;
  const vendorCount = rows.value.filter((r) => r.role === 'vendor').length;
  const staffCount = rows.value.filter((r) => r.role === 'staff').length;

  return [
    { label: 'All Referrers', value: 'all', emoji: '🌟', count: rows.value.length },
    { label: 'Ambassadors', value: 'facilitator', emoji: '💎', count: facCount },
    { label: 'Errand Ninjas', value: 'errander', emoji: '🛵', count: ninjaCount },
    { label: 'Students', value: 'student', emoji: '🎓', count: studentCount },
    { label: 'Vendors', value: 'vendor', emoji: '🏪', count: vendorCount },
    { label: 'Staff', value: 'staff', emoji: '👔', count: staffCount },
  ];
});

// Activity Filters Definition
const activityFilters = [
  { label: 'All Activity', value: 'all' },
  { label: 'Has Spend (> ₦0)', value: 'has_spend' },
  { label: 'Active (Has Orders)', value: 'has_orders' },
  { label: 'Inactive (0 Orders)', value: 'inactive' },
];

// Computed Totals for Fallback
const totalReferredCount = computed(() => rows.value.reduce((s, r) => s + (r.totalReferrals || 0), 0));
const totalOrdersPlacedCount = computed(() => rows.value.reduce((s, r) => s + (r.ordersPlaced || 0), 0));
const totalSpendDrivenAmount = computed(() => rows.value.reduce((s, r) => s + (r.spend || 0), 0));
const totalPromoUsesCount = computed(() => rows.value.reduce((s, r) => s + (r.promoRedemptions || 0), 0));
const totalDiscountsGivenAmount = computed(() => rows.value.reduce((s, r) => s + (r.promoDiscountGiven || 0), 0));
const activePayingCustomersCount = computed(() => rows.value.reduce((s, r) => s + (r.activeReferrals || 0), 0));
const platformConversionRate = computed(() => {
  return totalReferredCount.value > 0
    ? Math.round((activePayingCustomersCount.value / totalReferredCount.value) * 100)
    : 0;
});

// Filter & Sort Logic
const processedRows = computed(() => {
  let list = [...rows.value];

  // 1. Persona Filter
  if (selectedPersona.value !== 'all') {
    list = list.filter((r) => r.role === selectedPersona.value);
  }

  // 2. Search Query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter((r) => {
      const matchName = r.name?.toLowerCase().includes(q);
      const matchEmail = r.email?.toLowerCase().includes(q);
      const matchPhone = r.phone?.toLowerCase().includes(q);
      const matchCode = r.referralCode?.toLowerCase().includes(q);
      const matchPromo = r.promoCodes?.some((p: any) => p.code?.toLowerCase().includes(q));
      const matchPeople = r.people?.some((p: any) => p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q));
      return matchName || matchEmail || matchPhone || matchCode || matchPromo || matchPeople;
    });
  }

  // 3. Activity Filter
  if (selectedActivity.value === 'has_spend') {
    list = list.filter((r) => (r.spend || 0) > 0);
  } else if (selectedActivity.value === 'has_orders') {
    list = list.filter((r) => (r.ordersPlaced || 0) > 0);
  } else if (selectedActivity.value === 'inactive') {
    list = list.filter((r) => (r.ordersPlaced || 0) === 0);
  }

  // 4. Sorting
  if (selectedSort.value === 'spend_desc') {
    list.sort((a, b) => (b.spend || 0) - (a.spend || 0));
  } else if (selectedSort.value === 'orders_desc') {
    list.sort((a, b) => (b.ordersPlaced || 0) - (a.ordersPlaced || 0));
  } else if (selectedSort.value === 'referrals_desc') {
    list.sort((a, b) => (b.totalReferrals || 0) - (a.totalReferrals || 0));
  } else if (selectedSort.value === 'conversion_desc') {
    list.sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0));
  } else if (selectedSort.value === 'promo_desc') {
    list.sort((a, b) => (b.promoRedemptions || 0) - (a.promoRedemptions || 0));
  }

  return list;
});

// Load Overview and KPI Stats
const loadData = async () => {
  loading.value = true;
  statsLoading.value = true;
  try {
    const [ambassadorsRes, statsRes] = await Promise.all([
      admin_api.getAmbassadors({ persona: 'all' }),
      admin_api.getAmbassadorStats().catch(() => ({ data: {} })),
    ]);

    rows.value = Array.isArray(ambassadorsRes.data) ? ambassadorsRes.data : [];
    statsData.value = statsRes.data || {};
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Could not load ambassadors data',
      toastType: 'error',
    } as any);
  } finally {
    loading.value = false;
    statsLoading.value = false;
  }
};

const selectPersona = (persona: string) => {
  selectedPersona.value = persona;
};

const toggleRow = (id: string) => {
  if (expandedRowId.value === id) {
    expandedRowId.value = null;
  } else {
    expandedRowId.value = id;
    cohortPersonaFilter.value = 'all';
    cohortSearchQuery.value = '';
  }
};

// Cohort Helpers for Expanded Network
const formatJoinedDate = (d: any) => {
  if (!d) return '—';
  try {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
};

const getCohortNinjaDeliveries = (row: any) => {
  if (!row?.people?.length) return { count: 0, fees: 0 };
  return row.people.reduce(
    (acc: any, p: any) => {
      acc.count += p.deliveriesCount || 0;
      acc.fees += p.deliveryFeesEarned || 0;
      return acc;
    },
    { count: 0, fees: 0 }
  );
};

const getCohortPersonaTabs = (row: any) => {
  const people = row?.people || [];
  const stuCount = people.filter((p: any) => p.role === 'student').length;
  const ninjaCount = people.filter((p: any) => p.role === 'errander').length;
  const venCount = people.filter((p: any) => p.role === 'vendor').length;

  const tabs = [
    { label: 'All', value: 'all', emoji: '👥', count: people.length },
    { label: 'Students', value: 'student', emoji: '🎓', count: stuCount },
    { label: 'Errand Ninjas', value: 'errander', emoji: '🛵', count: ninjaCount },
  ];
  if (venCount > 0) {
    tabs.push({ label: 'Vendors', value: 'vendor', emoji: '🏪', count: venCount });
  }
  return tabs;
};

const getFilteredCohortPeople = (row: any) => {
  let list = row?.people || [];

  if (cohortPersonaFilter.value !== 'all') {
    list = list.filter((p: any) => p.role === cohortPersonaFilter.value);
  }

  if (cohortSearchQuery.value.trim()) {
    const q = cohortSearchQuery.value.trim().toLowerCase();
    list = list.filter((p: any) => {
      return (
        p.name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q) ||
        p.signupReferralCode?.toLowerCase().includes(q) ||
        p.promoCodesUsed?.some((code: string) => code.toLowerCase().includes(q))
      );
    });
  }

  return list;
};

// Copy Referral Code
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code);
  showToast({
    title: 'Copied',
    message: `Referral code "${code}" copied to clipboard!`,
    toastType: 'success',
  } as any);
};

// Open Drawer to inspect actual itemized orders
const openPersonOrdersDrawer = async (person: any) => {
  selectedPerson.value = person;
  showOrderDrawer.value = true;
  personOrdersLoading.value = true;
  personOrdersData.value = { orders: [], totalSpent: 0, ordersCount: 0 };

  try {
    const res = await admin_api.getReferredPersonOrders(person.id);
    personOrdersData.value = res.data || { orders: [], totalSpent: 0, ordersCount: 0 };
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: 'Failed to retrieve order history for this user',
      toastType: 'error',
    } as any);
  } finally {
    personOrdersLoading.value = false;
  }
};

// Export CSV of Ambassadors, Referrals, and Spend
const exportCsv = () => {
  if (!rows.value.length) return;

  const headers = [
    'Name',
    'Email',
    'Phone',
    'Role',
    'Referral Code',
    'Total Referred People',
    'Paying Customers',
    'Conversion Rate (%)',
    'Orders Placed',
    'Total Spend Driven (NGN)',
    'Promo Redemptions',
    'Promo Discounts Given (NGN)',
  ];

  const csvRows = processedRows.value.map((r) => [
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.phone || '').replace(/"/g, '""')}"`,
    `"${r.roleLabel || r.role}"`,
    `"${r.referralCode || ''}"`,
    r.totalReferrals || 0,
    r.activeReferrals || 0,
    `${r.conversionRate || 0}%`,
    r.ordersPlaced || 0,
    r.spend || 0,
    r.promoRedemptions || 0,
    r.promoDiscountGiven || 0,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `erranders_ambassadors_referrals_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Styling Helpers
const getPersonaTheme = (role: string) => {
  switch (role) {
    case 'facilitator':
      return {
        label: 'Campus Ambassador',
        emoji: '💎',
        tagClass: 'bg-purple-50 text-purple-700 border-purple-200',
        avatarClass: 'bg-purple-50 text-purple-600 border-purple-200',
      };
    case 'errander':
      return {
        label: 'Errand Ninja',
        emoji: '🛵',
        tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
        avatarClass: 'bg-blue-50 text-blue-600 border-blue-200',
      };
    case 'vendor':
      return {
        label: 'Vendor',
        emoji: '🏪',
        tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        avatarClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      };
    case 'staff':
      return {
        label: 'Staff',
        emoji: '👔',
        tagClass: 'bg-amber-50 text-amber-800 border-amber-200',
        avatarClass: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    default:
      return {
        label: 'Student',
        emoji: '🎓',
        tagClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        avatarClass: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      };
  }
};

const getOrderStatusBadgeClass = (status: string) => {
  switch ((status || '').toUpperCase()) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'IN_TRANSIT':
    case 'PICKED_UP':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'PREPARING':
    case 'CONFIRMED':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

onMounted(loadData);
</script>
