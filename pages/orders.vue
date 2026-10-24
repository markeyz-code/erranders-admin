<template>
  <div class="space-y-6 animate-fade-in container mx-auto pb-20">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Orders</h1>
        <p class="text-sm font-medium text-gray-500">View and manage all customer orders.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Date Filters -->
        <DateRangePicker v-model:start="startDate" v-model:end="endDate" @update:start="fetchOrders" @update:end="fetchOrders" />
        <button @click="clearFilters" v-if="startDate || endDate || selectedCustomer || selectedVendor" class="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2">Clear</button>
      </div>
    </div>
    
    <!-- Order Status Legend -->
    <div class="bg-indigo-50/50 border border-indigo-100 rounded-[1.25rem] p-4 flex flex-col md:flex-row gap-4 items-start md:items-center text-sm text-indigo-900">
      <div class="flex items-center gap-2 font-bold whitespace-nowrap">
        <Activity class="w-4 h-4 text-indigo-600" />
        Status Guide:
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span><span class="font-semibold">Pending:</span> Awaiting acceptance</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-400"></span><span class="font-semibold">Processing:</span> Accepted & being fulfilled</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span><span class="font-semibold">Completed:</span> Successfully delivered</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-400"></span><span class="font-semibold">Cancelled:</span> Terminated order</span>
      </div>
    </div>

    <!-- Stats Grid (No Shadows) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-50/60 transition-all group overflow-visible relative shadow-none col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-blue-100 text-blue-600">
            <ShoppingBag class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ totalRecords }}</h3>
        </div>
      </div>
      
      <div v-if="hasModuleAccess('/finances')" class="bg-white p-4 rounded-[1.25rem] border border-gray-50/60 transition-all group overflow-visible relative shadow-none col-span-2 lg:col-span-2">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-emerald-100 text-emerald-600">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">₦{{ totalRevenue.toLocaleString() }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-50/60 transition-all group overflow-visible relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-amber-100 text-amber-600">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.pending }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-50/60 transition-all group overflow-visible relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-purple-100 text-purple-600">
            <Loader2 class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Processing</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.processing }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-50/60 transition-all group overflow-visible relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-teal-100 text-teal-600">
            <CheckCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.completed }}</h3>
        </div>
      </div>

      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-50/60 transition-all group overflow-visible relative shadow-none">
        <div class="flex items-center justify-between mb-4 relative z-10">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border border-white/50 bg-rose-100 text-rose-600">
            <XCircle class="w-4 h-4" />
          </div>
        </div>
        <div class="relative z-10 space-y-0.5">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cancelled</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ orderStats.cancelled }}</h3>
        </div>
      </div>
    </div>

    <!-- Fastest Erranders Widget -->
    <div v-if="fastestErranders.length > 0" class="bg-indigo-50/30 border border-indigo-100 rounded-[1.25rem] p-4 my-4">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <Truck class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-bold text-gray-900 tracking-tight">Top Fastest Dispatchers</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="(errander, index) in fastestErranders" :key="errander.user?._id || index" class="bg-white rounded-xl p-3 border border-indigo-50 flex items-center gap-3 shadow-sm">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 overflow-hidden relative">
            <img v-if="errander.user?.avatar" :src="errander.user.avatar" class="w-full h-full object-cover" />
            <span v-else>{{ errander.user?.firstName?.charAt(0) || '?' }}</span>
            <div v-if="index === 0" class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] border border-white">🥇</div>
            <div v-if="index === 1" class="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-[8px] border border-white">🥈</div>
            <div v-if="index === 2" class="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 rounded-full flex items-center justify-center text-[8px] border border-white">🥉</div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-gray-900 truncate">{{ errander.user?.firstName }} {{ errander.user?.lastName }}</p>
            <p class="text-[10px] font-medium text-gray-500 truncate mt-0.5">Avg: <span class="font-bold text-indigo-600">{{ Math.floor(errander.averageDeliveryTimeMs / 60000) }}m</span> ({{ errander.totalDeliveries }} trips)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls (Dropdowns instead of raw search) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
      <SelectInput 
        v-model="selectedCustomer" 
        :options="customerOptions" 
        label="Filter by Customer" 
        class="shadow-none"
        position="standalone"
      />
      <SelectInput 
        v-model="selectedVendor" 
        :options="vendorOptions" 
        label="Filter by Vendor" 
        class="shadow-none"
        position="standalone"
      />
      <SelectInput 
        v-model="selectedErrander" 
        :options="dispatcherOptions" 
        label="Filter by Errander" 
        class="shadow-none"
        position="standalone"
      />
      <SelectInput 
        v-model="selectedStatus" 
        :options="statusOptions" 
        label="Filter by Status" 
        class="shadow-none"
        position="standalone"
      />
      <SelectInput 
        v-model="selectedType" 
        :options="typeOptions" 
        label="Filter by Type" 
        class="shadow-none"
        position="standalone"
      />
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-[1.25rem] border border-gray-50/60 overflow-visible min-h-[400px] shadow-none">
      <div v-if="loading" class="p-10 space-y-6">
        <div v-for="i in 5" :key="`skeleton-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-12 h-12 rounded-full bg-gray-100" />
          <div class="flex-1 space-y-3">
            <div class="h-3 bg-gray-100 rounded-full w-1/3" />
            <div class="h-2 bg-gray-100 rounded-full w-1/4" />
          </div>
          <div class="w-24 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div v-else-if="orders.length === 0" class="py-24 text-center bg-gray-50/30">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-50">
          <ShoppingBag class="w-6 h-6 text-gray-400" />
        </div>
        <h4 class="font-bold text-gray-900 text-lg tracking-tight">No orders found</h4>
        <p class="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your filters or date range to find what you're looking for.</p>
      </div>

      <div v-else class="overflow-x-auto w-full pb-24 md:pb-0">
        <table class="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr class="border-b border-gray-100/50 bg-gray-50/20">
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider w-[20%]">Customer & Order</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider w-[20%]">Logistics</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Financials</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Date</th>
              <!-- <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider w-[15%]">Issues</th> -->
              <!-- <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider w-[15%]">Cancel Reason</th> -->
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Status</th>
              <th class="px-4 py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/80">
            <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50/50 transition-colors group">
              <!-- Customer & Order -->
              <td class="px-4 py-2.5 align-top">
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600 font-black text-sm uppercase border border-gray-25 mt-0.5">
                    {{ (order.customer || order.user)?.firstName?.charAt(0) || '?' }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="font-medium text-gray-900">{{ order.customer?.firstName || order.user?.firstName }} {{ order.customer?.lastName || order.user?.lastName }}</p>
                      <a v-if="(order.customer || order.user)?.phone" :href="`https://wa.me/${formatWhatsAppNumber((order.customer || order.user)?.phone)}`" @click.stop target="_blank" class="text-green-500 hover:text-green-600" title="Chat with Customer">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                    <p class="text-[11px] font-medium text-gray-500 truncate mb-1.5">{{ (order.customer || order.user)?.email || 'No email' }}</p>
                    <div class="flex items-center gap-2">
                      <span class="text-[9px] font-black bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">{{ order.orderNumber || order._id.slice(-8).toUpperCase() }}</span>
                      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wide">• {{ order.isGroupOrder ? 'Group Order' : (order.isAutopilot ? 'Auto-Pilot' : (order.isPooledErrand ? 'Pooled Errand' : (order.type === 'custom_errand' ? 'Custom Errand' : ((order.items?.length || 0) + ' items')))) }}</span>
                    </div>
                  </div>
                </div>
              </td>
              
              <!-- Logistics -->
              <td class="px-4 py-2.5 align-top">
                <div class="flex flex-col gap-1.5 mt-0.5">
                  <div class="flex items-center gap-2">
                    <Store v-if="order.type !== 'custom_errand'" class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <MapPin v-else class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div class="flex items-center gap-3">
                      <p class="font-medium text-gray-900 truncate max-w-[120px]" :title="order.type === 'custom_errand' ? order.customDetails?.pickupLocation : order.vendor?.storeName">
                        {{ order.type === 'custom_errand' ? (order.customDetails?.pickupLocation || 'Custom Location') : (order.vendor?.storeName || 'N/A') }}
                      </p>
                      <a v-if="order.type !== 'custom_errand' && (order.vendor?.phone || order.vendor?.owner?.phone)" :href="`https://wa.me/${formatWhatsAppNumber(order.vendor?.phone || order.vendor?.owner?.phone)}`" @click.stop target="_blank" class="text-green-500 hover:text-green-600" title="Chat with Vendor">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Truck class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <div class="flex items-center gap-3">
                      <p class="font-medium text-gray-900">{{ order.errander?.firstName || 'N/A' }}</p>
                      <a v-if="order.errander?.phone" :href="`https://wa.me/${formatWhatsAppNumber(order.errander?.phone)}`" @click.stop target="_blank" class="text-green-500 hover:text-green-600" title="Chat with Errander">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div v-if="order.interception && (order.interception.status === 'accepted' || order.interception.status === 'completed')" class="flex items-center gap-1.5 ml-5">
                    <span class="text-[9px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">🤝 INTERCEPTED</span>
                  </div>
                </div>
              </td>
              
              <!-- Financials -->
              <td class="px-4 py-2.5 text-right align-top">
                <p class="text-sm font-black text-gray-900 font-mono tracking-tight mt-0.5">
                  ₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}
                </p>
                <div class="flex flex-col items-end gap-1 mt-1">
                  <div class="flex items-center gap-1.5 flex-wrap justify-end">
                    <span 
                      class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 whitespace-nowrap" 
                      :title="order.type === 'custom_errand' ? 'Custom Errand Item/Procurement Cost' : 'Store Vendor Payout'"
                    >
                      Store: ₦{{ getOrderFinancials(order).vendorPayout.toLocaleString() }}
                    </span>
                    <span 
                      class="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60 whitespace-nowrap" 
                      title="Errand Ninja Delivery Payout"
                    >
                      Ninja: ₦{{ getOrderFinancials(order).ninjaPayout.toLocaleString() }}
                    </span>
                  </div>
                  <span 
                    class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 whitespace-nowrap"
                    title="Platform Commission / Processing"
                  >
                    Platform: ₦{{ getOrderFinancials(order).platformShare.toLocaleString() }}
                  </span>
                </div>
              </td>
              
              <!-- Date -->
              <td class="px-4 py-2.5 text-right align-top">
                <div class="flex flex-col items-end mt-0.5">
                  <span class="text-sm font-bold text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
                  <span class="text-[9px] font-medium text-gray-500">{{ new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
                  <span class="text-[10px] font-bold text-gray-400 mt-1">{{ formatTimeAgo(order.createdAt) }}</span>
                </div>
              </td>
              
              <!-- Issues -->
              <!-- <td class="px-4 py-2.5 align-top">
                <p class="text-[11px] text-gray-600 line-clamp-2 mt-0.5" :title="order.issues || 'No issues reported'">
                  {{ order.issues || '-' }}
                </p>
              </td> -->

              <!-- Cancel Reason -->
              <!-- <td class="px-4 py-2.5 align-top">
                <p class="text-[11px] text-gray-600 line-clamp-2 mt-0.5" :title="order.cancelReason || order.cancellationReason || order.reason || 'N/A'">
                  {{ order.status === 'cancelled' ? (order.cancelReason || order.cancellationReason || order.reason || 'Cancelled without reason') : '-' }}
                </p>
              </td> -->
              
              <!-- Status & Timeline -->
              <td class="px-4 py-2.5 text-right align-top">
                <div class="flex flex-col items-end gap-1.5 mt-0.5">
                  <span v-if="order.status === 'delivered'" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle class="w-3.5 h-3.5" /> Delivered
                  </span>
                  <span v-else-if="order.status === 'pending'" class="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5" /> Pending
                  </span>
                  <span v-else-if="order.status === 'cancelled'" class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle class="w-3.5 h-3.5" /> Cancelled
                  </span>
                  <span v-else class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity class="w-3.5 h-3.5" /> {{ order.status?.replace('_', ' ') }}
                  </span>
                  
                  <span v-if="order.status === 'delivered' && getDeliveryDuration(order)" class="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-50 px-1.5 py-0.5 rounded mt-1 flex items-center gap-1" title="Time from acceptance to delivery">
                    <Clock class="w-3 h-3" /> {{ getDeliveryDuration(order) }}
                  </span>
                </div>
              </td>
              <!-- Actions -->
              <td class="px-4 py-2.5 text-right relative align-top">
                <button @click.stop="activeDropdown === order._id ? activeDropdown = null : activeDropdown = order._id" class="mt-0.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-1">
                  Actions
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                <div v-if="activeDropdown === order._id" class="absolute right-6 top-10 w-48 bg-white border border-gray-50 rounded-xl shadow-lg z-20 py-1.5 text-left animate-fade-in-up">
                  <button @click.stop="selectedOrder = order; activeDropdown = null" class="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors">
                    Profile
                  </button>
                  <button v-if="hasPermission('can_update_order_status')" @click.stop="openModal(order, 'status')" class="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors">
                    Update Order Status
                  </button>
                  <button v-if="hasPermission('can_reassign_order')" @click.stop="openModal(order, 'dispatcher')" class="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-left transition-colors">
                    {{ order.errander ? 'Reassign Dispatcher' : 'Assign Dispatcher' }}
                  </button>
                  <button @click.stop="openIssueModal(order)" class="w-full px-4 py-2 text-[11px] font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 text-left transition-colors">
                    Update Issues
                  </button>
                  <div v-if="hasPermission('can_cancel_order')" class="border-t border-gray-50 my-1.5"></div>
                  <button v-if="['pending', 'processing', 'confirmed', 'scheduled', 'preparing'].includes(order.status) && hasPermission('can_cancel_order')" @click.stop="handleCancelOrder(order._id)" class="w-full px-4 py-2 text-[11px] font-bold text-red-600 hover:bg-red-50 text-left transition-colors">
                    Cancel Order
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination Controls -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100/50 bg-gray-50/20 shadow-none" v-if="totalPages > 1">
          <p class="text-sm font-medium text-gray-500">
            Showing Page <span class="font-bold text-gray-900">{{ currentPage }}</span> of <span class="font-bold text-gray-900">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-25 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 bg-white border border-gray-25 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SideDrawer Redesign with Enhanced Tracking & Rich Details -->
    <SideDrawer :isOpen="!!selectedOrder" size="lg" @close="selectedOrder = null">
      <template #header-left v-if="selectedOrder">
        <div class="flex items-center gap-2">
          <span class="font-mono text-sm font-extrabold text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-2.5 py-1 rounded-lg border border-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer" @click="copyText(selectedOrder.orderNumber || selectedOrder._id, 'Order ID')" title="Click to copy Order ID">
            <span>{{ selectedOrder.orderNumber || selectedOrder._id }}</span>
            <component :is="copiedField === (selectedOrder.orderNumber || selectedOrder._id) ? Check : Copy" class="w-3.5 h-3.5 text-gray-500" />
          </span>
          <span 
            class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 border"
            :class="{
              'bg-emerald-50 text-emerald-700 border-emerald-200': selectedOrder.status === 'delivered',
              'bg-blue-50 text-blue-700 border-blue-200': selectedOrder.status === 'in_transit' || selectedOrder.status === 'picked_up',
              'bg-amber-50 text-amber-700 border-amber-200': ['pending', 'negotiating', 'preparing', 'confirmed', 'ready_for_pickup'].includes(selectedOrder.status),
              'bg-purple-50 text-purple-700 border-purple-200': selectedOrder.status === 'interception_in_progress',
              'bg-red-50 text-red-700 border-red-200': selectedOrder.status === 'cancelled'
            }"
          >
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="{
              'bg-emerald-500': selectedOrder.status === 'delivered',
              'bg-blue-500': selectedOrder.status === 'in_transit' || selectedOrder.status === 'picked_up',
              'bg-amber-500': ['pending', 'negotiating', 'preparing', 'confirmed', 'ready_for_pickup'].includes(selectedOrder.status),
              'bg-purple-500': selectedOrder.status === 'interception_in_progress',
              'bg-red-500': selectedOrder.status === 'cancelled'
            }"></span>
            {{ selectedOrder.status?.replace(/_/g, ' ') }}
          </span>
        </div>
      </template>

      <template v-if="selectedOrder">
        <div class="space-y-6 pt-3 pb-24 px-1 sm:px-2">

          <!-- 1. Customer & Campus Profile Card -->
          <div class="bg-gradient-to-br from-white via-gray-50/50 to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs relative overflow-hidden space-y-4">
            <div class="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-full blur-xl pointer-events-none"></div>

            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="relative shrink-0">
                  <img 
                    v-if="selectedOrder.customer?.avatar || selectedOrder.user?.avatar" 
                    :src="selectedOrder.customer?.avatar || selectedOrder.user?.avatar" 
                    class="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                  />
                  <div 
                    v-else 
                    class="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white font-extrabold text-xl flex items-center justify-center ring-2 ring-white shadow-sm"
                  >
                    {{ selectedOrder.customer?.firstName?.[0] || selectedOrder.user?.firstName?.[0] || 'C' }}
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600/20" title="Active Customer"></div>
                </div>

                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-base font-extrabold text-gray-900 truncate font-heading">
                      {{ selectedOrder.customer?.firstName || selectedOrder.user?.firstName }} {{ selectedOrder.customer?.lastName || selectedOrder.user?.lastName }}
                    </h3>
                    <span v-if="selectedOrder.institution?.name || selectedOrder.institution" class="text-[10px] font-bold text-gray-600 bg-gray-100/90 px-2 py-0.5 rounded-md border border-gray-200/60 flex items-center gap-1">
                      🏛️ {{ selectedOrder.institution?.name || selectedOrder.institution }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                    <span>{{ selectedOrder.customer?.email || selectedOrder.user?.email || 'No email provided' }}</span>
                    <button 
                      v-if="selectedOrder.customer?.email || selectedOrder.user?.email" 
                      @click="copyText(selectedOrder.customer?.email || selectedOrder.user?.email, 'Customer Email')" 
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy email"
                    >
                      <Copy class="w-3 h-3" />
                    </button>
                  </p>
                </div>
              </div>

              <!-- Customer Direct Contact Pill Actions -->
              <div class="flex items-center gap-1.5 shrink-0">
                <a 
                  v-if="(selectedOrder.customer || selectedOrder.user)?.phone" 
                  :href="`https://wa.me/${formatWhatsAppNumber((selectedOrder.customer || selectedOrder.user)?.phone)}?text=Hello%20${encodeURIComponent(selectedOrder.customer?.firstName || 'there')},%20regarding%20your%20Erranders%20order%20${selectedOrder.orderNumber || ''}...`" 
                  target="_blank" 
                  class="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition-all border border-emerald-200/80 shadow-2xs hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="Chat on WhatsApp"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <a 
                  v-if="(selectedOrder.customer || selectedOrder.user)?.phone" 
                  :href="`tel:${(selectedOrder.customer || selectedOrder.user)?.phone}`" 
                  class="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all border border-gray-200/80 shadow-2xs hover:scale-105 active:scale-95 flex items-center justify-center"
                  title="Call Phone"
                >
                  <Phone class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!-- Quick Metrics Grid with comfortable inner padding -->
            <div class="grid grid-cols-3 gap-3 pt-3.5 border-t border-gray-200/60">
              <div class="bg-white/90 rounded-xl p-3 border border-gray-150 shadow-2xs">
                <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">Total Paid</span>
                <span class="text-sm font-black text-gray-900 font-mono">₦{{ Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString() }}</span>
              </div>
              <div class="bg-white/90 rounded-xl p-3 border border-gray-150 shadow-2xs">
                <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">Order Type</span>
                <span 
                  class="text-[11px] font-black uppercase tracking-tight block truncate"
                  :class="selectedOrder.type === 'custom_errand' ? 'text-amber-700' : 'text-[#FF5C1A]'"
                >
                  {{ selectedOrder.type === 'custom_errand' ? 'Custom Errand' : (selectedOrder.type?.replace(/_/g, ' ') || 'Food Delivery') }}
                </span>
              </div>
              <div class="bg-white/90 rounded-xl p-3 border border-gray-150 shadow-2xs">
                <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">Order Date</span>
                <span class="text-[11px] font-bold text-gray-800 block truncate">
                  {{ new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 2. Security Delivery PIN & Verification Banner -->
          <div 
            v-if="selectedOrder.uniqueCode || selectedOrder.deliveryPin" 
            class="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/90 rounded-2xl p-5 sm:p-6 flex items-center justify-between shadow-xs"
          >
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div>
                <span class="text-[10px] font-black text-amber-800 uppercase tracking-widest block">Delivery Handover PIN</span>
                <p class="text-[11px] text-amber-900/80 leading-tight mt-0.5">Customer shares this 6-digit code with the rider upon arrival</p>
              </div>
            </div>

            <button 
              @click="copyText(selectedOrder.uniqueCode || selectedOrder.deliveryPin, 'Delivery PIN')"
              class="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-amber-300/80 shadow-xs hover:bg-amber-50/50 transition-all active:scale-95 shrink-0"
              title="Copy PIN"
            >
              <span class="font-mono text-base font-black text-amber-900 tracking-wider">
                {{ selectedOrder.uniqueCode || selectedOrder.deliveryPin }}
              </span>
              <component :is="copiedField === (selectedOrder.uniqueCode || selectedOrder.deliveryPin) ? Check : Copy" class="w-4 h-4 text-amber-700" />
            </button>
          </div>

          <!-- 3. Journey Route (Origin ➔ Destination) with dedicated inner padding -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h4 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Navigation class="w-3.5 h-3.5 text-gray-500" />
              Route Waypoints
            </h4>

            <div class="bg-gray-50/70 rounded-xl p-4 sm:p-4.5 border border-gray-100">
              <div class="relative pl-6 space-y-4">
                <!-- Connecting dashed line -->
                <div class="absolute left-2.5 top-2.5 bottom-3 w-0.5 border-l-2 border-dashed border-gray-300"></div>

                <!-- Pickup Origin -->
                <div class="relative">
                  <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border-2 border-white absolute -left-6 top-0 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                    A
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                      {{ selectedOrder.type === 'custom_errand' ? 'Pickup Location / Market Store' : 'Vendor Kitchen' }}
                    </span>
                    <p class="text-xs font-bold text-gray-900 leading-snug">
                      <template v-if="selectedOrder.type === 'custom_errand'">
                        {{ selectedOrder.customDetails?.pickupLocation || 'Specified in errand briefing' }}
                      </template>
                      <template v-else>
                        {{ selectedOrder.vendor?.storeName || 'Campus Cafeteria' }}
                        <span v-if="selectedOrder.vendor?.address" class="text-gray-500 font-normal"> ({{ selectedOrder.vendor.address }})</span>
                      </template>
                    </p>
                  </div>
                </div>

                <!-- Drop-off Destination -->
                <div class="relative">
                  <div class="w-5 h-5 rounded-full bg-orange-100 text-[#FF5C1A] border-2 border-white absolute -left-6 top-0 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                    B
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Delivery Destination</span>
                    <p class="text-xs font-bold text-gray-900 leading-snug">
                      {{ selectedOrder.deliveryAddress || selectedOrder.specificAddress || selectedOrder.shippingAddress || selectedOrder.customDetails?.dropoffLocation || 'Campus Delivery Address' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. Assigned Errand Ninja (Dispatcher) Card with comfortable padding -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Truck class="w-3.5 h-3.5 text-gray-500" />
                {{ selectedOrder.interception && (selectedOrder.interception.status === 'accepted' || selectedOrder.interception.status === 'completed') ? 'Dispatchers (Intercepted Relay)' : 'Assigned Errand Ninja' }}
              </h4>
              <button 
                v-if="hasPermission('can_reassign_order')" 
                @click="openModal(selectedOrder, 'dispatcher')" 
                class="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                <RefreshCw class="w-3 h-3" />
                {{ selectedOrder.errander ? 'Reassign' : 'Assign Ninja' }}
              </button>
            </div>

            <!-- If Errand Ninja Assigned -->
            <div v-if="selectedOrder.errander" class="bg-gray-50/70 rounded-xl p-4 sm:p-4.5 border border-gray-100 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3.5 min-w-0">
                <div class="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-base flex items-center justify-center shrink-0 shadow-2xs">
                  {{ selectedOrder.errander?.firstName?.[0] || 'N' }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-extrabold text-gray-900 truncate">
                      {{ selectedOrder.errander?.firstName }} {{ selectedOrder.errander?.lastName }}
                    </p>
                    <span class="text-[9px] font-extrabold bg-indigo-100/70 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200 uppercase">Ninja</span>
                  </div>
                  <p class="text-xs text-gray-500 font-medium truncate mt-0.5">
                    {{ selectedOrder.errander?.phone || 'No phone' }}
                    <span v-if="selectedOrder.errander?.vehicleType" class="capitalize text-gray-400">
                      • {{ selectedOrder.errander.vehicleType.replace(/_/g, ' ') }} {{ selectedOrder.errander.plateNumber ? `(${selectedOrder.errander.plateNumber})` : '' }}
                    </span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <a 
                  v-if="selectedOrder.errander?.phone" 
                  :href="`https://wa.me/${formatWhatsAppNumber(selectedOrder.errander.phone)}`" 
                  target="_blank"
                  class="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
                  title="WhatsApp Rider"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <a 
                  v-if="selectedOrder.errander?.phone" 
                  :href="`tel:${selectedOrder.errander.phone}`" 
                  class="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-colors shadow-2xs"
                  title="Call Rider"
                >
                  <Phone class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!-- If Not Assigned -->
            <div v-else class="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-2.5 text-amber-800 text-xs font-bold">
                <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0" />
                <span>No Errand Ninja assigned yet</span>
              </div>
              <button 
                @click="openModal(selectedOrder, 'dispatcher')" 
                class="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              >
                Assign Now
              </button>
            </div>

            <!-- Interception Relay (if present) -->
            <div v-if="selectedOrder.interception && (selectedOrder.interception.status === 'accepted' || selectedOrder.interception.status === 'completed') && selectedOrder.interception.secondErrander" class="mt-3 bg-purple-50/70 border border-purple-200/80 rounded-xl p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                  🤝 Second Dispatcher Relay
                </span>
                <span class="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">40% Payout Split</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span class="text-[10px] text-gray-400 font-bold block">Relay Rider</span>
                  <span class="font-bold text-gray-900">{{ selectedOrder.interception.secondErrander?.firstName }} {{ selectedOrder.interception.secondErrander?.lastName }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-gray-400 font-bold block">Hand-off Point</span>
                  <span class="font-bold text-gray-800">{{ selectedOrder.interception.point || 'Campus Landmark' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Task Specifics: Custom Errand Briefing OR Food Ordered Items -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h4 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText class="w-3.5 h-3.5 text-gray-500" />
              {{ selectedOrder.type === 'custom_errand' ? 'Custom Errand Instructions & Items' : 'Ordered Items & Packs' }}
            </h4>

            <!-- A. Custom Errand Details -->
            <div v-if="selectedOrder.type === 'custom_errand'" class="space-y-4">
              <!-- Briefing description -->
              <div class="bg-gray-50/80 rounded-xl p-4 border border-gray-200/60">
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Errand Instructions / Grocery List</span>
                <p class="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">
                  {{ selectedOrder.customDetails?.description || 'No detailed instructions provided.' }}
                </p>
              </div>

              <!-- Estimated Items Budget -->
              <div class="bg-gradient-to-r from-orange-50/60 to-amber-50/60 rounded-xl p-4 border border-orange-200/60 flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">Estimated Item Purchase Cost</span>
                  <p class="text-[11px] text-amber-800/80 mt-0.5">Disbursed to rider to purchase the requested goods</p>
                </div>
                <span class="text-base font-black text-gray-900 font-mono">
                  ₦{{ Number(selectedOrder.customDetails?.estimatedItemCost || selectedOrder.subtotal || 0).toLocaleString() }}
                </span>
              </div>

              <!-- Voice Note Player (if available) -->
              <div v-if="selectedOrder.customDetails?.attachedVoiceNote" class="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-2">
                <span class="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 class="w-3.5 h-3.5" />
                  Attached Customer Voice Note
                </span>
                <audio controls class="w-full h-10 rounded-lg">
                  <source :src="selectedOrder.customDetails.attachedVoiceNote" type="audio/mpeg">
                  Your browser does not support the audio player.
                </audio>
              </div>

              <!-- Attached Images (if available) -->
              <div v-if="selectedOrder.customDetails?.attachedImage || (selectedOrder.customDetails?.attachedImages && selectedOrder.customDetails.attachedImages.length > 0)" class="space-y-2">
                <span class="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider block">Attached Sample Photos / Receipts</span>
                <div class="flex gap-2.5 flex-wrap">
                  <div 
                    v-if="selectedOrder.customDetails.attachedImage" 
                    @click="previewImageUrl = selectedOrder.customDetails.attachedImage"
                    class="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 block group relative cursor-pointer shadow-2xs hover:scale-105 transition-all"
                  >
                    <img :src="selectedOrder.customDetails.attachedImage" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Eye class="w-4 h-4" />
                    </div>
                  </div>
                  <div 
                    v-for="(img, idx) in selectedOrder.customDetails.attachedImages" 
                    :key="idx" 
                    @click="previewImageUrl = img"
                    class="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 block group relative cursor-pointer shadow-2xs hover:scale-105 transition-all"
                  >
                    <img :src="img" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Eye class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Negotiation Bids Timeline -->
              <div v-if="selectedOrder.bids?.length > 0" class="pt-2 border-t border-gray-100 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Errander Bids & Negotiation</span>
                  <span class="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{{ selectedOrder.bids.length }} bids placed</span>
                </div>
                <div class="space-y-2">
                  <div v-for="bid in selectedOrder.bids" :key="bid._id" class="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {{ bid.errander?.firstName?.charAt(0) || 'R' }}
                      </div>
                      <div>
                        <p class="text-xs font-bold text-gray-900">{{ bid.errander?.firstName }} {{ bid.errander?.lastName }}</p>
                        <p class="text-[10px] text-gray-400">{{ new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-black text-emerald-600 font-mono">₦{{ Number(bid.amount).toLocaleString() }}</p>
                      <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded" :class="{
                        'bg-amber-100 text-amber-700': bid.status === 'pending',
                        'bg-emerald-100 text-emerald-700': bid.status === 'accepted',
                        'bg-red-100 text-red-700': bid.status === 'rejected'
                      }">
                        {{ bid.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- B. Standard Food & Store Orders -->
            <div v-else class="space-y-3">
              <!-- Render Packs -->
              <template v-if="selectedOrder.packs?.length">
                <div v-for="pack in selectedOrder.packs" :key="pack.name" class="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-2.5">
                  <span class="text-[10px] font-extrabold text-[#FF5C1A] uppercase tracking-wider block border-b border-gray-200/60 pb-1.5">{{ pack.name }}</span>
                  <div v-for="item in pack.items" :key="item.name" class="flex items-start justify-between text-xs py-1">
                    <div class="flex items-start gap-2.5">
                      <span class="font-extrabold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded text-[11px]">{{ item.quantity }}x</span>
                      <div>
                        <span class="font-bold text-gray-900">{{ getItemDisplayName(item) }}</span>
                        <div v-if="item.customizations?.length" class="space-y-0.5 mt-0.5">
                          <p v-for="(custom, idx) in item.customizations" :key="idx" class="text-[10px] text-gray-500">
                            • {{ formatCustomizationLabel(custom) }} <span class="font-semibold text-gray-700" v-if="custom.price > 0">(+₦{{ custom.price?.toLocaleString() }})</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <span class="font-bold text-gray-900 font-mono">₦{{ Number(item.subtotal || item.price || 0).toLocaleString() }}</span>
                  </div>
                </div>
              </template>

              <!-- Fallback to raw items -->
              <div v-else class="space-y-2">
                <div v-for="item in selectedOrder.items" :key="item._id" class="flex items-start justify-between text-xs p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                  <div class="flex items-start gap-2.5">
                    <span class="font-extrabold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded text-[11px]">{{ item.quantity }}x</span>
                    <div>
                      <span class="font-bold text-gray-900">{{ getItemDisplayName(item) }}</span>
                      <div v-if="item.customizations?.length" class="space-y-0.5 mt-0.5">
                        <p v-for="(custom, idx) in item.customizations" :key="idx" class="text-[10px] text-gray-500">
                          • {{ formatCustomizationLabel(custom) }} <span class="font-semibold text-gray-700" v-if="custom.price > 0">(+₦{{ custom.price?.toLocaleString() }})</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <span class="font-bold text-gray-900 font-mono">₦{{ Number(item.subtotal || item.price || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. NEW: Order Fulfillment & Delivery Speed (Pickup ➔ Completed Calculation) -->
          <div 
            v-if="getOrderDuration(selectedOrder)" 
            class="bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/40 rounded-2xl p-5 sm:p-6 border border-indigo-150 shadow-xs space-y-4"
          >
            <div class="flex items-center justify-between border-b border-indigo-100/70 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                  <Timer class="w-4 h-4" />
                </div>
                <div>
                  <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Order Delivery & Fulfillment Speed
                  </h4>
                  <p class="text-[11px] text-gray-500 font-medium">Turnaround duration from pickup to completion</p>
                </div>
              </div>

              <!-- Quick speed rating badge -->
              <span 
                v-if="getOrderDuration(selectedOrder).transitDuration"
                class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 shadow-2xs"
                :class="getOrderDuration(selectedOrder).transitDurationMs > 0 && getOrderDuration(selectedOrder).transitDurationMs <= 15 * 60 * 1000 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getOrderDuration(selectedOrder).transitDurationMs > 0 && getOrderDuration(selectedOrder).transitDurationMs <= 15 * 60 * 1000 ? 'bg-emerald-500' : 'bg-indigo-500'"></span>
                {{ getOrderDuration(selectedOrder).transitDurationMs > 0 && getOrderDuration(selectedOrder).transitDurationMs <= 15 * 60 * 1000 ? '⚡ Ultra Fast' : '⏱️ Standard Speed' }}
              </span>
            </div>

            <!-- Primary Metric: Total Time from Pickup to Delivery -->
            <div class="bg-white rounded-xl p-4 sm:p-4.5 border border-indigo-100 shadow-2xs flex items-center justify-between">
              <div class="space-y-1">
                <span class="text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
                  <Zap class="w-3.5 h-3.5 text-indigo-600" />
                  Total Transit Time (Pickup ➔ Completed)
                </span>
                <p class="text-xs text-gray-500 font-medium">
                  <template v-if="getOrderDuration(selectedOrder).pickupTimeStr && getOrderDuration(selectedOrder).deliveredTimeStr">
                    Picked up at <span class="font-bold text-gray-700">{{ getOrderDuration(selectedOrder).pickupTimeStr }}</span> • Completed at <span class="font-bold text-gray-700">{{ getOrderDuration(selectedOrder).deliveredTimeStr }}</span>
                  </template>
                  <template v-else-if="getOrderDuration(selectedOrder).isCurrentlyInTransit">
                    Picked up at <span class="font-bold text-gray-700">{{ getOrderDuration(selectedOrder).pickupTimeStr }}</span> • Currently en-route
                  </template>
                  <template v-else>
                    Calculated automatically once rider marks order picked up
                  </template>
                </p>
              </div>

              <div class="text-right pl-3 shrink-0">
                <span class="text-xl sm:text-2xl font-black text-indigo-700 font-mono tracking-tight block">
                  {{ getOrderDuration(selectedOrder).transitDuration || 'Pending' }}
                </span>
              </div>
            </div>

            <!-- Supporting Milestone Breakdown Grid -->
            <div class="grid grid-cols-2 gap-3 pt-1">
              <div class="bg-gray-50/80 rounded-xl p-3 sm:p-3.5 border border-gray-150 shadow-2xs">
                <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                  Placed ➔ Picked Up
                </span>
                <span class="text-xs font-black text-gray-800 font-mono">
                  {{ getOrderDuration(selectedOrder).prepDuration || (selectedOrder.status === 'pending' ? 'In Queue' : 'N/A') }}
                </span>
              </div>

              <div class="bg-gray-50/80 rounded-xl p-3 sm:p-3.5 border border-gray-150 shadow-2xs">
                <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                  Total Order Turnaround
                </span>
                <span class="text-xs font-black text-gray-800 font-mono">
                  {{ getOrderDuration(selectedOrder).totalDuration || 'In Progress' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 7. Stepped Order Milestones & History Timeline with comfortable padding -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4" v-if="selectedOrder.statusHistory?.length">
            <h4 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-gray-500" />
              Order Journey Milestones
            </h4>

            <div class="bg-gray-50/70 rounded-xl p-4 sm:p-4.5 border border-gray-100">
              <div class="relative border-l-2 border-gray-250 ml-2 space-y-4 py-1">
                <div v-for="(history, index) in selectedOrder.statusHistory" :key="index" class="pl-4 relative">
                  <div class="w-2.5 h-2.5 bg-[#FF5C1A] rounded-full absolute -left-[5.5px] top-1 border-2 border-white shadow-2xs"></div>
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-extrabold text-gray-900 capitalize">{{ history.status?.replace(/_/g, ' ') }}</p>
                    <span class="text-[10px] font-medium text-gray-400">{{ new Date(history.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                  </div>
                  <p v-if="history.note" class="text-[11px] text-gray-600 mt-0.5 leading-tight">{{ history.note }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 8. Billing Invoice & 3-Way Financial Split with comfortable padding -->
          <div class="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Receipt class="w-3.5 h-3.5 text-gray-500" />
                Billing & Financial Split Breakdown
              </h4>
              <span 
                class="px-2.5 py-1 rounded-full font-black text-[9px] uppercase tracking-wider" 
                :class="selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
              >
                {{ selectedOrder.paymentStatus || 'Pending' }}
              </span>
            </div>

            <!-- Customer Receipt Breakdown in dedicated padded container -->
            <div class="bg-gray-50/70 rounded-xl p-4 sm:p-4.5 border border-gray-100 space-y-2.5 text-xs">
              <div class="flex justify-between items-center text-gray-600">
                <span class="font-medium">
                  {{ selectedOrder.type === 'custom_errand' ? 'Estimated Items Cost' : 'Items Subtotal' }}
                </span>
                <span class="font-bold text-gray-900 font-mono">
                  ₦{{ Number(selectedOrder.type === 'custom_errand' ? (selectedOrder.customDetails?.estimatedItemCost || selectedOrder.subtotal || 0) : (selectedOrder.subtotal || 0)).toLocaleString() }}
                </span>
              </div>

              <!-- Packaging Fee: CRITICAL FIX - ONLY RENDER FOR STORE/FOOD ORDERS, NEVER FOR CUSTOM ERRANDS -->
              <div 
                v-if="selectedOrder.type !== 'custom_errand' && Number(selectedOrder.packagingFee) > 0" 
                class="flex justify-between items-center text-gray-600"
              >
                <span class="font-medium">Food Pack / Container Packaging</span>
                <span class="font-bold text-gray-900 font-mono">₦{{ Number(selectedOrder.packagingFee).toLocaleString() }}</span>
              </div>

              <!-- Delivery Fee -->
              <div class="flex justify-between items-center text-gray-600">
                <span class="font-medium">Delivery Fee Charged</span>
                <span class="font-bold text-gray-900 font-mono">₦{{ Number(selectedOrder.deliveryFee || 0).toLocaleString() }}</span>
              </div>

              <!-- Platform Service Charge (if applicable) -->
              <div 
                v-if="Number(selectedOrder.serviceFee || selectedOrder.platformProcessingFee || selectedOrder.platformFee || 0) > 0" 
                class="flex justify-between items-center text-gray-600"
              >
                <span class="font-medium">Platform Service Charge</span>
                <span class="font-bold text-gray-900 font-mono">₦{{ Number(selectedOrder.serviceFee || selectedOrder.platformProcessingFee || selectedOrder.platformFee || 0).toLocaleString() }}</span>
              </div>

              <!-- Discount / Promo -->
              <div v-if="selectedOrder.discount" class="flex justify-between items-center text-emerald-700">
                <span class="font-medium">Promo Discount</span>
                <span class="font-bold font-mono">-₦{{ Number(selectedOrder.discount).toLocaleString() }}</span>
              </div>

              <!-- Total Customer Charged -->
              <div class="pt-2.5 border-t border-gray-200 flex justify-between items-center">
                <span class="text-sm font-black text-gray-900 uppercase">Total Paid by Customer</span>
                <span class="text-lg font-black text-[#FF5C1A] font-mono">
                  ₦{{ Number(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString() }}
                </span>
              </div>

              <div v-if="selectedOrder.paymentReference" class="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                <span>Payment Reference:</span>
                <span class="font-mono flex items-center gap-1 cursor-pointer hover:text-gray-600" @click="copyText(selectedOrder.paymentReference, 'Payment Reference')">
                  {{ selectedOrder.paymentReference }}
                  <Copy class="w-3 h-3" />
                </span>
              </div>
            </div>

            <!-- 3-Way Financial Distribution Card with generous padding -->
            <div class="bg-gradient-to-br from-gray-50 to-orange-50/20 border border-gray-200 rounded-xl p-4 sm:p-4.5 space-y-3.5">
              <div class="flex items-center justify-between">
                <p class="text-[10px] font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  💰 3-Way Revenue & Margin Distribution
                </p>
                <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Balanced Split
                </span>
              </div>

              <!-- Visual distribution bar -->
              <div class="h-2 w-full rounded-full bg-gray-200 flex overflow-hidden">
                <div 
                  class="bg-amber-500" 
                  :style="{ width: `${Math.round((getOrderFinancials(selectedOrder).vendorPayout / Math.max(1, getOrderFinancials(selectedOrder).total)) * 100)}%` }"
                  title="Store / Items Budget"
                ></div>
                <div 
                  class="bg-indigo-500" 
                  :style="{ width: `${Math.round((getOrderFinancials(selectedOrder).ninjaPayout / Math.max(1, getOrderFinancials(selectedOrder).total)) * 100)}%` }"
                  title="Ninja Payout"
                ></div>
                <div 
                  class="bg-emerald-500" 
                  :style="{ width: `${Math.max(2, 100 - Math.round(((getOrderFinancials(selectedOrder).vendorPayout + getOrderFinancials(selectedOrder).ninjaPayout) / Math.max(1, getOrderFinancials(selectedOrder).total)) * 100))}%` }"
                  title="Platform Retainage"
                ></div>
              </div>

              <div class="space-y-2 pt-1 text-xs">
                <!-- Store / Goods Budget -->
                <div class="flex justify-between items-center">
                  <span class="text-amber-900 font-bold flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    {{ selectedOrder.type === 'custom_errand' ? 'Item Purchase Budget (Runner)' : 'Store (Vendor Payout)' }}
                  </span>
                  <span class="text-amber-950 font-black font-mono">
                    ₦{{ getOrderFinancials(selectedOrder).vendorPayout.toLocaleString() }}
                  </span>
                </div>

                <!-- Ninja Courier Payout -->
                <div class="flex justify-between items-center">
                  <span class="text-indigo-900 font-bold flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    Errand Ninja Payout (Delivery)
                  </span>
                  <span class="text-indigo-950 font-black font-mono">
                    ₦{{ getOrderFinancials(selectedOrder).ninjaPayout.toLocaleString() }}
                  </span>
                </div>

                <!-- Platform Share -->
                <div class="flex justify-between items-center pt-2 border-t border-gray-200/70">
                  <span class="text-emerald-800 font-bold flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Platform Retainage (Net Margin)
                  </span>
                  <span class="text-emerald-900 font-black font-mono">
                    ₦{{ getOrderFinancials(selectedOrder).platformShare.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>
      
      <!-- Drawer Sticky Footer Action Controls -->
      <div v-if="selectedOrder" class="p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center gap-2.5 shrink-0">
        <button 
          @click="openActionModalFromDrawer(selectedOrder)" 
          class="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-extrabold shadow-sm hover:shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Sparkles class="w-4 h-4" />
          Take Action & Update
        </button>

        <button 
          v-if="['pending', 'processing', 'confirmed', 'scheduled', 'preparing'].includes(selectedOrder.status) && hasPermission('can_cancel_order')"
          @click="modalOrder = selectedOrder; handleCancelOrder(selectedOrder._id)" 
          class="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold border border-red-200 transition-colors shrink-0"
        >
          Cancel
        </button>
      </div>
    </SideDrawer>

    <!-- Lightbox Zoom Modal for Errand Photos -->
    <Teleport to="body">
      <div v-if="previewImageUrl" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" @click="previewImageUrl = null">
        <div class="relative max-w-3xl max-h-[90vh] p-2 bg-white rounded-2xl shadow-2xl overflow-hidden" @click.stop>
          <button @click="previewImageUrl = null" class="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
          <img :src="previewImageUrl" class="max-w-full max-h-[80vh] object-contain rounded-xl" />
          <div class="p-3 text-center">
            <a :href="previewImageUrl" target="_blank" class="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
              <ExternalLink class="w-3.5 h-3.5" /> Open original image in new tab
            </a>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Action Modal -->
    <Teleport to="body">
      <div v-if="showActionModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" @click.self="showActionModal = false">
        <div class="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 animate-fade-in-up shadow-2xl">
          <div class="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 class="text-lg font-bold text-gray-900">Order Actions</h3>
            <button @click="showActionModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>
        
        <div class="bg-gray-50 border border-gray-50 rounded-xl p-4 space-y-3 mb-6">
          <div class="flex justify-between items-center">
             <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Status</span>
             <span class="text-[11px] font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-700 capitalize">{{ modalOrder?.status?.replace(/_/g, ' ') || 'Unknown' }}</span>
          </div>
          <div class="flex justify-between items-center" v-if="modalOrder?.errander">
             <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Dispatcher</span>
             <span class="text-[11px] font-bold text-gray-900">{{ modalOrder?.errander?.firstName }} {{ modalOrder?.errander?.lastName }}</span>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Update Order Status</label>
            <div class="flex gap-2 relative">
              <SelectInput 
                v-model="selectedOrderUpdateStatus" 
                :options="computedStatusOptions" 
                label="Select status" 
                class="flex-1"
                position="top"
              />
              <button @click="handleUpdateStatus" :disabled="isUpdatingStatus || !selectedOrderUpdateStatus" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 h-[42px] self-end">
                <Loader2 v-if="isUpdatingStatus" class="w-4 h-4 animate-spin" />
                <span v-else>Update</span>
              </button>
            </div>
          </div>

          <div class="space-y-2 mt-4">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{{ modalOrder?.errander ? 'Reassign Dispatcher' : 'Assign Dispatcher' }}</label>
            <div class="flex gap-2 relative">
              <SelectInput 
                v-model="assigningErranderId" 
                :options="filteredDispatcherOptions" 
                :label="modalOrder?.errander ? 'Select New Dispatcher' : 'Select Dispatcher'" 
                class="flex-1"
                position="top"
              />
              <button @click="handleAssignDispatcher" :disabled="isAssigning || !assigningErranderId" class="px-4 py-2 bg-[#FF5C1A] text-white rounded-lg text-sm font-bold hover:bg-[#e04f15] transition-colors disabled:opacity-50 h-[42px] self-end">
                <Loader2 v-if="isAssigning" class="w-4 h-4 animate-spin" />
                <span v-else>{{ modalOrder?.errander ? 'Reassign' : 'Assign' }}</span>
              </button>
            </div>
            
            <div v-if="modalOrder?.errander && assigningErranderId" class="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">
              <div class="font-bold flex items-center gap-1.5 mb-2 text-orange-700">
                <AlertTriangle class="w-3.5 h-3.5" /> 
                Reassignment Implications:
              </div>
              <div class="space-y-2 opacity-90">
                 <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="revertStatus" class="rounded text-orange-600 focus:ring-orange-500 bg-white border-orange-200">
                    <span>Revert order status to <b>Confirmed</b></span>
                 </label>
                 <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="forfeitFee" class="rounded text-orange-600 focus:ring-orange-500 bg-white border-orange-200">
                    <span>The current dispatcher ({{ modalOrder?.errander?.firstName }}) forfeits their delivery fee</span>
                 </label>
                 <div v-if="modalOrder?.type === 'custom_errand'" class="flex items-start gap-2 mt-2 pt-2 border-t border-orange-200/50">
                    <AlertTriangle class="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span><b>Warning:</b> If item cost was already disbursed to the original dispatcher, this action will fail. You must resolve funds manually.</span>
                 </div>
              </div>
            </div>
          </div>

          <button 
            v-if="['pending', 'processing', 'confirmed', 'scheduled', 'preparing'].includes(modalOrder?.status) && hasPermission('can_cancel_order')"
            @click="handleCancelOrder(modalOrder?._id)" 
            class="w-full py-2.5 mt-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
    </Teleport>
    <!-- Cancel Order Modal -->
    <Teleport to="body">
    <div v-if="showCancelModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" @click.self="showCancelModal = false">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 space-y-6 animate-fade-in-up shadow-2xl">
        <div class="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 class="text-lg font-bold text-gray-900">Cancel Order</h3>
          <button @click="showCancelModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Reason for cancellation</label>
            <textarea
              v-model="cancelReasonInput"
              class="w-full px-4 py-3 rounded-xl border border-gray-25 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none h-24"
              placeholder="e.g. Customer requested cancellation..."
            ></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="showCancelModal = false" class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-sm">
              Keep Order
            </button>
            <button 
              @click="confirmCancelOrder" 
              :disabled="!cancelReasonInput.trim() || isCancellingOrder"
              class="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
            >
              <Loader2 v-if="isCancellingOrder" class="w-4 h-4 animate-spin" />
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- Update Issues Modal -->
    <Teleport to="body">
    <div v-if="showIssueModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-visible" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Update Issues</h3>
            <p class="text-sm text-gray-500 mt-1">Log missing items or complaints for support tracking</p>
          </div>
          <button @click="showIssueModal = false" class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6">
          <textarea
            v-model="issueInput"
            rows="4"
            class="w-full text-sm border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 p-3 bg-gray-50 placeholder:text-gray-400"
            placeholder="e.g. Missing 2 pieces of meat, customer complained about delay..."
          ></textarea>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showIssueModal = false" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            @click="confirmUpdateIssues" 
            :disabled="isUpdatingIssues"
            class="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="isUpdatingIssues" class="w-4 h-4 animate-spin" />
            Save Issues
          </button>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';
const { showToast } = useToast();
import { 
  ShoppingBag, DollarSign, Activity, Calendar, Store, Truck, CheckCircle, Clock, 
  XCircle, Loader2, X, MapPin, AlertTriangle, Copy, Check, Phone, ExternalLink, 
  ShieldCheck, UserCheck, PackageCheck, FileText, Sparkles, Navigation, Eye, 
  Volume2, RefreshCw, Receipt, Tag, Users, Repeat, ArrowRight, CornerDownRight,
  Timer, Zap, Hourglass
} from 'lucide-vue-next';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Orders - Errander Admin' });

const { hasModuleAccess, hasPermission, hasAnyPermission } = usePermissions();

const loading = ref(true);
const orders = ref<any[]>([]);

// Pagination and Totals
const currentPage = ref(1);
const totalPages = ref(1);
const totalRecords = ref(0);
const limit = ref(20);
const orderStats = ref({
  pending: 0,
  processing: 0,
  completed: 0,
  cancelled: 0,
  totalRevenue: 0
});
const fastestErranders = ref<any[]>([]);

// Filters
const startDate = ref('');
const endDate = ref('');
const selectedStatus = ref('all');
const selectedType = ref('all');
const selectedCustomer = ref('');
const selectedVendor = ref('');
const selectedErrander = ref('');

const selectedOrder = ref<any>(null);
const modalOrder = ref<any>(null);
const activeDropdown = ref<string | null>(null);

// Item & Customization Formatters for Crystal-Clear Order Display
const getItemDisplayName = (item: any): string => {
  if (!item?.name) return '';
  const rawName = item.name.trim();
  if (!item.customizations?.length) return rawName;

  const isBread = /bread/i.test(rawName);
  const colorCust = item.customizations.find((c: any) => 
    /color/i.test(c.selected || '') || 
    /^(brown|white|wheat)$/i.test(c.name?.trim() || '')
  );
  const sizeCust = item.customizations.find((c: any) => 
    /size|price|portion/i.test(c.selected || '') ||
    (/^\d+$/.test(c.name?.trim() || '') && Number(c.name) >= 100)
  );

  if (isBread && (colorCust || sizeCust)) {
    const details: string[] = [];
    if (colorCust) details.push(colorCust.name.trim());
    if (sizeCust) {
      const val = sizeCust.name.trim();
      details.push(/^\d+$/.test(val) ? `₦${Number(val).toLocaleString()} Loaf` : val);
    }
    return `${rawName} (${details.join(' · ')})`;
  }

  return rawName;
};

const formatCustomizationLabel = (custom: any): string => {
  if (!custom) return '';
  const name = String(custom.name || '').trim();
  const selected = String(custom.selected || '').trim();

  if (/size/i.test(selected) && /^\d+$/.test(name)) {
    return `${selected}: ₦${Number(name).toLocaleString()} Loaf`;
  }

  if (/^\d+$/.test(name) && Number(name) >= 50) {
    if (selected) {
      return `${selected}: ₦${Number(name).toLocaleString()}`;
    }
    return `Size: ₦${Number(name).toLocaleString()}`;
  }

  if (/color|type|flavor|protein|variant/i.test(selected)) {
    return `${selected}: ${name}`;
  }

  if (selected && !/^(add-on|add-ons|extra|extras|customization|customizations)$/i.test(selected) && selected.toLowerCase() !== name.toLowerCase()) {
    return `${selected}: ${name}`;
  }

  return name;
};

// Drawer Helpers
const copiedField = ref<string | null>(null);
const previewImageUrl = ref<string | null>(null);

const copyText = async (text: string, label: string = 'Text') => {
  if (!text) return;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    copiedField.value = text;
    showToast({ title: 'Copied', message: `${label} copied to clipboard`, toastType: 'success' });
    setTimeout(() => {
      if (copiedField.value === text) copiedField.value = null;
    }, 2000);
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to copy', toastType: 'error' });
  }
};

const openActionModalFromDrawer = (order: any) => {
  if (!order) return;
  modalOrder.value = order;
  showActionModal.value = true;
};

const getOrderFinancials = (order: any) => {
  if (!order) return { total: 0, vendorPayout: 0, ninjaPayout: 0, platformShare: 0, itemCost: 0, deliveryFee: 0 };
  
  const total = Number(order.total || order.totalAmount || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const serviceFee = Number(order.platformProcessingFee || order.serviceFee || order.platformFee || 0);
  
  // Custom errand specific calculation (No packaging fee!)
  if (order.type === 'custom_errand') {
    const itemCost = Number(order.customDetails?.estimatedItemCost || order.subtotal || 0);
    let ninjaPayout = order.erranderPayout !== undefined && Number(order.erranderPayout) > 0
      ? Number(order.erranderPayout)
      : (order.erranderShare !== undefined && Number(order.erranderShare) > 0
          ? Number(order.erranderShare)
          : (order.agreedDeliveryFee !== undefined && Number(order.agreedDeliveryFee) > 0
              ? Math.round(Number(order.agreedDeliveryFee) * 0.8)
              : Math.round(deliveryFee * 0.8)));
    
    // Platform share is total minus item purchase budget minus ninja payout
    let platformShare = order.platformShare !== undefined && Number(order.platformShare) > 0
      ? Number(order.platformShare)
      : Math.max(0, total - itemCost - ninjaPayout);

    // Reconcile if total has both
    if (total > 0 && Math.abs((itemCost + ninjaPayout + platformShare) - total) > 0) {
      platformShare = Math.max(0, total - itemCost - ninjaPayout);
    }
    const vendorPayout = itemCost; // Disbursed budget for purchasing items

    return {
      total,
      vendorPayout,
      ninjaPayout,
      platformShare,
      itemCost,
      deliveryFee
    };
  }
  
  // Regular marketplace / store food orders
  const ninjaPayout = order.erranderPayout !== undefined && Number(order.erranderPayout) > 0
    ? Number(order.erranderPayout)
    : deliveryFee;
    
  const deliveryMargin = Math.max(0, deliveryFee - ninjaPayout);
  
  const platformShare = (order.platformFee !== undefined && Number(order.platformFee) > 0 && serviceFee === 0)
    ? Number(order.platformFee)
    : (serviceFee + deliveryMargin);
    
  let vendorPayout = 0;
  if (order.vendorShare && Number(order.vendorShare) > 0) {
    vendorPayout = Number(order.vendorShare);
  } else if (order.subtotal !== undefined && Number(order.subtotal) > 0) {
    vendorPayout = Number(order.subtotal) + Number(order.packagingFee || 0);
  } else {
    vendorPayout = Math.max(0, total - deliveryFee - serviceFee);
  }

  return {
    total,
    vendorPayout,
    ninjaPayout,
    platformShare,
    itemCost: Number(order.subtotal || 0),
    deliveryFee
  };
};

const getOrderDuration = (order: any) => {
  if (!order) return null;

  const history = order.statusHistory || [];
  
  // Find pickup event
  const pickupEntry = history.find((h: any) => 
    h.status === 'picked_up' || 
    h.status?.toLowerCase().includes('picked') ||
    h.note?.toLowerCase().includes('picked up')
  ) || history.find((h: any) => h.status === 'in_transit');

  // Find delivery event
  const deliveredEntry = history.find((h: any) => 
    h.status === 'delivered' || 
    h.status === 'completed' ||
    h.status?.toLowerCase().includes('deliver') ||
    h.note?.toLowerCase().includes('delivered')
  );

  const pickupTime = pickupEntry ? new Date(pickupEntry.timestamp) : (order.pickedUpAt ? new Date(order.pickedUpAt) : null);
  const deliveredTime = deliveredEntry ? new Date(deliveredEntry.timestamp) : (order.deliveredAt ? new Date(order.deliveredAt) : (order.status === 'delivered' && order.updatedAt ? new Date(order.updatedAt) : null));
  const createdTime = order.createdAt ? new Date(order.createdAt) : (history[0] ? new Date(history[0].timestamp) : null);

  const formatDuration = (ms: number) => {
    if (ms <= 0) return '< 1 min';
    const totalSeconds = Math.floor(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      if (minutes < 5 && seconds > 0) {
        return `${minutes}m ${seconds}s`;
      }
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    return `${totalSeconds}s`;
  };

  // Transit Duration (Pickup -> Delivered)
  let transitDuration = null;
  let transitDurationMs = 0;
  let isCurrentlyInTransit = false;

  if (pickupTime && deliveredTime) {
    transitDurationMs = Math.max(0, deliveredTime.getTime() - pickupTime.getTime());
    transitDuration = formatDuration(transitDurationMs);
  } else if (pickupTime && ['picked_up', 'in_transit'].includes(order.status)) {
    isCurrentlyInTransit = true;
    const elapsedMs = Math.max(0, Date.now() - pickupTime.getTime());
    transitDuration = `${formatDuration(elapsedMs)} (In Transit)`;
  }

  // Total Duration (Placed -> Delivered)
  let totalDuration = null;
  let totalDurationMs = 0;
  if (createdTime && deliveredTime) {
    totalDurationMs = Math.max(0, deliveredTime.getTime() - createdTime.getTime());
    totalDuration = formatDuration(totalDurationMs);
  } else if (createdTime && order.status !== 'delivered' && order.status !== 'cancelled') {
    const elapsedTotal = Math.max(0, Date.now() - createdTime.getTime());
    totalDuration = `${formatDuration(elapsedTotal)} (Ongoing)`;
  }

  // Prep Duration (Placed -> Picked Up)
  let prepDuration = null;
  if (createdTime && pickupTime) {
    const prepMs = Math.max(0, pickupTime.getTime() - createdTime.getTime());
    prepDuration = formatDuration(prepMs);
  }

  return {
    hasPickup: !!pickupTime,
    hasDelivered: !!deliveredTime,
    isCurrentlyInTransit,
    pickupTimeStr: pickupTime ? pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
    deliveredTimeStr: deliveredTime ? deliveredTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
    transitDuration,
    transitDurationMs,
    totalDuration,
    prepDuration
  };
};

const statusOptions = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Preparing', value: 'preparing' },
  { label: 'Ready For Pickup', value: 'ready_for_pickup' },
  { label: 'Picked Up', value: 'picked_up' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Intercepted', value: 'interception_in_progress' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' }
];

const typeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Food Delivery', value: 'food_delivery' },
  { label: 'Custom Errand', value: 'custom_errand' },
  { label: 'Package Delivery', value: 'package_delivery' },
  { label: 'Group Orders', value: 'group' },
  { label: 'Pooled Errands', value: 'pooled' },
  { label: 'Auto-Pilot Orders', value: 'auto_pilot' }
];

const updateStatuses = ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
const showActionModal = ref(false);
const assigningErranderId = ref('');
const isAssigning = ref(false);
const revertStatus = ref(true);
const forfeitFee = ref(true);

const openModal = (order: any, type: 'status' | 'dispatcher') => {
  modalOrder.value = order;
  showActionModal.value = true;
  activeDropdown.value = null;
  assigningErranderId.value = '';
  revertStatus.value = true;
  forfeitFee.value = true;
};

// Dropdown options
const customerOptions = ref<any[]>([]);
const vendorOptions = ref<any[]>([]);
const dispatcherOptions = ref<any[]>([]);

const selectedOrderUpdateStatus = ref('');
const isUpdatingStatus = ref(false);

const filteredDispatcherOptions = computed(() => {
  if (!modalOrder.value?.errander) return dispatcherOptions.value;
  return dispatcherOptions.value.filter((d: any) => d.value !== modalOrder.value.errander._id && d.value !== modalOrder.value.errander.user?._id);
});

const computedStatusOptions = computed(() => {
  if (!modalOrder.value?.status) {
    return updateStatuses.map(s => ({ label: s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: s }));
  }
  
  const currentIndex = updateStatuses.indexOf(modalOrder.value.status);
  
  return updateStatuses.map((s, index) => ({
    label: s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: s,
    disabled: currentIndex !== -1 && index <= currentIndex
  }));
});

const fetchDropdowns = async () => {
  try {
    const [usersRes, vendorsRes, dispatchersRes] = await Promise.all([
      admin_api.getUsers().catch(e => ({ data: { users: [] } })),
      admin_api.getVendors().catch(e => ({ data: { vendors: [] } })),
      admin_api.getDispatchers(1, 100).catch(e => ({ data: { dispatchers: [] } }))
    ]);
    customerOptions.value = [
      { label: 'All Customers', value: 'all' },
      ...(usersRes.data?.users || usersRes.data || []).map((u: any) => ({
        label: `${u.firstName || ''} ${u.lastName || ''} - ${u.email}`,
        value: u._id
      }))
    ];
    vendorOptions.value = [
      { label: 'All Vendors', value: 'all' },
      ...(vendorsRes.data?.vendors || vendorsRes.data || []).map((v: any) => ({
        label: `${v.storeName}`,
        value: v._id
      }))
    ];
    
    const dList = dispatchersRes.data?.data?.dispatchers || dispatchersRes.data?.dispatchers || dispatchersRes.data || [];
    dispatcherOptions.value = [
      { label: 'All Erranders', value: 'all' },
      ...dList.map((d: any) => ({
        label: `${d.user?.firstName || d.firstName || ''} ${d.user?.lastName || d.lastName || ''} - ${d.user?.phone || d.phone || 'No phone'}`,
        value: d.user?._id || d._id
      }))
    ];
  } catch (e) {
    console.error('Failed to load dropdowns', e);
  }
};

const fetchFastestErranders = async () => {
  try {
    const res = await admin_api.getFastestDispatchers(4);
    fastestErranders.value = res.data?.data || res.data || [];
  } catch (e) {
    console.error('Failed to load fastest erranders', e);
  }
};

const pollInterval = ref<any>(null);
const knownOrderIds = ref<Set<string>>(new Set());
const isInitialLoad = ref(true);

const playOrderAlert = () => {
  const audio = new Audio('/sounds/order-alert.mp3');
  audio.play().catch(e => console.error('Audio play failed:', e));
};

const fetchOrders = async (isPolling: boolean = false) => {
  if (!isPolling) loading.value = true;
  try {
    const res = await admin_api.getRecentOrders(
      currentPage.value,
      limit.value,
      {
        startDate: startDate.value || undefined,
        endDate: endDate.value || undefined,
        status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
        type: selectedType.value !== 'all' ? selectedType.value : undefined,
        customerId: (selectedCustomer.value && selectedCustomer.value !== 'all') ? selectedCustomer.value : undefined,
        vendorId: (selectedVendor.value && selectedVendor.value !== 'all') ? selectedVendor.value : undefined,
        erranderId: (selectedErrander.value && selectedErrander.value !== 'all') ? selectedErrander.value : undefined
      }
    );
    const payload = res.data.data || res.data;
    const newOrders = payload.orders || [];
    orders.value = newOrders;
    totalRecords.value = payload.total || 0;
    totalPages.value = payload.totalPages || 1;
    
    if (payload.stats) {
      orderStats.value = payload.stats;
    }

    if (currentPage.value === 1) {
      if (!isInitialLoad.value && newOrders.length > 0) {
        const newIds = newOrders.map((o: any) => o._id);
        const hasNew = newIds.some((id: string) => !knownOrderIds.value.has(id));
        if (hasNew) {
          playOrderAlert();
        }
      }
      newOrders.forEach((o: any) => knownOrderIds.value.add(o._id));
      isInitialLoad.value = false;
    }
  } catch (e) {
    console.error(e);
  } finally {
    if (!isPolling) loading.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchOrders();
  }
};

watch([selectedStatus, selectedType, selectedCustomer, selectedVendor, selectedErrander], () => {
  currentPage.value = 1;
  fetchOrders();
});

const clearFilters = () => {
  startDate.value = '';
  endDate.value = '';
  selectedCustomer.value = '';
  selectedVendor.value = '';
  selectedErrander.value = '';
  selectedStatus.value = 'all';
  selectedType.value = 'all';
  currentPage.value = 1;
  fetchOrders();
};

const totalRevenue = computed(() => {
  return orderStats.value.totalRevenue || 0;
});

const activeOrdersCount = computed(() => {
  return orders.value.filter(o => ['pending', 'processing', 'assigned', 'picked_up'].includes(o.status)).length;
});

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMins = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins} mins ago`;
  if (diffInMins < 1440) return `${Math.floor(diffInMins / 60)} hrs ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getDeliveryDuration = (order: any) => {
  if (!order.statusHistory || !order.statusHistory.length) return null;
  const acceptedStatus = order.statusHistory.find((h: any) => ['accepted', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit'].includes(h.status));
  const acceptanceTime = acceptedStatus ? new Date(acceptedStatus.timestamp) : new Date(order.createdAt);
  
  const deliveredStatus = order.statusHistory.find((h: any) => h.status === 'delivered');
  const deliveryTime = order.actualDeliveryTime ? new Date(order.actualDeliveryTime) : (deliveredStatus ? new Date(deliveredStatus.timestamp) : null);
  
  if (!deliveryTime) return null;
  
  const diffInMins = Math.floor((deliveryTime.getTime() - acceptanceTime.getTime()) / 60000);
  if (diffInMins <= 0) return 'Instant';
  if (diffInMins < 60) return `${diffInMins}m`;
  return `${Math.floor(diffInMins / 60)}h ${diffInMins % 60}m`;
};

const formatWhatsAppNumber = (phone: string | undefined | null) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `234${digits}`;
  }
  return digits;
};

const showCancelModal = ref(false);
const showIssueModal = ref(false);
const issueInput = ref('');
const isUpdatingIssues = ref(false);
const orderToCancelId = ref('');
const cancelReasonInput = ref('');
const isCancellingOrder = ref(false);

const handleCancelOrder = (orderId: string) => {
  orderToCancelId.value = orderId;
  cancelReasonInput.value = '';
  showCancelModal.value = true;
};

const confirmCancelOrder = async () => {
  if (!cancelReasonInput.value.trim()) {
    showToast({ title: 'Error', message: 'Please enter a cancellation reason', toastType: 'error' });
    return;
  }
  isCancellingOrder.value = true;
  try {
    await admin_api.cancelOrder(orderToCancelId.value, { reason: cancelReasonInput.value });
    showToast({ title: 'Success', message: 'Order cancelled successfully.', toastType: 'success' });
    fetchOrders();
    showCancelModal.value = false;
    modalOrder.value = null;
    showActionModal.value = false;
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to cancel order.', toastType: 'error' });
  } finally {
    isCancellingOrder.value = false;
  }
};

const openIssueModal = (order: any) => {
  modalOrder.value = order;
  issueInput.value = order.issues || '';
  showIssueModal.value = true;
  activeDropdown.value = null;
};

const confirmUpdateIssues = async () => {
  if (!modalOrder.value?._id) return;
  isUpdatingIssues.value = true;
  try {
    await admin_api.updateOrderIssues(modalOrder.value._id, { issues: issueInput.value });
    showToast({ title: 'Success', message: 'Issues updated successfully.', toastType: 'success' });
    fetchOrders();
    showIssueModal.value = false;
    modalOrder.value = null;
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to update issues.', toastType: 'error' });
  } finally {
    isUpdatingIssues.value = false;
  }
};

const handleAssignDispatcher = async () => {
  if (!assigningErranderId.value) return;
  isAssigning.value = true;
  try {
    if (modalOrder.value?.errander) {
      await admin_api.reassignOrder(modalOrder.value._id, { 
        erranderId: assigningErranderId.value,
        revertStatus: revertStatus.value,
        forfeitFee: forfeitFee.value
      });
      showToast({ title: 'Success', message: 'Dispatcher reassigned successfully.', toastType: 'success' });
    } else {
      await admin_api.assignOrder(modalOrder.value._id, { erranderId: assigningErranderId.value });
      showToast({ title: 'Success', message: 'Dispatcher assigned successfully.', toastType: 'success' });
    }
    fetchOrders();
    modalOrder.value = null;
    showActionModal.value = false;
    assigningErranderId.value = '';
    revertStatus.value = true;
    forfeitFee.value = true;
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to assign dispatcher.', toastType: 'error' });
  } finally {
    isAssigning.value = false;
  }
};

const handleUpdateStatus = async () => {
  if (!selectedOrderUpdateStatus.value || !modalOrder.value?._id) return;
  isUpdatingStatus.value = true;
  try {
    const res = await admin_api.updateOrderStatus(modalOrder.value._id, { status: selectedOrderUpdateStatus.value });
    showToast({ title: 'Success', message: 'Status updated successfully.', toastType: 'success' });
    fetchOrders();
    modalOrder.value = null;
    showActionModal.value = false;
    selectedOrderUpdateStatus.value = '';
  } catch (error: any) {
    console.error('Update status error:', error);
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to update status.', toastType: 'error' });
  } finally {
    isUpdatingStatus.value = false;
  }
};

onMounted(() => {
  fetchDropdowns();
  fetchOrders();
  fetchFastestErranders();
  
  // Set up polling
  pollInterval.value = setInterval(() => {
    fetchOrders(true);
  }, 10000); // 10 seconds
  
  // Close dropdown on outside click
  window.addEventListener('click', () => {
    activeDropdown.value = null;
  });
  
  // Automatically open order from query parameter
  const route = useRoute();
  if (route.query.orderId) {
    // Wait for orders to fetch then select it
    watch(() => loading.value, (isLoading) => {
      if (!isLoading && orders.value.length > 0) {
        const found = orders.value.find(o => o._id === route.query.orderId);
        if (found) selectedOrder.value = found;
      }
    });
  }
});

onUnmounted(() => {
  if (pollInterval.value) clearInterval(pollInterval.value);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
