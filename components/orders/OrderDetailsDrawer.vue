<template>
  <SideDrawer :isOpen="isOpen" size="lg" @close="close">
    <template v-if="order">
      <!-- Header Profile -->
      <div class="flex flex-col items-center justify-center pt-8 pb-6 border-b border-gray-100">
        <div class="relative mb-3">
          <div class="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
            {{ order.customer?.firstName?.[0] || order.user?.firstName?.[0] || '?' }}
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 font-heading">{{ order.customer?.firstName || order.user?.firstName }} {{ order.customer?.lastName || order.user?.lastName }}</h3>
        <p class="text-sm font-medium text-gray-500 mb-4">{{ order.customer?.email || order.user?.email }}</p>
        
        <div class="flex items-center justify-between w-4/5 bg-white rounded-lg border border-gray-50 divide-x divide-gray-100">
          <div class="text-center flex-1 py-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total</p>
            <p class="text-sm font-bold text-gray-900">₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}</p>
          </div>
          <div class="text-center flex-1 py-3">
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
            <p class="text-sm font-semibold text-gray-900">{{ new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</p>
          </div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="py-6 space-y-6 pb-24 bg-gray-50/30 -mx-6 px-6">
        
        <!-- Order ID & Tracking -->
        <div class="space-y-4">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Tracking & Details
          </h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
            <div>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Order ID</span>
              <span class="text-sm font-bold text-gray-900 font-mono">{{ order.orderNumber || order._id }}</span>
            </div>
            <div>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Order Type</span>
              <span class="text-sm font-bold text-[#FF5C1A] uppercase tracking-wide">{{ order.type?.replace('_', ' ') || 'standard' }}</span>
            </div>
            <div>
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Current Status</span>
              <div class="capitalize text-sm font-bold px-2 py-1 bg-gray-100 rounded inline-block">{{ order.status }}</div>
            </div>
            <div v-if="order.deliveryPin || order.uniqueCode">
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Delivery PIN</span>
              <span class="text-sm font-black text-[#FF5C1A] tracking-wider">{{ order.deliveryPin || order.uniqueCode }}</span>
            </div>
            <div class="col-span-2 mt-2" v-if="order.statusHistory?.length">
              <span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-3">Order Timeline</span>
              <div class="relative border-l border-gray-200 ml-2 space-y-4">
                <div v-for="(history, index) in order.statusHistory" :key="index" class="pl-4 relative">
                  <div class="w-2.5 h-2.5 bg-[#FF5C1A] rounded-full absolute -left-[5px] top-1 border border-white"></div>
                  <p class="text-sm font-bold text-gray-900 capitalize">{{ history.status?.replace(/_/g, ' ') }}</p>
                  <p class="text-[10px] font-medium text-gray-500">{{ new Date(history.timestamp).toLocaleString() }}</p>
                  <p v-if="history.note" class="text-[10px] text-gray-600 mt-1 ">{{ history.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="space-y-4 mt-6">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            Customer Information
          </h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
              <p class="font-bold text-gray-900">{{ order.customer?.firstName || order.user?.firstName }} {{ order.customer?.lastName || order.user?.lastName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
              <div class="flex items-center gap-2">
                <p class="font-bold text-gray-900">{{ order.customer?.phone || order.user?.phone || 'N/A' }}</p>
                <a v-if="(order.customer || order.user)?.phone" :href="`https://wa.me/${formatWhatsAppNumber((order.customer || order.user)?.phone)}?text=Hello, regarding your order ${order.orderNumber || ''}, please be patient as we are working on it.`" target="_blank" class="w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors" title="Chat on WhatsApp">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
              </div>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Delivery Address</p>
              <p class="text-sm font-medium text-gray-700 leading-relaxed">{{ order.deliveryAddress || order.specificAddress || order.shippingAddress || 'No address provided' }}</p>
            </div>
          </div>
        </div>

        <!-- Errander Info -->
        <div class="space-y-4 mt-6" v-if="order.errander">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            {{ order.interception && (order.interception.status === 'accepted' || order.interception.status === 'completed') ? 'Dispatchers (Intercepted)' : 'Assigned Dispatcher' }}
            <span v-if="order.interception && (order.interception.status === 'accepted' || order.interception.status === 'completed')" class="text-[9px] font-black text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">🤝 INTERCEPTED</span>
          </h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
              <p class="font-bold text-gray-900">{{ order.errander?.firstName }} {{ order.errander?.lastName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
              <p class="font-bold text-gray-900">{{ order.errander?.phone || 'N/A' }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Vehicle</p>
              <p class="text-sm font-medium text-gray-700 leading-relaxed capitalize">{{ order.errander?.vehicleType?.replace('_', ' ') || 'Not specified' }} {{ order.errander?.plateNumber ? `(${order.errander.plateNumber})` : '' }}</p>
            </div>
            <div v-if="order.interception && (order.interception.status === 'accepted' || order.interception.status === 'completed')" class="col-span-2">
              <p class="text-[10px] font-semibold text-indigo-500 uppercase tracking-wide mb-1">💰 Payout (60%)</p>
              <p class="text-sm font-black text-indigo-600">₦{{ Math.round((order.erranderPayout || order.deliveryFee || 0) * 0.6).toLocaleString() }}</p>
            </div>
          </div>

          <!-- Second Errander (Interception) -->
          <div v-if="order.interception && (order.interception.status === 'accepted' || order.interception.status === 'completed') && order.interception.secondErrander" class="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3">
            <p class="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-3 flex items-center gap-1">🤝 Second Dispatcher (Hand-off)</p>
            <div class="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Name</p>
                <p class="font-bold text-gray-900">{{ order.interception.secondErrander?.firstName || 'N/A' }} {{ order.interception.secondErrander?.lastName || '' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                <p class="font-bold text-gray-900">{{ order.interception.secondErrander?.phone || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Hand-off Point</p>
                <p class="text-sm font-medium text-gray-700">{{ order.interception.point || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-[10px] font-semibold text-purple-500 uppercase tracking-wide mb-1">💰 Payout (40%)</p>
                <p class="text-sm font-black text-purple-600">₦{{ Math.round((order.erranderPayout || order.deliveryFee || 0) * 0.4).toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Ordered Items or Custom Errand -->
        <div class="space-y-4 mt-6" v-if="order.type === 'custom_errand' || order.packs?.length || order.items?.length">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            {{ order.type === 'custom_errand' ? 'Custom Errand Details' : 'Ordered Items' }}
          </h4>
          
          <!-- Custom Errand Details -->
          <div v-if="order.type === 'custom_errand' && order.customDetails" class="px-2 space-y-4">
            <div v-if="order.customDetails.description">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ order.customDetails.description }}</p>
            </div>
            
            <div v-if="order.customDetails.attachedVoiceNote">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                Voice Note
              </p>
              <audio controls class="w-full h-10 mt-1">
                <source :src="order.customDetails.attachedVoiceNote" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            </div>

            <div v-if="order.customDetails.attachedImage || (order.customDetails.attachedImages && order.customDetails.attachedImages.length > 0)">
              <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Attached Images
              </p>
              <div class="flex gap-2 flex-wrap">
                <a v-if="order.customDetails.attachedImage" :href="order.customDetails.attachedImage" target="_blank" class="w-20 h-20 rounded-lg overflow-hidden border border-gray-25 block group relative">
                  <img :src="order.customDetails.attachedImage" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </a>
                <a v-for="(img, idx) in order.customDetails.attachedImages" :key="idx" :href="img" target="_blank" class="w-20 h-20 rounded-lg overflow-hidden border border-gray-25 block group relative">
                  <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </a>
              </div>
            </div>
            
            <div v-if="order.customDetails.estimatedItemCost" class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Estimated Item Cost</span>
              <span class="font-bold text-gray-900">₦{{ Number(order.customDetails.estimatedItemCost).toLocaleString() }}</span>
            </div>

            <!-- Vendor Payment Details (Aggressive Audit) -->
            <div v-if="order.vendorPaymentDetails || order.itemsPhoto" class="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p class="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-1">🏦 Vendor Payment Audit</p>
              
              <div v-if="order.itemsPhoto" class="mb-4">
                <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Proof of Purchase</p>
                <a :href="order.itemsPhoto" target="_blank" class="w-full h-32 rounded-lg overflow-hidden border border-gray-25 block group relative">
                  <img :src="order.itemsPhoto" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </a>
              </div>
              
              <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm" v-if="order.vendorPaymentDetails">
                <div class="col-span-2">
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Amount Paid</p>
                  <p class="text-sm font-black text-orange-700">₦{{ order.actualItemCost ? order.actualItemCost.toLocaleString() : 'N/A' }} <span v-if="order.itemCostDisbursementStatus" class="uppercase text-[9px] bg-orange-200 text-orange-800 px-2 py-0.5 rounded ml-2">{{ order.itemCostDisbursementStatus }}</span></p>
                </div>
                <div class="col-span-2 border-t border-orange-100 pt-3">
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Account Name</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.vendorPaymentDetails.accountName }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Account Number</p>
                  <p class="font-mono text-sm font-bold text-gray-900">{{ order.vendorPaymentDetails.accountNumber }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Bank Name</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.vendorPaymentDetails.bankName }}</p>
                </div>
                <div class="col-span-2 pt-2">
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Transfer Reference</p>
                  <p class="font-mono text-[10px] text-gray-600 break-all">{{ order.vendorPaymentDetails.transferReference }}</p>
                </div>
                <div class="col-span-2" v-if="order.vendorPaymentDetails.transferredAt">
                  <p class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Transferred At</p>
                  <p class="text-[10px] font-bold text-gray-700">{{ new Date(order.vendorPaymentDetails.transferredAt).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Render Packs -->
          <template v-else-if="order.packs?.length">
            <div v-for="pack in order.packs" :key="pack.name" class="space-y-3 px-2 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-50">
              <h5 class="text-[10px] font-bold text-[#FF5C1A] uppercase  border-b border-gray-200 pb-1 mb-2">{{ pack.name }}</h5>
              <div v-for="item in pack.items" :key="item.name" class="flex items-start justify-between mb-2 last:mb-0">
                <div class="flex items-start gap-3">
                  <span class="text-sm font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded">{{ item.quantity }}x</span>
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900">{{ getItemDisplayName(item) }}</span>
                    <div v-if="item.customizations?.length" class="mt-1 space-y-1">
                      <p v-for="(custom, idx) in item.customizations" :key="idx" class="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                        <span class="text-gray-300">•</span> {{ formatCustomizationLabel(custom) }} <span class="font-semibold text-gray-700" v-if="custom.price > 0">(+₦{{ custom.price?.toLocaleString() }})</span>
                      </p>
                    </div>
                  </div>
                </div>
                <span class="text-sm font-black text-gray-900">₦{{ Number(item.subtotal || item.price || 0).toLocaleString() }}</span>
              </div>
            </div>
          </template>

          <!-- Fallback to raw items if no packs -->
          <div v-else class="space-y-3 px-2">
            <div v-for="item in order.items" :key="item._id" class="flex items-start justify-between">
              <div class="flex items-start gap-3">
                <span class="text-sm font-black text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded">{{ item.quantity }}x</span>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900">{{ getItemDisplayName(item) }}</span>
                  <div v-if="item.customizations?.length" class="mt-1 space-y-1">
                    <p v-for="(custom, idx) in item.customizations" :key="idx" class="text-[10px] font-medium text-gray-500 flex items-center gap-1">
                      <span class="text-gray-300">•</span> {{ formatCustomizationLabel(custom) }} <span class="font-semibold text-gray-700" v-if="custom.price > 0">(+₦{{ custom.price?.toLocaleString() }})</span>
                    </p>
                  </div>
                </div>
              </div>
              <span class="text-sm font-black text-gray-900">₦{{ Number(item.subtotal || item.price || 0).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Order Fulfillment & Delivery Speed (Pickup ➔ Completed Calculation) -->
        <div 
          v-if="getOrderDuration(order)" 
          class="bg-gradient-to-br from-indigo-50/70 via-white to-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-indigo-150 shadow-xs space-y-3 mt-6"
        >
          <div class="flex items-center justify-between border-b border-indigo-100/70 pb-2.5">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
                <Timer class="w-4 h-4" />
              </div>
              <div>
                <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Order Delivery Speed
                </h4>
                <p class="text-[10px] text-gray-500 font-medium">From pickup to completion</p>
              </div>
            </div>

            <!-- Speed badge -->
            <span 
              v-if="getOrderDuration(order)?.transitDuration"
              class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border flex items-center gap-1 shadow-2xs"
              :class="(getOrderDuration(order)?.transitDurationMs || 0) > 0 && (getOrderDuration(order)?.transitDurationMs || 0) <= 15 * 60 * 1000 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="(getOrderDuration(order)?.transitDurationMs || 0) > 0 && (getOrderDuration(order)?.transitDurationMs || 0) <= 15 * 60 * 1000 ? 'bg-emerald-500' : 'bg-indigo-500'"></span>
              {{ (getOrderDuration(order)?.transitDurationMs || 0) > 0 && (getOrderDuration(order)?.transitDurationMs || 0) <= 15 * 60 * 1000 ? '⚡ Ultra Fast' : '⏱️ Standard Speed' }}
            </span>
          </div>

          <!-- Primary Metric: Total Time from Pickup to Delivery -->
          <div class="bg-white rounded-xl p-3.5 border border-indigo-100 shadow-2xs flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="text-[9px] font-extrabold text-indigo-900 uppercase tracking-widest flex items-center gap-1">
                <Zap class="w-3 h-3 text-indigo-600" />
                Transit Time (Pickup ➔ Completed)
              </span>
              <p class="text-[11px] text-gray-500 font-medium">
                <template v-if="getOrderDuration(order)?.pickupTimeStr && getOrderDuration(order)?.deliveredTimeStr">
                  Picked up at <span class="font-bold text-gray-700">{{ getOrderDuration(order)?.pickupTimeStr }}</span> • Completed at <span class="font-bold text-gray-700">{{ getOrderDuration(order)?.deliveredTimeStr }}</span>
                </template>
                <template v-else-if="getOrderDuration(order)?.isCurrentlyInTransit">
                  Picked up at <span class="font-bold text-gray-700">{{ getOrderDuration(order)?.pickupTimeStr }}</span> • Currently en-route
                </template>
                <template v-else>
                  Calculated automatically once marked picked up
                </template>
              </p>
            </div>

            <div class="text-right pl-3 shrink-0">
              <span class="text-lg sm:text-xl font-black text-indigo-700 font-mono tracking-tight block">
                {{ getOrderDuration(order)?.transitDuration || 'Pending' }}
              </span>
            </div>
          </div>

          <!-- Secondary Metrics -->
          <div class="grid grid-cols-2 gap-2.5 pt-0.5">
            <div class="bg-gray-50/80 rounded-lg p-2.5 border border-gray-150 shadow-2xs">
              <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">
                Placed ➔ Picked Up
              </span>
              <span class="text-[11px] font-black text-gray-800 font-mono">
                {{ getOrderDuration(order)?.prepDuration || (order.status === 'pending' ? 'In Queue' : 'N/A') }}
              </span>
            </div>

            <div class="bg-gray-50/80 rounded-lg p-2.5 border border-gray-150 shadow-2xs">
              <span class="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-0.5">
                Total Turnaround
              </span>
              <span class="text-[11px] font-black text-gray-800 font-mono">
                {{ getOrderDuration(order)?.totalDuration || 'In Progress' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment & Billing -->
        <div class="space-y-4 mt-6">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            Billing & Revenue Split
            <span class="px-2 py-0.5 rounded-md font-bold text-[10px]" :class="order.paymentStatus === 'paid' ? 'bg-emerald-100 text-[#FF5C1A]' : 'bg-amber-100 text-amber-700'">{{ order.paymentStatus || 'Pending' }}</span>
          </h4>
          
          <div class="px-2 space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Items Subtotal</span>
              <span class="text-gray-900 font-bold">₦{{ Number(order.subtotal || 0).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-sm" v-if="order.type !== 'custom_errand' && Number(order.packagingFee) > 0">
              <span class="text-gray-500 font-semibold uppercase tracking-wide text-[10px]">Packaging</span>
              <span class="text-gray-900 font-bold">₦{{ Number(order.packagingFee || 0).toLocaleString() }}</span>
            </div>
            
            <div class="my-3 py-3 border-y border-gray-100 border-dashed space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500 font-bold uppercase tracking-wide text-[10px]">Total Delivery Charged</span>
                <span class="text-gray-900 font-black">₦{{ Number(order.deliveryFee || 0).toLocaleString() }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
              <span class="text-sm font-black text-gray-900 uppercase">Total Paid</span>
              <span class="text-lg font-black text-[#FF5C1A]">₦{{ Number(order.total || order.totalAmount || 0).toLocaleString() }}</span>
            </div>

            <!-- Interception Payout Split -->
            <div v-if="order.interception && (order.interception.status === 'accepted' || order.interception.status === 'completed')" class="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3 space-y-2">
              <p class="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-2">🤝 Interception Payout Split</p>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600 font-semibold">Errander Payout (Total)</span>
                <span class="text-gray-900 font-black">₦{{ Number(order.erranderPayout || order.deliveryFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-indigo-600 font-semibold">→ {{ order.errander?.firstName || 'Primary' }} (60%)</span>
                <span class="text-indigo-700 font-black">₦{{ Math.round((order.erranderPayout || order.deliveryFee || 0) * 0.6).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-purple-600 font-semibold">→ {{ order.interception?.secondErrander?.firstName || 'Second' }} (40%)</span>
                <span class="text-purple-700 font-black">₦{{ Math.round((order.erranderPayout || order.deliveryFee || 0) * 0.4).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <div v-if="order" class="p-6 border-t border-gray-100 flex flex-col gap-4">
      <button @click="$emit('takeAction', order)" class="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
        Take Action
      </button>
    </div>
  </SideDrawer>
</template>

<script setup lang="ts">
import SideDrawer from '@/components/ui/SideDrawer.vue';
import { Timer, Zap } from 'lucide-vue-next';

defineProps<{
  isOpen: boolean;
  order: any;
}>();

const emit = defineEmits(['close', 'takeAction']);

const close = () => emit('close');

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

const formatWhatsAppNumber = (phone: string) => {
  if (!phone) return '';
  let formatted = phone.replace(/[\s-()]/g, '');
  if (formatted.startsWith('0')) {
    formatted = '234' + formatted.substring(1);
  }
  if (!formatted.startsWith('+') && !formatted.startsWith('234')) {
    formatted = '234' + formatted;
  }
  return formatted.replace('+', '');
};

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
</script>
