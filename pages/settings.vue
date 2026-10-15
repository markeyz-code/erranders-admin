<template>
  <div class="space-y-8 animate-fade-in font-sans">
    <!-- Header Card -->
    <div class="bg-gray-950 p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-lg border border-gray-900">
      <div class="absolute -right-10 -top-10 w-48 h-48 bg-[#FF5C1A]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      <div class="relative z-10 space-y-2">
        <h2 class="text-2xl font-medium tracking-tight lowercase">system settings</h2>
        <p class="text-gray-400 text-sm font-medium leading-relaxed max-w-md lowercase">
          manage platform economics, communications, and campaigns. every change includes a real-time impact analysis.
        </p>
      </div>
    </div>

    <!-- Section Navigation Tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-5 py-3 rounded-2xl text-sm font-medium lowercase transition-all flex items-center gap-2 border',
          activeTab === tab.id
            ? 'bg-gray-900 text-white border-gray-25shadow-lg shadow-gray-200'
            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:text-gray-900'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 1: PRICING & REVENUE -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'pricing'" class="space-y-8">

      <!-- 1A: Delivery Fees -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Truck class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">delivery fees</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">base pricing students pay for delivery</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Room Delivery Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">room delivery fee (₦)</label>
              <button @click="showInfo('roomDeliveryFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.roomDeliveryFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.roomDeliveryFee !== originalForm.roomDeliveryFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.roomDeliveryFee }} → ₦{{ form.roomDeliveryFee }}.
            </p>
            <!-- Info Tooltip -->
            <div v-if="activeInfo === 'roomDeliveryFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the total delivery fee students pay for room delivery. the errander's profit is this fee minus the platform fee.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Drop-off Service Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">drop-off service fee (₦)</label>
              <button @click="showInfo('dropoffServiceFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.dropoffServiceFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.dropoffServiceFee !== originalForm.dropoffServiceFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.dropoffServiceFee }} → ₦{{ form.dropoffServiceFee }}.
            </p>
            <div v-if="activeInfo === 'dropoffServiceFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the total delivery fee students pay for a generic drop-off (non-doorstep). the errander's profit is this fee minus the platform fee.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 1B: Revenue & Commission -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <DollarSign class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">revenue & commissions</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">how erranders earns money from each transaction</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Buyer Convenience Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">buyer convenience fee (₦)</label>
              <button @click="showInfo('convenienceFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.convenienceFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.convenienceFee !== originalForm.convenienceFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.convenienceFee }} → ₦{{ form.convenienceFee }}. this flat fee goes directly to the platform on every order.
            </p>
            <div v-if="activeInfo === 'convenienceFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>a small flat fee added to every order that goes 100% to erranders as platform revenue. students see this as a "convenience" or "service" charge. keep it low (₦50-₦200) so it doesn't discourage orders.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Runner Commission (Normal) -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">runner commission (₦) [food/products]</label>
              <button @click="showInfo('commission')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.commissionFlatFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.commissionFlatFee !== originalForm.commissionFlatFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.commissionFlatFee }} → ₦{{ form.commissionFlatFee }}. at ₦{{ form.commissionFlatFee }}, a ₦{{ form.baseFee }} delivery earns erranders ₦{{ form.commissionFlatFee }} and the rider keeps ₦{{ form.baseFee - form.commissionFlatFee }}.
            </p>
            <div v-if="activeInfo === 'commission'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the flat fee that erranders takes as commission for standard vendor orders. the rest goes to the rider.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Delivery Minimums -->
          <div class="space-y-2 grid grid-cols-2 gap-4">
            <div class="col-span-1">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">min campus environs fee (₦)</label>
              <div class="mt-1.5 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.minCampusEnvironsFee"
                  class="w-full bg-white border border-gray-50 rounded-xl py-2 pl-8 pr-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A] transition-colors"
                >
              </div>
            </div>

            <div class="col-span-1">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">min far off-campus fee (₦)</label>
              <div class="mt-1.5 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.minOutsideCampusFee"
                  class="w-full bg-white border border-gray-50 rounded-xl py-2 pl-8 pr-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A] transition-colors"
                >
              </div>
            </div>
          </div>

          <!-- Runner Commission (Custom) -->
          <div class="space-y-2">
            <div class="col-span-2 md:col-span-1">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">min custom errand fee (₦)</label>
              <div class="mt-1.5 relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.minCustomErrandFee"
                  class="w-full bg-white border border-gray-50 rounded-xl py-2 pl-8 pr-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A] transition-colors"
                >
              </div>
            </div>

            <div class="col-span-2 md:col-span-1">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">custom errand commission (%)</label>
              <button @click="showInfo('customCommission')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.customErrandCommissionPercentage"
              type="number" required min="0" max="100"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.customErrandCommissionPercentage !== originalForm.customErrandCommissionPercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from {{ originalForm.customErrandCommissionPercentage }}% → {{ form.customErrandCommissionPercentage }}%.
            </p>
            <div v-if="activeInfo === 'customCommission'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the percentage of the delivery fee that erranders takes as commission specifically for Custom Errands. the rest goes to the rider.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Custom Errand Safety Buffer -->
          <div class="space-y-2 relative">
            <div class="col-span-2 md:col-span-1">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">safety buffer (%)</label>
              <button @click="showInfo('safetyBuffer')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.customErrandSafetyBufferPercentage"
              type="number" required min="0" max="100"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.customErrandSafetyBufferPercentage !== originalForm.customErrandSafetyBufferPercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from {{ originalForm.customErrandSafetyBufferPercentage }}% → {{ form.customErrandSafetyBufferPercentage }}%.
            </p>
            <div v-if="activeInfo === 'safetyBuffer'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>the percentage added to a custom errand's estimated item cost as a safety buffer for when actual prices exceed the estimate.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Enable Transfer Fee Toggle -->
          <div class="space-y-2">
            <div class="flex items-center justify-between p-4 bg-gray-50 border border-gray-50 rounded-2xl hover:bg-white hover:border-[#FF5C1A]/30 transition-all cursor-pointer" @click="form.enableTransferFee = !form.enableTransferFee">
              <div>
                <label class="text-sm font-medium text-gray-900 lowercase cursor-pointer">enable bank transfer fee</label>
                <p class="text-sm text-gray-500 mt-1">charge customers for P2P bank transfers to erranders</p>
              </div>
              <div class="relative w-11 h-6 bg-gray-200 rounded-full transition-colors" :class="{ 'bg-[#FF5C1A]': form.enableTransferFee }">
                <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform" :class="{ 'translate-x-5': form.enableTransferFee }"></div>
              </div>
            </div>
          </div>

          <!-- Platform Processing Fee -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">platform processing fee (₦)</label>
              <button @click="showInfo('processingFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.platformProcessingFee"
              type="number" required min="0"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.platformProcessingFee > 200" class="text-[10px] font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              ⚠️ warning: a high processing fee (₦{{ form.platformProcessingFee }}) may cause students to abandon their orders at checkout. recommended: ₦0 – ₦100.
            </p>
            <p v-else-if="form.platformProcessingFee !== originalForm.platformProcessingFee" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from ₦{{ originalForm.platformProcessingFee }} → ₦{{ form.platformProcessingFee }}.
            </p>
            <div v-if="activeInfo === 'processingFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>a flat fee added at checkout to cover payment gateway costs (paystack charges ~1.5% + ₦100). high values (₦300+) cause "checkout shock" and abandoned carts. recommended: keep at ₦0 and absorb gateway costs into the convenience fee instead.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>

          <!-- Platform Service Fee % -->
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">platform service fee (%)</label>
              <button @click="showInfo('serviceFee')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="form.platformServiceFeePercentage"
              type="number" required min="0" max="100"
              class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
            />
            <p v-if="form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
              <AlertTriangle class="w-3 h-3" />
              changing from {{ originalForm.platformServiceFeePercentage }}% → {{ form.platformServiceFeePercentage }}%. on a ₦5,000 order, erranders earns ₦{{ Math.round(5000 * form.platformServiceFeePercentage / 100) }} as service fee.
            </p>
            <div v-if="activeInfo === 'serviceFee'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-semibold">what is this?</p>
              <p>a percentage of the total order value taken by the platform. this is essentially the vendor commission — the percentage erranders deducts before paying out the vendor. industry standard is 10%–30%. this is your biggest silent revenue driver.</p>
              <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 1C: Food Markup -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center">
            <Tag class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">menu pricing strategy</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">controls how menu item prices appear to students</p>
          </div>
        </div>

        <div class="sm:w-1/2 space-y-2">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-400 ml-1 lowercase">food markup (%)</label>
            <button @click="showInfo('foodMarkup')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
              <Info class="w-3 h-3" />
            </button>
          </div>
          <input 
            v-model.number="form.foodMarkupPercentage"
            type="number" required min="0" max="100"
            class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-2xl text-base font-medium focus:bg-white focus:border-[#FF5C1A]/30 outline-none transition-all"
          />
          <div v-if="form.foodMarkupPercentage === 0" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium leading-relaxed flex items-center gap-2 border border-emerald-100">
            <CheckCircle class="w-4 h-4 flex-shrink-0" />
            <span>0% markup = students pay exactly what the vendor charges. this builds maximum trust and drives adoption, but you must compensate with strong service fees and commissions.</span>
          </div>
          <p v-else-if="form.foodMarkupPercentage !== originalForm.foodMarkupPercentage" class="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
            <AlertTriangle class="w-3 h-3" />
            changing from {{ originalForm.foodMarkupPercentage }}% → {{ form.foodMarkupPercentage }}%. a ₦2,000 item will now show as ₦{{ Math.round(2000 * (1 + form.foodMarkupPercentage / 100)) }} on the app.
          </p>
          <div v-if="activeInfo === 'foodMarkup'" class="p-3 bg-blue-50 text-blue-800 rounded-xl text-[11px] font-medium leading-relaxed space-y-1 border border-blue-100">
            <p class="font-semibold">what is this?</p>
            <p>inflates vendor menu prices by this percentage on the student app. e.g. at 15%, a ₦2,000 item becomes ₦2,300. the extra ₦300 goes to erranders. set to 0% for "same as in-store" pricing (recommended for trust-building).</p>
            <button @click="activeInfo = ''" class="text-blue-500 underline">dismiss</button>
          </div>
        </div>
      </div>

      <!-- Revenue Impact Calculator -->
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-[2rem] text-white space-y-4 border border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Calculator class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium lowercase">revenue impact calculator</h3>
            <p class="text-sm text-gray-400 lowercase">estimated platform earnings per order based on current settings</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">convenience fee</p>
            <p class="text-xl font-semibold mt-1">₦{{ form.convenienceFee }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">delivery commission</p>
            <p class="text-xl font-semibold mt-1">₦{{ form.commissionFlatFee }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p class="text-[10px] text-gray-400 uppercase tracking-wider">processing fee</p>
            <p class="text-xl font-semibold mt-1">₦{{ form.platformProcessingFee }}</p>
          </div>
          <div class="bg-[#FF5C1A]/20 rounded-2xl p-4 border border-[#FF5C1A]/30">
            <p class="text-[10px] text-[#FF5C1A] uppercase tracking-wider font-semibold">est. revenue / order</p>
            <p class="text-xl font-semibold mt-1 text-[#FF5C1A]">₦{{ estimatedRevenue }}</p>
          </div>
        </div>
        <p class="text-[10px] text-gray-500 lowercase">* excludes platform service fee ({{ form.platformServiceFeePercentage }}% of food value) which varies per order size. on a ₦5,000 food order, add ₦{{ Math.round(5000 * form.platformServiceFeePercentage / 100) }}.</p>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button 
          @click="confirmSave('pricing')" 
          :disabled="saving"
          class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
        >
          <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          <span>{{ saving ? 'saving...' : 'save pricing settings' }}</span>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 2: COMMUNICATIONS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'comms'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Bell class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">notification channels</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">control how the platform communicates with users</p>
          </div>
        </div>

        <!-- Email Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-50">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">email notifications</h4>
            <p class="text-sm text-gray-500 lowercase">order confirmations, receipts, OTPs, and marketing emails</p>
            <p v-if="!commsForm.emailsEnabled" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              disabling emails will stop all OTPs, receipts, and transactional emails. users may not be able to log in.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="commsForm.emailsEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <!-- Push Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-50">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">push notifications</h4>
            <p class="text-sm text-gray-500 lowercase">real-time alerts on mobile and desktop via FCM</p>
            <p v-if="!commsForm.pushNotificationsEnabled" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              disabling push notifications means vendors and riders won't receive instant new order alerts.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="commsForm.pushNotificationsEnabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="confirmSave('comms')" 
            :disabled="savingComms"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingComms" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingComms ? 'saving...' : 'save communications' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 3: ADVERTS & MONETIZATION -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'adverts'" class="space-y-8">
      
      <!-- Top Overview Banner -->
      <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-gray-200/50">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-[#FF5C1A]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles class="w-3.5 h-3.5" />
              <span>Campus Monetization & Media Network</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">Adverts & Sponsored Placements</h2>
            <p class="text-gray-400 text-sm max-w-xl font-medium leading-relaxed">
              Manage in-app popups, brand takeovers, rotation intervals, and monitor impression & click performance across the student body.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="openCreateAdModal"
              class="px-5 py-3.5 bg-[#FF5C1A] text-white rounded-2xl font-bold text-sm hover:bg-[#e04e10] transition-all shadow-lg shadow-[#FF5C1A]/30 flex items-center gap-2 shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>create new ad</span>
            </button>
            <button 
              @click="confirmSave('adverts')" 
              :disabled="savingAdvert"
              class="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all backdrop-blur-md flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Loader2 v-if="savingAdvert" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              <span>{{ savingAdvert ? 'saving...' : 'save settings' }}</span>
            </button>
          </div>
        </div>

        <!-- Metric Stat Pills -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div class="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm">
            <p class="text-xs text-gray-400 font-semibold lowercase">total ads</p>
            <p class="text-xl font-black text-white mt-1">{{ advertForm.customAds?.length || 0 }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm">
            <p class="text-xs text-gray-400 font-semibold lowercase">active now</p>
            <p class="text-xl font-black text-green-400 mt-1">{{ activeAdsCount }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm">
            <p class="text-xs text-gray-400 font-semibold lowercase">total impressions</p>
            <p class="text-xl font-black text-orange-400 mt-1">{{ totalImpressions.toLocaleString() }}</p>
          </div>
          <div class="bg-white/5 rounded-2xl p-3.5 backdrop-blur-sm">
            <p class="text-xs text-gray-400 font-semibold lowercase">total clicks (ctr)</p>
            <p class="text-xl font-black text-indigo-400 mt-1">{{ totalClicks }} ({{ overallCtr }}%)</p>
          </div>
        </div>
      </div>

      <!-- Global Engine Configuration -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center">
            <Megaphone class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900 lowercase">global engine configuration</h3>
            <p class="text-xs font-medium text-gray-400 lowercase">frequency capping, display mode, and auto-dismiss behavior</p>
          </div>
        </div>

        <!-- Master Switch -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-gray-900 lowercase">master ads switch</h4>
              <span 
                :class="advertForm.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'" 
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              >
                {{ advertForm.enabled ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
            <p class="text-xs text-gray-500 lowercase">show promotional modals to students across the customer app</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="advertForm.enabled" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <!-- Delivery Mode Selection Cards -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700 lowercase">ad delivery mode</label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div 
              @click="advertForm.contentType = 'custom'"
              :class="advertForm.contentType === 'custom' ? 'border-[#FF5C1A] bg-orange-50/40 ring-2 ring-[#FF5C1A]/10' : 'border-gray-200 bg-white hover:bg-gray-50'"
              class="p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-gray-900 lowercase">custom ads (sponsor)</span>
                <span v-if="advertForm.contentType === 'custom'" class="w-2 h-2 rounded-full bg-[#FF5C1A]"></span>
              </div>
              <p class="text-xs text-gray-500 lowercase">strictly rotates among active custom ads (waris kitchen, barter, sponsored campaigns).</p>
            </div>

            <div 
              @click="advertForm.contentType = 'hybrid'"
              :class="advertForm.contentType === 'hybrid' ? 'border-[#FF5C1A] bg-orange-50/40 ring-2 ring-[#FF5C1A]/10' : 'border-gray-200 bg-white hover:bg-gray-50'"
              class="p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-gray-900 lowercase">smart hybrid (recommended)</span>
                <span v-if="advertForm.contentType === 'hybrid'" class="w-2 h-2 rounded-full bg-[#FF5C1A]"></span>
              </div>
              <p class="text-xs text-gray-500 lowercase">50% custom sponsor ads, 50% dynamic campus vendors & top erranders.</p>
            </div>

            <div 
              @click="advertForm.contentType = 'dynamic'"
              :class="advertForm.contentType === 'dynamic' ? 'border-[#FF5C1A] bg-orange-50/40 ring-2 ring-[#FF5C1A]/10' : 'border-gray-200 bg-white hover:bg-gray-50'"
              class="p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-gray-900 lowercase">dynamic only</span>
                <span v-if="advertForm.contentType === 'dynamic'" class="w-2 h-2 rounded-full bg-[#FF5C1A]"></span>
              </div>
              <p class="text-xs text-gray-500 lowercase">automatically pulls popular campus restaurants and online dispatchers.</p>
            </div>
          </div>
        </div>

        <!-- Frequency & Auto-Close Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-gray-700 lowercase">display frequency interval (minutes)</label>
              <span class="text-xs font-bold text-gray-400">every {{ advertForm.intervalMinutes }} min</span>
            </div>
            <input 
              v-model.number="advertForm.intervalMinutes"
              type="number" required min="1" max="180"
              class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-semibold focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
            />
            <p v-if="advertForm.intervalMinutes < 5" class="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl flex items-center gap-1.5 border border-red-100">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0" />
              <span>Intervals under 5 minutes are aggressive and may increase student churn.</span>
            </p>
            <p v-else class="text-xs text-gray-400">Recommended: 10–25 minutes. Suppressed on cart and live chat pages.</p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-gray-700 lowercase">auto-dismiss countdown (seconds)</label>
            <input 
              v-model.number="advertForm.autoCloseSeconds"
              type="number" required min="0" max="60"
              class="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-base font-semibold focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
            />
            <p class="text-xs text-gray-400">Set to 0 to require the student to manually click dismiss (recommended for high engagement).</p>
          </div>
        </div>
      </div>

      <!-- Custom Ads Inventory -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 class="text-base font-bold text-gray-900 lowercase">custom ads inventory ({{ advertForm.customAds?.length || 0 }})</h3>
            <p class="text-xs font-medium text-gray-400 lowercase">manage individual client campaigns, creative copy, badges, and landing targets</p>
          </div>
          <button 
            @click="openCreateAdModal"
            class="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-[#FF5C1A] transition-colors flex items-center gap-1.5 w-max"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>add new custom ad</span>
          </button>
        </div>

        <!-- Ad Cards Grid -->
        <div v-if="advertForm.customAds && advertForm.customAds.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(ad, index) in advertForm.customAds" 
            :key="ad.id || index"
            class="rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between"
          >
            <!-- Card Header Image & Overlay -->
            <div class="relative h-36 bg-gray-100 overflow-hidden">
              <img 
                :src="ad.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'" 
                :alt="ad.title" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>
              
              <!-- Badges -->
              <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-[#FF5C1A] shadow-sm">
                  {{ ad.badgeText || 'Deal' }}
                </span>
                <span 
                  :class="ad.isActive !== false ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ ad.isActive !== false ? 'Active' : 'Paused' }}
                </span>
              </div>

              <div class="absolute bottom-2.5 left-3 right-3">
                <p class="text-[11px] font-bold text-white/80 lowercase">
                  {{ ad.advertiserName ? 'sponsor: ' + ad.advertiserName : 'platform ad' }}
                </p>
                <h4 class="text-white font-black text-base truncate">{{ ad.title }}</h4>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {{ ad.description }}
              </p>

              <!-- CTA details -->
              <div class="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span class="font-bold text-gray-700 truncate max-w-[150px]">
                  CTA: {{ ad.ctaText }}
                </span>
                <span class="text-gray-400 font-mono text-[10px] truncate max-w-[140px]">
                  {{ ad.ctaLink }}
                </span>
              </div>

              <!-- Metrics -->
              <div class="grid grid-cols-3 gap-2 text-center pt-1 border-t border-gray-100">
                <div class="py-1">
                  <p class="text-[10px] text-gray-400 lowercase font-medium">views</p>
                  <p class="text-xs font-bold text-gray-800">{{ ad.impressions || 0 }}</p>
                </div>
                <div class="py-1">
                  <p class="text-[10px] text-gray-400 lowercase font-medium">clicks</p>
                  <p class="text-xs font-bold text-[#FF5C1A]">{{ ad.clicks || 0 }}</p>
                </div>
                <div class="py-1">
                  <p class="text-[10px] text-gray-400 lowercase font-medium">ctr</p>
                  <p class="text-xs font-bold text-indigo-600">
                    {{ calculateCtr(ad.impressions, ad.clicks) }}%
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <div class="flex items-center gap-1.5">
                  <button 
                    @click="previewAd(ad)"
                    title="Live Student Preview"
                    class="p-2 bg-gray-100 hover:bg-orange-50 hover:text-[#FF5C1A] rounded-xl text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>preview</span>
                  </button>
                  <button 
                    @click="toggleAdActive(index)"
                    :class="ad.isActive !== false ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'"
                    class="p-2 rounded-xl text-xs font-semibold transition-colors"
                  >
                    {{ ad.isActive !== false ? 'pause' : 'activate' }}
                  </button>
                </div>

                <div class="flex items-center gap-1">
                  <button 
                    @click="editAd(index)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Ad"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deleteAd(index)"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Ad"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
          <Megaphone class="w-8 h-8 text-gray-400 mx-auto" />
          <p class="text-sm font-semibold text-gray-700">No custom ads created yet</p>
          <p class="text-xs text-gray-400 max-w-sm mx-auto">Create custom ads for campus vendors, barter promotions, or external sponsors to start generating ad revenue.</p>
          <button 
            @click="openCreateAdModal" 
            class="px-4 py-2 bg-[#FF5C1A] text-white rounded-xl text-xs font-bold hover:bg-[#e04e10] transition-colors"
          >
            Create First Ad
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 4: CAMPAIGNS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'campaigns'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <Moon class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">exam brethren campaign</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">night owl free delivery and brethren split discounts</p>
          </div>
        </div>

        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-50">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">enable campaign</h4>
            <p class="text-sm text-gray-500 lowercase">activates free delivery (10pm-2am) and 10% group discounts</p>
            <p v-if="examBrethrenForm.isActive" class="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <CheckCircle class="w-3 h-3" />
              active — students ordering between 10pm and 2am get free delivery. this boosts late-night orders but absorbs delivery costs.
            </p>
            <p v-else class="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              inactive — no special night promotions are running.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="examBrethrenForm.isActive" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF5C1A]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
          </label>
        </div>

        <div class="flex justify-end pt-2">
          <button 
            @click="confirmSave('campaigns')" 
            :disabled="savingExamBrethren"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingExamBrethren" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingExamBrethren ? 'saving...' : 'save campaign settings' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 5: ERRANDERS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'erranders'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
            <Briefcase class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">errander operations</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">configure errander operational limits</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">max concurrent orders</label>
              <button @click="showInfo('maxConcurrentOrders')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="erranderForm.maxConcurrentOrders"
              type="number" required min="0"
              class="w-full bg-gray-50 border border-gray-50 text-gray-900 text-sm rounded-2xl focus:ring-[#FF5C1A] focus:border-[#FF5C1A] block px-5 py-3.5 transition-all outline-none" 
            />
            
            <div v-if="activeInfo === 'maxConcurrentOrders'" class="bg-gray-900 text-white p-4 rounded-xl text-sm space-y-2 relative mt-2 animate-scale-in">
              <div class="absolute -top-1.5 left-10 w-3 h-3 bg-gray-900 rotate-45"></div>
              <p>the maximum number of orders an errander can accept at the same time.</p>
              <ul class="list-disc pl-4 space-y-1 text-gray-300">
                <li>0 means infinite (no limit)</li>
                <li>any number above 0 enforces a hard cap</li>
              </ul>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-400 ml-1 lowercase">minimum payout (₦)</label>
              <button @click="showInfo('minimumPayout')" class="w-4 h-4 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                <Info class="w-3 h-3" />
              </button>
            </div>
            <input 
              v-model.number="erranderForm.minimumPayout"
              type="number" required min="100" step="100"
              class="w-full bg-gray-50 border border-gray-50 text-gray-900 text-sm rounded-2xl focus:ring-[#FF5C1A] focus:border-[#FF5C1A] block px-5 py-3.5 transition-all outline-none" 
            />
            
            <div v-if="activeInfo === 'minimumPayout'" class="bg-gray-900 text-white p-4 rounded-xl text-sm space-y-2 relative mt-2 animate-scale-in">
              <div class="absolute -top-1.5 left-10 w-3 h-3 bg-gray-900 rotate-45"></div>
              <p>the minimum amount (in naira) an errander must have in their wallet before they can withdraw funds.</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-6 border-t border-gray-50">
          <button 
            @click="confirmSave('erranders')" 
            :disabled="savingErrander"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium lowercase hover:bg-[#FF5C1A] transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingErrander" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingErrander ? 'saving...' : 'save errander settings' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- TAB 6: PLATFORM STATUS -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <div v-show="activeTab === 'platform'" class="space-y-8">
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-50 shadow-sm space-y-6">
        <div class="flex items-center gap-3 border-b border-gray-50 pb-4">
          <div class="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <Lock class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900 lowercase">platform access</h3>
            <p class="text-sm font-bold text-gray-400 lowercase">close the platform for maintenance</p>
          </div>
        </div>

        <!-- Student App Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-50">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">student app</h4>
            <p class="text-sm text-gray-500 lowercase">close the student-facing app for maintenance</p>
            <p v-if="platformForm.isStudentAppClosed" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              student app is closed. students will see a maintenance screen.
            </p>
            <p v-else class="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <CheckCircle class="w-3 h-3" />
              student app is open.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="platformForm.isStudentAppClosed" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>

        <!-- Vendor App Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-50">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">vendor app</h4>
            <p class="text-sm text-gray-500 lowercase">close the vendor/merchant app for maintenance</p>
            <p v-if="platformForm.isVendorAppClosed" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              vendor app is closed. vendors will see a maintenance screen.
            </p>
            <p v-else class="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <CheckCircle class="w-3 h-3" />
              vendor app is open.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="platformForm.isVendorAppClosed" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>

        <!-- Dispatch App Toggle -->
        <div class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-50">
          <div class="space-y-1">
            <h4 class="text-sm font-medium text-gray-900 lowercase">dispatch app</h4>
            <p class="text-sm text-gray-500 lowercase">close the errand ninja / dispatch app for maintenance</p>
            <p v-if="platformForm.isDispatchAppClosed" class="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <AlertTriangle class="w-3 h-3" />
              dispatch app is closed. riders will see a maintenance screen.
            </p>
            <p v-else class="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg inline-flex items-center gap-1 mt-1">
              <CheckCircle class="w-3 h-3" />
              dispatch app is open.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="platformForm.isDispatchAppClosed" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>

        <div class="flex justify-end pt-6 border-t border-gray-50">
          <button 
            @click="confirmSave('platform')" 
            :disabled="savingPlatform"
            class="px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium lowercase hover:bg-red-500 transition-all shadow-xl shadow-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="savingPlatform" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ savingPlatform ? 'saving...' : 'save platform status' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- CONFIRMATION MODAL -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmModal.show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="confirmModal.show = false"></div>
          <div class="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-5 animate-scale-in">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <ShieldAlert class="w-7 h-7" />
            </div>

            <div class="text-center space-y-2">
              <h3 class="text-lg font-medium text-gray-900 lowercase">confirm changes</h3>
              <p class="text-sm text-gray-500 lowercase">{{ confirmModal.message }}</p>
            </div>

            <!-- Change Summary -->
            <div v-if="confirmModal.changes.length" class="bg-gray-50 rounded-2xl p-4 space-y-2 max-h-48 overflow-y-auto border border-gray-50">
              <div v-for="(change, i) in confirmModal.changes" :key="i" class="text-sm font-medium text-gray-600 flex items-start gap-2">
                <span class="text-amber-500 mt-0.5">•</span>
                <span v-html="change"></span>
              </div>
            </div>

            <div class="flex gap-3">
              <button @click="confirmModal.show = false" class="flex-1 px-5 py-3.5 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium lowercase hover:bg-gray-200 transition-colors">
                cancel
              </button>
              <button @click="executeConfirmedSave" class="flex-1 px-5 py-3.5 bg-[#FF5C1A] text-white rounded-2xl text-sm font-medium lowercase hover:bg-[#e04e10] transition-colors">
                confirm & save
              </button>
            </div>
          </div>
        </div>
      </Transition>
    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- CREATE / EDIT ADVERT MODAL -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isAdModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isAdModalOpen = false"></div>
          <div class="relative bg-white rounded-[2rem] p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            
            <div class="flex items-center justify-between border-b border-gray-100 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center">
                  <Megaphone class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ editingAdIndex !== null ? 'Edit Advert' : 'Create Custom Advert' }}</h3>
                  <p class="text-xs text-gray-400">Configure sponsored campaign details & student call to action</p>
                </div>
              </div>
              <button @click="isAdModalOpen = false" class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Form -->
            <div class="space-y-4">
              <!-- Advertiser Name & Badge -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-gray-700 lowercase">advertiser / sponsor name</label>
                  <input 
                    v-model="adModalForm.advertiserName" 
                    type="text" 
                    placeholder="e.g. Waris Kitchen or PalmPay" 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-gray-700 lowercase">pill badge tag</label>
                  <input 
                    v-model="adModalForm.badgeText" 
                    type="text" 
                    placeholder="e.g. 🔥 20% Off or ⚡ Flash Deal" 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Headline Title -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-700 lowercase">campaign headline / title *</label>
                <input 
                  v-model="adModalForm.title" 
                  type="text" 
                  placeholder="e.g. Waris Kitchen Weekend Special" 
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
                />
              </div>

              <!-- Description -->
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-gray-700 lowercase">promotional copy / description</label>
                <textarea 
                  v-model="adModalForm.description" 
                  rows="3" 
                  placeholder="Describe the offer, discount or special promotion..." 
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-[#FF5C1A] outline-none transition-all resize-none"
                ></textarea>
              </div>

              <!-- Image URL & Preset Selection -->
              <div class="space-y-2">
                <label class="text-xs font-bold text-gray-700 lowercase">banner image url</label>
                <input 
                  v-model="adModalForm.imageUrl" 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
                />
                
                <!-- Quick Preset Pickers -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mr-1">presets:</span>
                  <button 
                    type="button"
                    @click="setPresetImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 hover:bg-orange-100 hover:text-[#FF5C1A] transition-colors"
                  >
                    🍔 Food & Meals
                  </button>
                  <button 
                    type="button"
                    @click="setPresetImage('https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 hover:bg-orange-100 hover:text-[#FF5C1A] transition-colors"
                  >
                    🔄 Barter & Trades
                  </button>
                  <button 
                    type="button"
                    @click="setPresetImage('https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 hover:bg-orange-100 hover:text-[#FF5C1A] transition-colors"
                  >
                    📦 Logistics & Courier
                  </button>
                  <button 
                    type="button"
                    @click="setPresetImage('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80')"
                    class="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 hover:bg-orange-100 hover:text-[#FF5C1A] transition-colors"
                  >
                    💻 Tech & Repairs
                  </button>
                </div>
              </div>

              <!-- Button Text & Link -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-gray-700 lowercase">button cta text *</label>
                  <input 
                    v-model="adModalForm.ctaText" 
                    type="text" 
                    placeholder="e.g. Order Now or Claim Deal" 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
                  />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-gray-700 lowercase">button cta target link *</label>
                  <input 
                    v-model="adModalForm.ctaLink" 
                    type="text" 
                    placeholder="e.g. /vendors or https://..." 
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:border-[#FF5C1A] outline-none transition-all"
                  />
                </div>
              </div>

              <!-- Active Toggle -->
              <div class="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <span class="text-xs font-bold text-gray-800">Publish Immediately (Active)</span>
                <input type="checkbox" v-model="adModalForm.isActive" class="w-4 h-4 text-[#FF5C1A] rounded focus:ring-[#FF5C1A] cursor-pointer" />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex gap-3 pt-3 border-t border-gray-100">
              <button 
                type="button" 
                @click="isAdModalOpen = false" 
                class="flex-1 px-5 py-3.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                @click="saveAdFromModal" 
                class="flex-1 px-5 py-3.5 bg-[#FF5C1A] text-white rounded-xl text-sm font-bold hover:bg-[#e04e10] transition-colors shadow-lg shadow-[#FF5C1A]/20"
              >
                {{ editingAdIndex !== null ? 'Update Advert' : 'Add to Inventory' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ═══════════════════════════════════════════════════════ -->
    <!-- LIVE STUDENT IN-APP PREVIEW MODAL -->
    <!-- ═══════════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isLivePreviewOpen && previewAdData" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="isLivePreviewOpen = false"></div>
          
          <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in">
            <!-- Close simulation button -->
            <button 
              @click="isLivePreviewOpen = false"
              class="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all"
            >
              <X class="w-4 h-4" />
            </button>

            <!-- Banner image with overlay -->
            <div class="h-44 w-full bg-gradient-to-r from-orange-500 to-amber-500 relative overflow-hidden" v-if="previewAdData.imageUrl">
              <img :src="previewAdData.imageUrl" alt="Preview Banner" class="absolute inset-0 w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/95 text-[#FF5C1A] backdrop-blur-md shadow-sm">
                  {{ previewAdData.badgeText || '🔥 Featured Deal' }}
                </span>
                <span v-if="previewAdData.advertiserName" class="text-[10px] font-bold text-white/90 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  {{ previewAdData.advertiserName }}
                </span>
              </div>
            </div>

            <!-- Content body -->
            <div class="p-6 text-center space-y-3">
              <h3 class="text-xl font-black text-gray-900 leading-tight">
                {{ previewAdData.title }}
              </h3>
              <p class="text-xs text-gray-500 leading-relaxed font-medium">
                {{ previewAdData.description }}
              </p>

              <button class="w-full py-3.5 bg-[#FF5C1A] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#e65318] transition-all flex items-center justify-center gap-2 group mt-2">
                <span>{{ previewAdData.ctaText || 'Check It Out' }}</span>
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div class="pt-2">
                <p class="text-[10px] text-gray-400 font-mono">
                  target: {{ previewAdData.ctaLink }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  Zap, Loader2, Truck, DollarSign, Tag, Bell, Megaphone, Moon, Info, AlertTriangle, 
  CheckCircle, Calculator, Save, ShieldAlert, Briefcase, Lock, Plus, Trash2, Edit3, 
  Eye, X, ExternalLink, BarChart2, Sparkles, Check, ArrowRight 
} from 'lucide-vue-next';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({ layout: 'admin' });

const { showToast } = useCustomToast();
const route = useRoute();

// ─── Tab Navigation ────────────────
const activeTab = ref('pricing');
if (route.query.tab) {
  activeTab.value = String(route.query.tab);
}

const tabs = [
  { id: 'pricing', label: 'pricing & revenue', icon: DollarSign },
  { id: 'comms', label: 'communications', icon: Bell },
  { id: 'adverts', label: 'adverts & monetization', icon: Megaphone },
  { id: 'campaigns', label: 'campaigns', icon: Moon },
  { id: 'erranders', label: 'erranders', icon: Briefcase },
  { id: 'platform', label: 'platform status', icon: Lock },
];

// ─── Info Tooltips ────────────────
const activeInfo = ref('');
const showInfo = (key: string) => {
  activeInfo.value = activeInfo.value === key ? '' : key;
};

// ─── Form State ────────────────
const saving = ref(false);
const savingComms = ref(false);
const savingAdvert = ref(false);
const savingExamBrethren = ref(false);
const savingErrander = ref(false);
const savingPlatform = ref(false);

const erranderForm = reactive({
  maxConcurrentOrders: 0,
  minimumPayout: 1000,
});

const form = reactive({
  baseFee: 450,
  expressFee: 850,
  roomDeliveryFee: 350,
  dropoffServiceFee: 300,
  platformFee: 100,
  convenienceFee: 100,
  commissionFlatFee: 100,
  customErrandCommissionPercentage: 20,
  customErrandSafetyBufferPercentage: 20,
  minCustomErrandFee: 300,
  enableTransferFee: false,
  minOutsideCampusFee: 450,
  minCampusEnvironsFee: 350,
  platformProcessingFee: 500,
  platformServiceFeePercentage: 5,
  foodMarkupPercentage: 5,
});

const originalForm = reactive({ ...form });

const commsForm = reactive({
  emailsEnabled: true,
  pushNotificationsEnabled: true,
});

const advertForm = reactive({
  enabled: true,
  intervalMinutes: 15,
  autoCloseSeconds: 0,
  contentType: 'custom',
  customAd: {
    title: '',
    description: '',
    imageUrl: '',
    ctaText: '',
    ctaLink: '',
  },
  customAds: [] as any[],
});

// ─── Custom Ads Manager State ────────────────
const isAdModalOpen = ref(false);
const editingAdIndex = ref<number | null>(null);
const adModalForm = reactive({
  id: '',
  title: '',
  description: '',
  badgeText: '',
  imageUrl: '',
  ctaText: '',
  ctaLink: '',
  advertiserName: '',
  isActive: true,
  placement: 'both',
  impressions: 0,
  clicks: 0,
});

const isLivePreviewOpen = ref(false);
const previewAdData = ref<any>(null);

const activeAdsCount = computed(() => {
  return advertForm.customAds?.filter(a => a.isActive !== false).length || 0;
});

const totalImpressions = computed(() => {
  return advertForm.customAds?.reduce((sum, a) => sum + (Number(a.impressions) || 0), 0) || 0;
});

const totalClicks = computed(() => {
  return advertForm.customAds?.reduce((sum, a) => sum + (Number(a.clicks) || 0), 0) || 0;
});

const overallCtr = computed(() => {
  if (!totalImpressions.value) return '0.0';
  return ((totalClicks.value / totalImpressions.value) * 100).toFixed(1);
});

const calculateCtr = (impressions?: number, clicks?: number) => {
  const imp = Number(impressions) || 0;
  const clk = Number(clicks) || 0;
  if (!imp) return '0.0';
  return ((clk / imp) * 100).toFixed(1);
};

const openCreateAdModal = () => {
  editingAdIndex.value = null;
  Object.assign(adModalForm, {
    id: 'ad-' + Date.now(),
    title: '',
    description: '',
    badgeText: '🔥 Student Deal',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ctaText: 'Claim Offer',
    ctaLink: '/vendors',
    advertiserName: '',
    isActive: true,
    placement: 'both',
    impressions: 0,
    clicks: 0,
  });
  isAdModalOpen.value = true;
};

const editAd = (index: number) => {
  editingAdIndex.value = index;
  const ad = advertForm.customAds[index];
  Object.assign(adModalForm, {
    id: ad.id || 'ad-' + Date.now(),
    title: ad.title || '',
    description: ad.description || '',
    badgeText: ad.badgeText || '🔥 Deal',
    imageUrl: ad.imageUrl || '',
    ctaText: ad.ctaText || 'Learn More',
    ctaLink: ad.ctaLink || '/vendors',
    advertiserName: ad.advertiserName || '',
    isActive: ad.isActive !== false,
    placement: ad.placement || 'both',
    impressions: ad.impressions || 0,
    clicks: ad.clicks || 0,
  });
  isAdModalOpen.value = true;
};

const saveAdFromModal = () => {
  if (!adModalForm.title.trim()) {
    showToast({ title: 'error', message: 'headline is required for the ad.', toastType: 'error' });
    return;
  }
  if (!adModalForm.ctaText.trim()) {
    showToast({ title: 'error', message: 'button text is required.', toastType: 'error' });
    return;
  }
  if (!adModalForm.ctaLink.trim()) {
    showToast({ title: 'error', message: 'button link is required.', toastType: 'error' });
    return;
  }

  const adItem = { ...adModalForm };
  if (!advertForm.customAds) advertForm.customAds = [];

  if (editingAdIndex.value !== null && editingAdIndex.value >= 0) {
    advertForm.customAds[editingAdIndex.value] = adItem;
    showToast({ title: 'success', message: 'ad updated! Remember to save settings.', toastType: 'success' });
  } else {
    advertForm.customAds.unshift(adItem);
    showToast({ title: 'success', message: 'new ad added! Remember to save settings.', toastType: 'success' });
  }

  isAdModalOpen.value = false;
};

const deleteAd = (index: number) => {
  if (confirm('Are you sure you want to remove this advert?')) {
    advertForm.customAds.splice(index, 1);
    showToast({ title: 'info', message: 'ad removed. Remember to save settings.', toastType: 'info' });
  }
};

const toggleAdActive = (index: number) => {
  advertForm.customAds[index].isActive = !advertForm.customAds[index].isActive;
};

const previewAd = (ad: any) => {
  previewAdData.value = ad;
  isLivePreviewOpen.value = true;
};

const setPresetImage = (url: string) => {
  adModalForm.imageUrl = url;
};

const examBrethrenForm = reactive({
  isActive: false,
});

const platformForm = reactive({
  isStudentAppClosed: false,
  isVendorAppClosed: false,
  isDispatchAppClosed: false,
});

// ─── Revenue Calculator ────────────────
const estimatedRevenue = computed(() => {
  return form.convenienceFee + form.commissionFlatFee + form.platformProcessingFee;
});

// ─── Confirmation Modal ────────────────
const confirmModal = reactive({
  show: false,
  type: '' as string,
  message: '',
  changes: [] as string[],
});

const confirmSave = (type: string) => {
  confirmModal.type = type;
  confirmModal.changes = [];

  if (type === 'pricing') {
    confirmModal.message = 'you are about to update the platform pricing and revenue settings. these changes take effect immediately for all new orders.';
    if (form.baseFee !== originalForm.baseFee) confirmModal.changes.push(`standard base fee: <strong>₦${originalForm.baseFee}</strong> → <strong>₦${form.baseFee}</strong>`);
    if (form.expressFee !== originalForm.expressFee) confirmModal.changes.push(`express base fee: <strong>₦${originalForm.expressFee}</strong> → <strong>₦${form.expressFee}</strong>`);
    if (form.convenienceFee !== originalForm.convenienceFee) confirmModal.changes.push(`convenience fee: <strong>₦${originalForm.convenienceFee}</strong> → <strong>₦${form.convenienceFee}</strong>`);
    if (form.commissionFlatFee !== originalForm.commissionFlatFee) confirmModal.changes.push(`runner commission (food): <strong>₦${originalForm.commissionFlatFee}</strong> → <strong>₦${form.commissionFlatFee}</strong>`);
    if (form.customErrandCommissionPercentage !== originalForm.customErrandCommissionPercentage) confirmModal.changes.push(`runner commission (custom): <strong>${originalForm.customErrandCommissionPercentage}%</strong> → <strong>${form.customErrandCommissionPercentage}%</strong>`);
    if (form.minCustomErrandFee !== originalForm.minCustomErrandFee) confirmModal.changes.push(`min custom errand fee: <strong>₦${originalForm.minCustomErrandFee}</strong> → <strong>₦${form.minCustomErrandFee}</strong>`);
    if (form.enableTransferFee !== originalForm.enableTransferFee) confirmModal.changes.push(`enable transfer fee: <strong>${originalForm.enableTransferFee}</strong> → <strong>${form.enableTransferFee}</strong>`);
    if (form.platformProcessingFee !== originalForm.platformProcessingFee) confirmModal.changes.push(`processing fee: <strong>₦${originalForm.platformProcessingFee}</strong> → <strong>₦${form.platformProcessingFee}</strong>`);
    if (form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage) confirmModal.changes.push(`service fee: <strong>${originalForm.platformServiceFeePercentage}%</strong> → <strong>${form.platformServiceFeePercentage}%</strong>`);
    if (form.foodMarkupPercentage !== originalForm.foodMarkupPercentage) confirmModal.changes.push(`food markup: <strong>${originalForm.foodMarkupPercentage}%</strong> → <strong>${form.foodMarkupPercentage}%</strong>`);
    if (confirmModal.changes.length === 0) confirmModal.changes.push('no changes detected — saving current values.');
  } else if (type === 'comms') {
    confirmModal.message = 'you are about to update communication channel settings. this controls whether users receive emails and push notifications.';
    confirmModal.changes.push(`emails: <strong>${commsForm.emailsEnabled ? 'enabled' : 'disabled'}</strong>`);
    confirmModal.changes.push(`push notifications: <strong>${commsForm.pushNotificationsEnabled ? 'enabled' : 'disabled'}</strong>`);
    if (!commsForm.emailsEnabled) confirmModal.changes.push(`<span class="text-red-600">⚠️ warning: disabling emails will prevent OTP delivery and user login.</span>`);
  } else if (type === 'adverts') {
    confirmModal.message = 'you are about to update advert popup settings. this affects the promotional popups students see inside the app.';
    confirmModal.changes.push(`adverts: <strong>${advertForm.enabled ? 'enabled' : 'disabled'}</strong>`);
    confirmModal.changes.push(`interval: every <strong>${advertForm.intervalMinutes} minutes</strong>`);
    confirmModal.changes.push(`content type: <strong>${advertForm.contentType}</strong>`);
    confirmModal.changes.push(`custom ads count: <strong>${advertForm.customAds?.length || 0} ads</strong>`);
  } else if (type === 'campaigns') {
    confirmModal.message = 'you are about to update the exam brethren campaign. this controls free delivery during late night hours (10pm-2am).';
    confirmModal.changes.push(`campaign: <strong>${examBrethrenForm.isActive ? 'active — free delivery 10pm-2am' : 'inactive'}</strong>`);
    if (examBrethrenForm.isActive) confirmModal.changes.push('note: delivery fees will be waived between 10pm and 2am. this cost is absorbed by the platform.');
  } else if (type === 'erranders') {
    confirmModal.message = 'you are about to update errander configuration. this affects how many orders they can accept at once and their payouts.';
    confirmModal.changes.push(`max concurrent orders: <strong>${erranderForm.maxConcurrentOrders === 0 ? 'infinite (0)' : erranderForm.maxConcurrentOrders}</strong>`);
    confirmModal.changes.push(`minimum payout: <strong>₦${erranderForm.minimumPayout}</strong>`);
  } else if (type === 'platform') {
    confirmModal.message = 'you are about to update platform status for individual apps. each toggle controls maintenance mode independently.';
    confirmModal.changes.push(`student app: <strong>${platformForm.isStudentAppClosed ? '🔴 CLOSED' : '🟢 OPEN'}</strong>`);
    confirmModal.changes.push(`vendor app: <strong>${platformForm.isVendorAppClosed ? '🔴 CLOSED' : '🟢 OPEN'}</strong>`);
    confirmModal.changes.push(`dispatch app: <strong>${platformForm.isDispatchAppClosed ? '🔴 CLOSED' : '🟢 OPEN'}</strong>`);
    if (platformForm.isStudentAppClosed || platformForm.isVendorAppClosed || platformForm.isDispatchAppClosed) confirmModal.changes.push('<span class="text-red-600">⚠️ warning: closed apps will show a maintenance screen to their users.</span>');
  }

  confirmModal.show = true;
};

const executeConfirmedSave = async () => {
  confirmModal.show = false;
  const type = confirmModal.type;

  if (type === 'pricing') await saveSettings();
  else if (type === 'comms') await saveCommunicationsSettings();
  else if (type === 'adverts') await saveAdvertSettings();
  else if (type === 'campaigns') await saveExamBrethrenSettings();
  else if (type === 'erranders') await saveErranderSettings();
  else if (type === 'platform') await savePlatformSettings();
};

// ─── Load Settings ────────────────
const loadSettings = async () => {
  try {
    const [errandRes, commsRes, advertRes, examBrethrenRes, erranderSettingsRes, payoutRes, platformRes] = await Promise.all([
      admin_api.getCustomErrandSettings(),
      admin_api.getCommunicationsSettings(),
      admin_api.getAdvertSettings(),
      admin_api.getExamBrethrenSettings(),
      admin_api.getErranderSettings(),
      admin_api.getPayoutSettings(),
      admin_api.getPlatformStatus()
    ]);
    
    if (errandRes.data) {
      const errandSettings = errandRes.data;
      form.baseFee = errandSettings.baseFee || 450;
      form.expressFee = errandSettings.expressFee || 850;
      form.roomDeliveryFee = errandSettings.roomDeliveryFee || 350;
      form.dropoffServiceFee = errandSettings.dropoffServiceFee || 300;
      form.platformFee = errandSettings.platformFee || errandSettings.convenienceFee || 100;
      form.convenienceFee = errandSettings.convenienceFee ?? errandSettings.platformFee ?? 100;
      form.commissionFlatFee = errandSettings.commissionFlatFee ?? errandSettings.platformFee ?? 100;
      form.customErrandCommissionPercentage = Number(errandSettings.customErrandCommissionPercentage) || 20;
      form.customErrandSafetyBufferPercentage = Number(errandSettings.customErrandSafetyBufferPercentage) || 20;
      form.minCustomErrandFee = errandSettings.minCustomErrandFee != null ? Number(errandSettings.minCustomErrandFee) : 300;
      form.enableTransferFee = errandSettings.enableTransferFee ?? false;
      form.minOutsideCampusFee = Number(errandSettings.minOutsideCampusFee) || 450;
      form.minCampusEnvironsFee = Number(errandSettings.minCampusEnvironsFee) || 350;
      form.platformProcessingFee = Number(errandSettings.platformProcessingFee) || 500;
      form.platformServiceFeePercentage = errandSettings.platformServiceFeePercentage ?? 5;
      form.foodMarkupPercentage = errandSettings.foodMarkupPercentage ?? 5;
      // Snapshot the originals for change detection
      Object.assign(originalForm, { ...form });
    }

    if (commsRes.data) {
      commsForm.emailsEnabled = commsRes.data.emailsEnabled ?? true;
      commsForm.pushNotificationsEnabled = commsRes.data.pushNotificationsEnabled ?? true;
    }

    if (advertRes.data) {
      advertForm.enabled = advertRes.data.enabled ?? true;
      advertForm.intervalMinutes = advertRes.data.intervalMinutes ?? 15;
      advertForm.autoCloseSeconds = advertRes.data.autoCloseSeconds ?? 0;
      advertForm.contentType = advertRes.data.contentType || 'custom';
      advertForm.customAds = Array.isArray(advertRes.data.customAds) ? advertRes.data.customAds : [];
      if (advertRes.data.customAd) {
        advertForm.customAd = { ...advertForm.customAd, ...advertRes.data.customAd };
      }
    }
    
    if (examBrethrenRes.data) {
      examBrethrenForm.isActive = examBrethrenRes.data.isActive ?? false;
    }

    if (erranderSettingsRes.data) {
      erranderForm.maxConcurrentOrders = erranderSettingsRes.data.maxConcurrentOrders ?? 0;
    }

    if (payoutRes.data) {
      erranderForm.minimumPayout = payoutRes.data.amount ?? 1000;
    }

    if (platformRes.data) {
      platformForm.isStudentAppClosed = platformRes.data.isStudentAppClosed ?? platformRes.data.isClosed ?? false;
      platformForm.isVendorAppClosed = platformRes.data.isVendorAppClosed ?? platformRes.data.isClosed ?? false;
      platformForm.isDispatchAppClosed = platformRes.data.isDispatchAppClosed ?? platformRes.data.isClosed ?? false;
    }
  } catch (e: any) {
    console.error('Failed to load settings:', e);
    showToast({ title: 'error', message: 'failed to load system settings.', toastType: 'error' });
  }
};

// ─── Save Functions ────────────────
const saveSettings = async () => {
  saving.value = true;
  try {
    await admin_api.updateCustomErrandSettings({
      baseFee: Number(form.baseFee),
      expressFee: Number(form.expressFee),
      roomDeliveryFee: Number(form.roomDeliveryFee),
      dropoffServiceFee: Number(form.dropoffServiceFee),
      platformFee: Number(form.platformFee || form.convenienceFee || 100),
      convenienceFee: Number(form.convenienceFee || form.platformFee || 100),
      commissionFlatFee: Number(form.commissionFlatFee || form.platformFee || 100),
      customErrandCommissionPercentage: Number(form.customErrandCommissionPercentage),
      customErrandSafetyBufferPercentage: Number(form.customErrandSafetyBufferPercentage),
      minCustomErrandFee: Number(form.minCustomErrandFee),
      enableTransferFee: form.enableTransferFee,
      platformProcessingFee: Number(form.platformProcessingFee),
      platformServiceFeePercentage: Number(form.platformServiceFeePercentage),
      foodMarkupPercentage: Number(form.foodMarkupPercentage),
    });
    Object.assign(originalForm, { ...form });
    showToast({ title: 'success', message: 'pricing settings saved successfully!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save settings.', toastType: 'error' });
  } finally {
    saving.value = false;
  }
};

const saveCommunicationsSettings = async () => {
  savingComms.value = true;
  try {
    await admin_api.updateCommunicationsSettings({
      emailsEnabled: commsForm.emailsEnabled,
      pushNotificationsEnabled: commsForm.pushNotificationsEnabled,
    });
    showToast({ title: 'success', message: 'communications settings updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save communications settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save communications settings.', toastType: 'error' });
  } finally {
    savingComms.value = false;
  }
};

const saveAdvertSettings = async () => {
  savingAdvert.value = true;
  try {
    const firstActive = advertForm.customAds?.find(a => a.isActive !== false) || advertForm.customAds?.[0] || advertForm.customAd;
    await admin_api.updateAdvertSettings({
      enabled: advertForm.enabled,
      intervalMinutes: advertForm.intervalMinutes,
      autoCloseSeconds: advertForm.autoCloseSeconds,
      contentType: advertForm.contentType,
      customAds: advertForm.customAds,
      customAd: firstActive,
    });
    showToast({ title: 'success', message: 'advert configuration updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save advert settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save advert configuration.', toastType: 'error' });
  } finally {
    savingAdvert.value = false;
  }
};

const saveExamBrethrenSettings = async () => {
  savingExamBrethren.value = true;
  try {
    await admin_api.updateExamBrethrenSettings({
      isActive: examBrethrenForm.isActive,
    });
    showToast({ title: 'success', message: 'exam brethren campaign status updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save exam brethren settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save exam brethren settings.', toastType: 'error' });
  } finally {
    savingExamBrethren.value = false;
  }
};

const saveErranderSettings = async () => {
  savingErrander.value = true;
  try {
    await admin_api.updateErranderSettings({
      maxConcurrentOrders: Number(erranderForm.maxConcurrentOrders),
    });
    await admin_api.updatePayoutSettings({
      amount: Number(erranderForm.minimumPayout),
    });
    showToast({ title: 'success', message: 'errander settings updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save errander settings:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to save errander settings.', toastType: 'error' });
  } finally {
    savingErrander.value = false;
  }
};

const savePlatformSettings = async () => {
  savingPlatform.value = true;
  try {
    await admin_api.updatePlatformStatus({
      isStudentAppClosed: platformForm.isStudentAppClosed,
      isVendorAppClosed: platformForm.isVendorAppClosed,
      isDispatchAppClosed: platformForm.isDispatchAppClosed,
    });
    showToast({ title: 'success', message: 'platform status updated!', toastType: 'success' });
  } catch (e: any) {
    console.error('Failed to save platform status:', e);
    showToast({ title: 'error', message: e.response?.data?.message || 'failed to update platform status.', toastType: 'error' });
  } finally {
    savingPlatform.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
  animation: scaleIn 0.25s ease-out;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
