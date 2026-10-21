<template>
  <div id="financial-breakdown-section" class="space-y-6">
    <!-- Header & Interactive Filter Bar -->
    <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs transition-all">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-[#FF5C1A] animate-pulse"></div>
            <h2 class="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Financial Breakdown & Money Flow
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Audited Ledger
              </span>
            </h2>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">
            Real-time capital distribution: Total money to Vendors, Errand Ninjas, and Platform Profit grouped by errand stream.
          </p>
        </div>

        <!-- Quick Presets -->
        <div class="flex flex-wrap items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          <button
            v-for="preset in presets"
            :key="preset.id"
            @click="handlePresetChange(preset.id)"
            :class="[
              activeFilters.preset === preset.id
                ? 'bg-gray-900 text-white shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 font-medium'
            ]"
            class="px-2.5 py-1 text-xs rounded-lg transition-all"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Advanced Filter Controls (Vendor, Student, Ninja, Custom Date) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        <!-- Vendor Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Store class="w-3 h-3 text-amber-500" /> Filter by Vendor
          </label>
          <select
            v-model="activeFilters.vendorId"
            @change="applyCurrentFilters"
            class="w-full text-xs font-semibold bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all cursor-pointer"
          >
            <option value="">All Approved Vendors ({{ filterOptions.vendors.length }})</option>
            <option
              v-for="vendor in filterOptions.vendors"
              :key="vendor.id"
              :value="vendor.id"
            >
              {{ vendor.businessName || vendor.name }} {{ vendor.category ? `(${vendor.category})` : '' }}
            </option>
          </select>
        </div>

        <!-- Errand Ninja Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Truck class="w-3 h-3 text-indigo-500" /> Filter by Errand Ninja
          </label>
          <select
            v-model="activeFilters.erranderId"
            @change="applyCurrentFilters"
            class="w-full text-xs font-semibold bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all cursor-pointer"
          >
            <option value="">All Errand Ninjas ({{ filterOptions.erranders.length }})</option>
            <option
              v-for="ninja in filterOptions.erranders"
              :key="ninja.id"
              :value="ninja.id"
            >
              {{ ninja.name }} {{ ninja.completedErrandsCount ? `(${ninja.completedErrandsCount} completed)` : '' }}
            </option>
          </select>
        </div>

        <!-- Student / Customer Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Users class="w-3 h-3 text-blue-500" /> Filter by Student / Customer
          </label>
          <select
            v-model="activeFilters.studentId"
            @change="applyCurrentFilters"
            class="w-full text-xs font-semibold bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all cursor-pointer"
          >
            <option value="">All Students ({{ filterOptions.students.length }})</option>
            <option
              v-for="student in filterOptions.students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }} {{ student.email ? `(${student.email})` : '' }}
            </option>
          </select>
        </div>

        <!-- Date Range Controls -->
        <div class="space-y-1">
          <label class="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span class="flex items-center gap-1"><Calendar class="w-3 h-3 text-teal-500" /> Date Range</span>
            <button
              v-if="hasActiveFilterOverrides"
              @click="handleReset"
              class="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-0.5"
            >
              <RotateCcw class="w-2.5 h-2.5" /> Reset
            </button>
          </label>
          <div class="flex items-center gap-1.5">
            <input
              type="date"
              v-model="activeFilters.startDate"
              @change="handleCustomDateChange"
              class="w-1/2 text-xs font-medium bg-gray-50/70 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]"
            />
            <span class="text-gray-400 text-xs">to</span>
            <input
              type="date"
              v-model="activeFilters.endDate"
              @change="handleCustomDateChange"
              class="w-1/2 text-xs font-medium bg-gray-50/70 border border-gray-200 rounded-xl px-2.5 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]"
            />
          </div>
        </div>
      </div>

      <!-- Active Filter Badges -->
      <div v-if="hasActiveFilterOverrides" class="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-gray-100">
        <span class="text-[11px] font-bold text-gray-400">Active Filters:</span>
        <span
          v-if="selectedVendorName"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200"
        >
          <Store class="w-3 h-3 text-amber-600" /> Vendor: {{ selectedVendorName }}
          <button @click="clearFilter('vendorId')" class="hover:text-amber-950 ml-1">
            <X class="w-3 h-3" />
          </button>
        </span>
        <span
          v-if="selectedNinjaName"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200"
        >
          <Truck class="w-3 h-3 text-indigo-600" /> Ninja: {{ selectedNinjaName }}
          <button @click="clearFilter('erranderId')" class="hover:text-indigo-950 ml-1">
            <X class="w-3 h-3" />
          </button>
        </span>
        <span
          v-if="selectedStudentName"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"
        >
          <Users class="w-3 h-3 text-blue-600" /> Student: {{ selectedStudentName }}
          <button @click="clearFilter('studentId')" class="hover:text-blue-950 ml-1">
            <X class="w-3 h-3" />
          </button>
        </span>
        <span
          v-if="activeFilters.preset === 'custom'"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200"
        >
          <Calendar class="w-3 h-3 text-teal-600" /> {{ activeFilters.startDate }} to {{ activeFilters.endDate }}
        </span>
      </div>
    </div>

    <!-- 1. The 3 Master Money Flow Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Loading Skeletons -->
      <template v-if="loading">
        <div v-for="i in 3" :key="`master-loading-${i}`" class="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse space-y-3">
          <div class="flex justify-between items-center">
            <div class="w-10 h-10 bg-gray-100 rounded-xl"></div>
            <div class="w-16 h-5 bg-gray-100 rounded-md"></div>
          </div>
          <div class="w-24 h-4 bg-gray-100 rounded"></div>
          <div class="w-36 h-7 bg-gray-100 rounded"></div>
          <div class="w-full h-10 bg-gray-50 rounded-lg"></div>
        </div>
      </template>

      <template v-else>
        <!-- Pillar 1: Total Money to Vendors -->
        <div class="bg-white p-5 rounded-2xl border border-amber-100/80 hover:border-amber-300 transition-all hover:shadow-md relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          <div class="flex items-center justify-between mb-3 relative z-10">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs">
              <Store class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-800 border border-amber-200/50">
              {{ summary.vendorSharePercentage }}% of GMV
            </span>
          </div>
          <div class="relative z-10 space-y-1">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Money to Vendors</p>
            <h3 class="text-2xl font-black text-gray-900 tracking-tight font-mono">
              ₦{{ summary.totalVendorPayout.toLocaleString() }}
            </h3>
            <p class="text-xs text-gray-500 font-medium">Disbursed for store products & provider services</p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100/80 grid grid-cols-2 gap-2 text-[11px] text-gray-600 relative z-10">
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Store Orders</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ (normalBreakdown.vendorPayout + customBreakdown.vendorPayout).toLocaleString() }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Services</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ servicesBreakdown.providerPayout.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Pillar 2: Total Money to Errand Ninjas -->
        <div class="bg-white p-5 rounded-2xl border border-indigo-100/80 hover:border-indigo-300 transition-all hover:shadow-md relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          <div class="flex items-center justify-between mb-3 relative z-10">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shadow-xs">
              <Truck class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800 border border-indigo-200/50">
              {{ summary.ninjaSharePercentage }}% of GMV
            </span>
          </div>
          <div class="relative z-10 space-y-1">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Money to Errand Ninjas</p>
            <h3 class="text-2xl font-black text-gray-900 tracking-tight font-mono">
              ₦{{ summary.totalNinjaPayout.toLocaleString() }}
            </h3>
            <p class="text-xs text-gray-500 font-medium">Earned by student errand dispatchers & runners</p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100/80 grid grid-cols-2 gap-2 text-[11px] text-gray-600 relative z-10">
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Normal Deliveries</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ normalBreakdown.ninjaPayout.toLocaleString() }}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[10px] uppercase font-bold">Custom Errands</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ customBreakdown.ninjaPayout.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Pillar 3: Total Money to Platform / Business -->
        <div class="bg-white p-5 rounded-2xl border border-emerald-100/80 hover:border-emerald-300 transition-all hover:shadow-md relative overflow-hidden group">
          <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          <div class="flex items-center justify-between mb-3 relative z-10">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-xs">
              <Coins class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 border border-emerald-200/50">
              {{ summary.platformMarginPercentage }}% Net Margin
            </span>
          </div>
          <div class="relative z-10 space-y-1">
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Money to Business</p>
            <h3 class="text-2xl font-black text-emerald-700 tracking-tight font-mono">
              ₦{{ summary.totalPlatformProfit.toLocaleString() }}
            </h3>
            <p class="text-xs text-gray-500 font-medium">Net platform revenue retainage across all streams</p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100/80 flex items-center justify-between text-[11px] text-gray-600 relative z-10">
            <span class="text-gray-400 text-[10px] uppercase font-bold">Total GMV Volume</span>
            <span class="font-black text-gray-900 font-mono">₦{{ summary.totalVolume.toLocaleString() }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 2. Grouped Profit by Streams: Normal Errands vs Custom Errands vs Services -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-teal-500"></div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500">
            Platform Profit Grouped by Errand Stream
          </h3>
        </div>
        <span class="text-xs text-gray-400 font-medium">
          Detailed net retainage, order count, and gross volume per category
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Group 1: Normal Errands Profit -->
        <div class="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                <ShoppingBag class="w-4.5 h-4.5" />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                {{ normalBreakdown.orderCount }} Orders
              </span>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Profit from Normal Errands</p>
            <h4 class="text-xl font-black text-gray-900 tracking-tight font-mono mt-1">
              ₦{{ normalBreakdown.profit.toLocaleString() }}
            </h4>
            <p class="text-xs text-gray-500 mt-1">
              Student service charge + delivery margin from vendor store purchases
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
            <div class="flex justify-between items-center text-gray-500">
              <span>Gross Volume (GMV):</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ normalBreakdown.volume.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Store Payout:</span>
              <span class="font-semibold text-amber-700 font-mono">₦{{ normalBreakdown.vendorPayout.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Ninja Payout:</span>
              <span class="font-semibold text-indigo-700 font-mono">₦{{ normalBreakdown.ninjaPayout.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Group 2: Custom Errands Profit -->
        <div class="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                <Zap class="w-4.5 h-4.5" />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                {{ customBreakdown.orderCount }} Errands
              </span>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Profit from Custom Errands</p>
            <h4 class="text-xl font-black text-gray-900 tracking-tight font-mono mt-1">
              ₦{{ customBreakdown.profit.toLocaleString() }}
            </h4>
            <p class="text-xs text-gray-500 mt-1">
              20% runner negotiation commission + student custom errand service charge
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
            <div class="flex justify-between items-center text-gray-500">
              <span>Gross Volume (GMV):</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ customBreakdown.volume.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Items Purchased:</span>
              <span class="font-semibold text-amber-700 font-mono">₦{{ customBreakdown.vendorPayout.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Ninja Payout:</span>
              <span class="font-semibold text-indigo-700 font-mono">₦{{ customBreakdown.ninjaPayout.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Group 3: Services from Service Providers Profit -->
        <div class="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Wrench class="w-4.5 h-4.5" />
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {{ servicesBreakdown.bookingCount }} Bookings
              </span>
            </div>
            <p class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Profit from Services (Providers)</p>
            <h4 class="text-xl font-black text-gray-900 tracking-tight font-mono mt-1">
              ₦{{ servicesBreakdown.profit.toLocaleString() }}
            </h4>
            <p class="text-xs text-gray-500 mt-1">
              Platform appointment commitment fee & service booking commission (10%)
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
            <div class="flex justify-between items-center text-gray-500">
              <span>Gross Volume:</span>
              <span class="font-bold text-gray-800 font-mono">₦{{ servicesBreakdown.volume.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Service Providers Payout:</span>
              <span class="font-semibold text-blue-700 font-mono">₦{{ servicesBreakdown.providerPayout.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-gray-500">
              <span>Errand Runner Payout:</span>
              <span class="font-medium text-gray-400">N/A (Direct Booking)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Interactive Charts Section -->
    <div class="bg-gray-900 rounded-2xl border border-gray-800 p-5 shadow-lg relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-80 h-80 bg-[#FF5C1A]/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700"></div>
      
      <!-- Chart Controls Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800/80 pb-4">
        <div>
          <h3 class="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-[#FF5C1A]" />
            Financial Growth & Progression Analytics
          </h3>
          <p class="text-xs font-medium text-gray-400 mt-0.5">
            Compare trends over time to track business progression and liquidity
          </p>
        </div>

        <!-- Chart Mode Toggle -->
        <div class="flex items-center bg-gray-800/80 rounded-xl p-1 border border-gray-700/60 backdrop-blur-md">
          <button
            @click="chartMode = 'flow'"
            :class="chartMode === 'flow' ? 'bg-[#FF5C1A] text-white shadow-xs' : 'text-gray-400 hover:text-white'"
            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
          >
            <Layers class="w-3.5 h-3.5" />
            Payout Distribution
          </button>
          <button
            @click="chartMode = 'profit_streams'"
            :class="chartMode === 'profit_streams' ? 'bg-[#FF5C1A] text-white shadow-xs' : 'text-gray-400 hover:text-white'"
            class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
          >
            <PieChart class="w-3.5 h-3.5" />
            Profit by Errand Type
          </button>
        </div>
      </div>

      <!-- Chart Body -->
      <div class="relative z-10 w-full min-h-[320px]">
        <ClientOnly>
          <apexchart
            v-if="chartSeries.length > 0 && hasChartData"
            :type="chartMode === 'flow' ? 'area' : 'bar'"
            height="320"
            :options="currentChartOptions"
            :series="chartSeries"
          />
          <div v-else-if="loading" class="h-80 flex flex-col items-center justify-center gap-2">
            <Loader2 class="w-8 h-8 text-[#FF5C1A] animate-spin" />
            <span class="text-sm font-medium text-gray-400">Loading financial chart...</span>
          </div>
          <div v-else class="h-80 flex flex-col items-center justify-center gap-2 text-center">
            <Coins class="w-10 h-10 text-gray-600" />
            <p class="text-sm font-bold text-gray-300">No transaction data found for this filter period</p>
            <p class="text-xs text-gray-500">Try widening your date range or clearing the selected filters.</p>
            <button
              @click="handleReset"
              class="mt-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
            >
              Reset Filters
            </button>
          </div>

          <template #fallback>
            <div class="h-80 flex items-center justify-center text-gray-500 text-xs">
              Loading interactive charts...
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Chart Legend / Quick Totals Footer -->
      <div class="mt-4 pt-3 border-t border-gray-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div v-if="chartMode === 'flow'" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-amber-500"></div>
          <span class="text-gray-400">Vendors Total:</span>
          <span class="font-bold text-white font-mono">₦{{ summary.totalVendorPayout.toLocaleString() }}</span>
        </div>
        <div v-if="chartMode === 'flow'" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span class="text-gray-400">Errand Ninjas Total:</span>
          <span class="font-bold text-white font-mono">₦{{ summary.totalNinjaPayout.toLocaleString() }}</span>
        </div>
        <div v-if="chartMode === 'flow'" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-gray-400">Platform Profit Total:</span>
          <span class="font-bold text-emerald-400 font-mono">₦{{ summary.totalPlatformProfit.toLocaleString() }}</span>
        </div>

        <div v-if="chartMode === 'profit_streams'" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-teal-400"></div>
          <span class="text-gray-400">Normal Errands:</span>
          <span class="font-bold text-white font-mono">₦{{ normalBreakdown.profit.toLocaleString() }}</span>
        </div>
        <div v-if="chartMode === 'profit_streams'" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-purple-400"></div>
          <span class="text-gray-400">Custom Errands:</span>
          <span class="font-bold text-white font-mono">₦{{ customBreakdown.profit.toLocaleString() }}</span>
        </div>
        <div v-if="chartMode === 'profit_streams'" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-400"></div>
          <span class="text-gray-400">Services:</span>
          <span class="font-bold text-white font-mono">₦{{ servicesBreakdown.profit.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Store, Truck, Users, Calendar, RotateCcw, X,
  Coins, ShoppingBag, Zap, Wrench, TrendingUp, Layers,
  PieChart, Loader2
} from 'lucide-vue-next';
import { useFinancialBreakdown } from '@/composables/modules/admin';

const {
  loading,
  financials,
  filterOptions,
  activeFilters,
  fetchFinancials,
  fetchFilterOptions,
  setPreset,
  resetFilters,
} = useFinancialBreakdown();

const chartMode = ref<'flow' | 'profit_streams'>('flow');

const presets = [
  { id: 'today', label: 'Today' },
  { id: '7D', label: '7D' },
  { id: '30D', label: '30D' },
  { id: 'this_month', label: 'This Month' },
  { id: 'ytd', label: 'YTD' },
  { id: 'all', label: 'All Time' },
  { id: 'custom', label: 'Custom' },
];

onMounted(() => {
  fetchFilterOptions();
  setPreset('30D');
});

const handlePresetChange = (presetId: string) => {
  setPreset(presetId);
};

const handleCustomDateChange = () => {
  activeFilters.value.preset = 'custom';
  fetchFinancials();
};

const applyCurrentFilters = () => {
  fetchFinancials();
};

const clearFilter = (key: 'vendorId' | 'erranderId' | 'studentId') => {
  activeFilters.value[key] = '';
  fetchFinancials();
};

const handleReset = () => {
  resetFilters();
};

const hasActiveFilterOverrides = computed(() => {
  return (
    !!activeFilters.value.vendorId ||
    !!activeFilters.value.erranderId ||
    !!activeFilters.value.studentId ||
    activeFilters.value.preset === 'custom'
  );
});

const selectedVendorName = computed(() => {
  if (!activeFilters.value.vendorId) return '';
  const vendor = filterOptions.value.vendors.find(v => v.id === activeFilters.value.vendorId);
  return vendor ? (vendor.businessName || vendor.name) : activeFilters.value.vendorId;
});

const selectedNinjaName = computed(() => {
  if (!activeFilters.value.erranderId) return '';
  const ninja = filterOptions.value.erranders.find(n => n.id === activeFilters.value.erranderId);
  return ninja ? ninja.name : activeFilters.value.erranderId;
});

const selectedStudentName = computed(() => {
  if (!activeFilters.value.studentId) return '';
  const student = filterOptions.value.students.find(s => s.id === activeFilters.value.studentId);
  return student ? student.name : activeFilters.value.studentId;
});

const summary = computed(() => {
  return financials.value?.summary || {
    totalVendorPayout: 0,
    totalNinjaPayout: 0,
    totalPlatformProfit: 0,
    totalVolume: 0,
    totalTransactions: 0,
    vendorSharePercentage: 0,
    ninjaSharePercentage: 0,
    platformMarginPercentage: 0,
  };
});

const normalBreakdown = computed(() => {
  return financials.value?.profitBreakdown?.normalErrands || {
    volume: 0,
    vendorPayout: 0,
    ninjaPayout: 0,
    profit: 0,
    orderCount: 0,
  };
});

const customBreakdown = computed(() => {
  return financials.value?.profitBreakdown?.customErrands || {
    volume: 0,
    vendorPayout: 0,
    ninjaPayout: 0,
    profit: 0,
    orderCount: 0,
  };
});

const servicesBreakdown = computed(() => {
  return financials.value?.profitBreakdown?.services || {
    volume: 0,
    providerPayout: 0,
    profit: 0,
    bookingCount: 0,
  };
});

const timeSeries = computed<any[]>(() => {
  return financials.value?.timeSeries || [];
});

const hasChartData = computed(() => {
  return timeSeries.value.some(d =>
    (d.vendorPayout || 0) > 0 ||
    (d.ninjaPayout || 0) > 0 ||
    (d.platformProfit || 0) > 0
  );
});

const chartSeries = computed(() => {
  if (chartMode.value === 'flow') {
    return [
      {
        name: 'Money to Vendors',
        data: timeSeries.value.map(d => d.vendorPayout || 0),
      },
      {
        name: 'Money to Errand Ninjas',
        data: timeSeries.value.map(d => d.ninjaPayout || 0),
      },
      {
        name: 'Platform Net Profit',
        data: timeSeries.value.map(d => d.platformProfit || 0),
      },
    ];
  } else {
    return [
      {
        name: 'Normal Errands Profit',
        data: timeSeries.value.map(d => d.profitNormal || 0),
      },
      {
        name: 'Custom Errands Profit',
        data: timeSeries.value.map(d => d.profitCustom || 0),
      },
      {
        name: 'Services Profit',
        data: timeSeries.value.map(d => d.profitServices || 0),
      },
    ];
  }
});

const currentChartOptions = computed(() => {
  const categories = timeSeries.value.map(d => {
    const parts = d.date.split('-');
    if (parts.length === 3) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${parseInt(parts[2], 10)} ${monthNames[parseInt(parts[1], 10) - 1]}`;
    }
    return d.date;
  });

  const colors = chartMode.value === 'flow'
    ? ['#F59E0B', '#6366F1', '#10B981'] // Amber (Vendors), Indigo (Ninjas), Emerald (Platform)
    : ['#14B8A6', '#A855F7', '#3B82F6']; // Teal (Normal), Purple (Custom), Blue (Services)

  return {
    chart: {
      type: chartMode.value === 'flow' ? 'area' : 'bar',
      fontFamily: 'inherit',
      stacked: chartMode.value === 'profit_streams',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 700,
      },
    },
    colors,
    fill: chartMode.value === 'flow'
      ? {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.35,
            opacityTo: 0.05,
            stops: [0, 100],
          },
        }
      : { opacity: 0.9 },
    dataLabels: { enabled: false },
    stroke: chartMode.value === 'flow'
      ? { curve: 'smooth', width: 2.5 }
      : { width: 0 },
    xaxis: {
      categories,
      labels: {
        style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
          if (val >= 1000) return `₦${(val / 1000).toFixed(1)}k`;
          return `₦${val}`;
        },
        style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 },
      },
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#D1D5DB' },
      fontSize: '11px',
      markers: { width: 8, height: 8, radius: 4 },
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `₦${Number(val).toLocaleString()}`,
      },
    },
  };
});
</script>
