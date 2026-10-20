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

      <!-- CLARIFICATION & ARCHITECTURE GUIDE BANNER -->
      <div class="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-[#FF5C1A]/20 rounded-[2rem] p-6 sm:p-7 backdrop-blur-sm relative overflow-hidden">
        <div class="flex items-start gap-4 relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-[#FF5C1A] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#FF5C1A]/25">
            <Sparkles class="w-6 h-6" />
          </div>
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-bold text-gray-900 tracking-tight lowercase">platform fee classification guide</h3>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF5C1A]/10 text-[#FF5C1A]">clarity cheat-sheet</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed font-medium">
              to eliminate confusion when setting order fees, pricing is classified into 4 distinct operational tiers:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div class="p-3 bg-white/80 rounded-xl border border-gray-100 shadow-2xs space-y-1">
                <span class="text-[10px] font-bold uppercase text-orange-600 tracking-wider">1. order service fee (₦)</span>
                <p class="text-[11px] text-gray-600 leading-snug">flat fee added to student cart at checkout (e.g. ₦50). platform revenue.</p>
              </div>
              <div class="p-3 bg-white/80 rounded-xl border border-gray-100 shadow-2xs space-y-1">
                <span class="text-[10px] font-bold uppercase text-blue-600 tracking-wider">2. delivery fees (₦)</span>
                <p class="text-[11px] text-gray-600 leading-snug">room delivery (₦350) vs drop-off point (₦300). runner earns fee minus commission.</p>
              </div>
              <div class="p-3 bg-white/80 rounded-xl border border-gray-100 shadow-2xs space-y-1">
                <span class="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">3. vendor commission (%)</span>
                <p class="text-[11px] text-gray-600 leading-snug">percentage deducted from vendor's food subtotal before payout (e.g. 10%).</p>
              </div>
              <div class="p-3 bg-white/80 rounded-xl border border-gray-100 shadow-2xs space-y-1">
                <span class="text-[10px] font-bold uppercase text-purple-600 tracking-wider">4. custom errands</span>
                <p class="text-[11px] text-gray-600 leading-snug">p2p student errands with minimum floor rates (₦300–₦450) and purchase safety buffer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: CUSTOMER ORDER & CHECKOUT FEES -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center">
              <ShoppingBag class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900 lowercase">customer order & checkout fees</h3>
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">buyer checkout</span>
              </div>
              <p class="text-xs text-gray-500 lowercase mt-0.5">fees added directly to the student's cart total upon ordering</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Order Service Fee (Buyer Convenience Fee) -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-[#FF5C1A]/30">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">order service fee (₦)</label>
                  <button @click="showInfo('orderServiceFee')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">the flat service fee displayed to students in their checkout summary</p>
              </div>
              <span class="text-[10px] font-bold text-[#FF5C1A] bg-orange-100/60 px-2.5 py-1 rounded-lg shrink-0">
                cart receipt fee
              </span>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">₦</span>
              <input 
                v-model.number="form.convenienceFee"
                type="number" required min="0" step="10"
                class="w-full pl-9 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 outline-none transition-all"
              />
            </div>

            <!-- Customer preview pill -->
            <div class="flex items-center justify-between text-[11px] bg-white px-3 py-2 rounded-xl border border-gray-100">
              <span class="text-gray-500">student checkout label:</span>
              <span class="font-bold text-gray-800">service fee: ₦{{ form.convenienceFee || 0 }}</span>
            </div>

            <p v-if="form.convenienceFee !== originalForm.convenienceFee" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from ₦{{ originalForm.convenienceFee }} → ₦{{ form.convenienceFee }}. flat platform revenue on every order.</span>
            </p>

            <!-- Info Tooltip -->
            <div v-if="activeInfo === 'orderServiceFee'" class="p-3.5 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1.5 border border-blue-100">
              <p class="font-bold text-blue-950 flex items-center gap-1">
                <HelpCircle class="w-3.5 h-3.5" /> what is the order service fee?
              </p>
              <p>this is the flat fee charged to students on every food and product order. on the student checkout screen, it is displayed as "service fee". it goes 100% to erranders as platform revenue. keeping it between ₦50 – ₦100 keeps orders attractive while ensuring guaranteed platform income.</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>

          <!-- Payment Gateway Processing Fee -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-[#FF5C1A]/30">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">payment processing fee (₦)</label>
                  <button @click="showInfo('processingFee')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">flat surcharge to offset paystack online transaction charges</p>
              </div>
              <span class="text-[10px] font-bold text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-lg shrink-0">
                paystack gateway
              </span>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">₦</span>
              <input 
                v-model.number="form.platformProcessingFee"
                type="number" required min="0" step="10"
                class="w-full pl-9 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/20 outline-none transition-all"
              />
            </div>

            <p v-if="form.platformProcessingFee > 200" class="text-[11px] font-medium text-red-700 bg-red-50 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-red-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-red-600" />
              <span>high processing fee (₦{{ form.platformProcessingFee }}) may cause cart abandonment. recommended: ₦0 – ₦100.</span>
            </p>
            <p v-else-if="form.platformProcessingFee !== originalForm.platformProcessingFee" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from ₦{{ originalForm.platformProcessingFee }} → ₦{{ form.platformProcessingFee }}.</span>
            </p>
            <div v-else class="text-[11px] text-gray-400 italic px-1">
              tip: set to ₦0 to eliminate checkout friction and absorb paystack costs into the order service fee.
            </div>

            <!-- Info Tooltip -->
            <div v-if="activeInfo === 'processingFee'" class="p-3.5 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1.5 border border-blue-100">
              <p class="font-bold text-blue-950 flex items-center gap-1">
                <HelpCircle class="w-3.5 h-3.5" /> what is payment processing fee?
              </p>
              <p>a flat checkout fee that offsets paystack gateway charges (paystack charges ~1.5% + ₦100). high amounts cause cart abandonment at checkout. recommended: keep at ₦0 or ₦50.</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>

          <!-- Enable Bank Transfer Fee Toggle (Full Width) -->
          <div class="md:col-span-2">
            <div 
              class="flex items-center justify-between p-4 sm:p-5 bg-gray-50/70 border border-gray-100 rounded-2xl hover:bg-white hover:border-[#FF5C1A]/30 transition-all cursor-pointer"
              @click="form.enableTransferFee = !form.enableTransferFee"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-9 h-9 rounded-xl bg-gray-200/70 flex items-center justify-center text-gray-700">
                  <CreditCard class="w-4 h-4" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-gray-900 lowercase cursor-pointer">enable bank transfer fee</label>
                    <span :class="form.enableTransferFee ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'" class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {{ form.enableTransferFee ? 'active' : 'disabled' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5">charge students an extra fee when paying via manual peer-to-peer bank transfers</p>
                </div>
              </div>

              <div class="relative w-12 h-6 bg-gray-200 rounded-full transition-colors shrink-0" :class="{ 'bg-[#FF5C1A]': form.enableTransferFee }">
                <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform" :class="{ 'translate-x-6': form.enableTransferFee }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: MARKETPLACE DELIVERY PRICING & RIDER EARNINGS -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900 lowercase">marketplace delivery pricing & rider earnings</h3>
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">food & stores</span>
              </div>
              <p class="text-xs text-gray-500 lowercase mt-0.5">standard vendor delivery pricing and the platform's cut from runner delivery fees</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Room Delivery Fee -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-blue-400/40">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">room delivery fee (₦)</label>
                  <button @click="showInfo('roomDeliveryFee')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">doorstep delivery directly to student's hostel room</p>
              </div>
              <span class="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-lg shrink-0">
                doorstep
              </span>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">₦</span>
              <input 
                v-model.number="form.roomDeliveryFee"
                type="number" required min="0" step="50"
                class="w-full pl-9 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div class="text-[11px] bg-blue-50/60 text-blue-900 p-2.5 rounded-xl border border-blue-100/60 flex items-center justify-between">
              <span>rider keeps:</span>
              <span class="font-bold">₦{{ Math.max(0, form.roomDeliveryFee - form.commissionFlatFee) }}</span>
            </div>

            <p v-if="form.roomDeliveryFee !== originalForm.roomDeliveryFee" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from ₦{{ originalForm.roomDeliveryFee }} → ₦{{ form.roomDeliveryFee }}.</span>
            </p>

            <div v-if="activeInfo === 'roomDeliveryFee'" class="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-bold text-blue-950">what is room delivery fee?</p>
              <p>the standard delivery fee charged when students request food brought directly to their hostel room doorstep. rider keeps this minus the delivery commission.</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>

          <!-- Drop-off Point Delivery Fee (Renamed from Drop-off Service Fee to avoid confusion!) -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-blue-400/40">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">drop-off point fee (₦)</label>
                  <button @click="showInfo('dropoffServiceFee')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">student meets rider at hostel gate / pickup point</p>
              </div>
              <span class="text-[10px] font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-lg shrink-0">
                gate / station
              </span>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">₦</span>
              <input 
                v-model.number="form.dropoffServiceFee"
                type="number" required min="0" step="50"
                class="w-full pl-9 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div class="text-[11px] bg-teal-50/60 text-teal-900 p-2.5 rounded-xl border border-teal-100/60 flex items-center justify-between">
              <span>rider keeps:</span>
              <span class="font-bold">₦{{ Math.max(0, form.dropoffServiceFee - form.commissionFlatFee) }}</span>
            </div>

            <p v-if="form.dropoffServiceFee !== originalForm.dropoffServiceFee" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from ₦{{ originalForm.dropoffServiceFee }} → ₦{{ form.dropoffServiceFee }}.</span>
            </p>

            <div v-if="activeInfo === 'dropoffServiceFee'" class="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-bold text-blue-950">what is drop-off point fee?</p>
              <p>this was formerly called "drop-off service fee". it is a discounted delivery option where the student walks down to the hostel gate to meet the rider. it is NOT an order service charge.</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>

          <!-- Platform Delivery Commission -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-blue-400/40">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">delivery commission (₦)</label>
                  <button @click="showInfo('commission')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">platform cut deducted from each delivery fee (max ₦50)</p>
              </div>
              <span class="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-lg shrink-0">
                platform cut
              </span>
            </div>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">₦</span>
              <input 
                v-model.number="form.commissionFlatFee"
                type="number" required min="0" max="50" step="5"
                class="w-full pl-9 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            <div class="text-[11px] bg-indigo-50/60 text-indigo-900 p-2.5 rounded-xl border border-indigo-100/60 flex items-center justify-between">
              <span>erranders earns:</span>
              <span class="font-bold">₦{{ form.commissionFlatFee }} / delivery</span>
            </div>

            <p v-if="form.commissionFlatFee !== originalForm.commissionFlatFee" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from ₦{{ originalForm.commissionFlatFee }} → ₦{{ form.commissionFlatFee }}.</span>
            </p>

            <div v-if="activeInfo === 'commission'" class="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1 border border-blue-100">
              <p class="font-bold text-blue-950">what is delivery commission?</p>
              <p>the flat commission that erranders retains from the delivery fee on marketplace food/product deliveries. capped at ₦50 to guarantee riders always earn a healthy payout.</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>
        </div>

        <!-- Live Visual Delivery Payout Simulator Box -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 border border-blue-100 space-y-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-900">live delivery split breakdown</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-white/90 p-4 rounded-xl border border-blue-100 shadow-2xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-800">room delivery (₦{{ form.roomDeliveryFee }})</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">doorstep</span>
              </div>
              <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                <span class="text-gray-600">rider take-home:</span>
                <span class="font-extrabold text-emerald-600">₦{{ Math.max(0, form.roomDeliveryFee - form.commissionFlatFee) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">platform keeps:</span>
                <span class="font-extrabold text-indigo-600">₦{{ form.commissionFlatFee }}</span>
              </div>
            </div>

            <div class="bg-white/90 p-4 rounded-xl border border-blue-100 shadow-2xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-800">drop-off point (₦{{ form.dropoffServiceFee }})</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700">station</span>
              </div>
              <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                <span class="text-gray-600">rider take-home:</span>
                <span class="font-extrabold text-emerald-600">₦{{ Math.max(0, form.dropoffServiceFee - form.commissionFlatFee) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">platform keeps:</span>
                <span class="font-extrabold text-indigo-600">₦{{ form.commissionFlatFee }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2B: ORDER INTERCEPTION & MULTI-ERRANDER SPLIT -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowRightLeft class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900 lowercase">order interception & errander split</h3>
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">relay delivery</span>
              </div>
              <p class="text-xs text-gray-500 lowercase mt-0.5">configure order hand-off and earnings percentage sharing between first and second erranders</p>
            </div>
          </div>
          <!-- Toggle Order Interception -->
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-gray-700">{{ form.interceptionEnabled ? 'interception active' : 'interception disabled' }}</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="form.interceptionEnabled" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        <div v-if="!form.interceptionEnabled" class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 shrink-0 text-amber-600" />
          <span>order interception is currently <strong>disabled</strong> across the platform. runners cannot request or hand off orders to fellow erranders.</span>
        </div>

        <div :class="{ 'opacity-50 pointer-events-none': !form.interceptionEnabled }" class="space-y-6 transition-opacity">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Errander Split Percentage -->
            <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-purple-400/40">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-gray-800 lowercase">1st errander share (pickup runner) (%)</label>
                    <button @click="showInfo('firstErranderPct')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                      <Info class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">portion paid to runner who picks up and travels the first leg</p>
                </div>
                <span class="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-lg shrink-0">
                  leg 1 / pickup
                </span>
              </div>

              <div class="relative">
                <input 
                  v-model.number="form.interceptionFirstErranderPercentage"
                  @input="onFirstErranderPercentChange"
                  type="number" required min="1" max="99" step="1"
                  class="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">%</span>
              </div>

              <div class="text-[11px] bg-purple-50/60 text-purple-900 p-2.5 rounded-xl border border-purple-100/60 flex items-center justify-between">
                <span>on ₦{{ Math.max(0, form.roomDeliveryFee - form.commissionFlatFee) }} delivery pool:</span>
                <span class="font-bold">₦{{ Math.round((Math.max(0, form.roomDeliveryFee - form.commissionFlatFee)) * (form.interceptionFirstErranderPercentage / 100)) }}</span>
              </div>

              <div v-if="activeInfo === 'firstErranderPct'" class="p-3 bg-purple-50 text-purple-900 rounded-xl text-xs font-medium leading-relaxed space-y-1 border border-purple-100">
                <p class="font-bold text-purple-950">what is 1st errander share?</p>
                <p>the initial runner who accepted the errand, went to the vendor/store, retrieved the item, and handed it off to an intercepting errander. recommended: 55% - 65% due to store wait time.</p>
                <button @click="activeInfo = ''" class="text-purple-600 hover:text-purple-800 underline text-[11px] font-bold">dismiss</button>
              </div>
            </div>

            <!-- Second Errander Split Percentage -->
            <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-purple-400/40">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-gray-800 lowercase">2nd errander share (final delivery runner) (%)</label>
                    <button @click="showInfo('secondErranderPct')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors">
                      <Info class="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">portion paid to runner who completes delivery to student's doorstep</p>
                </div>
                <span class="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-lg shrink-0">
                  leg 2 / final
                </span>
              </div>

              <div class="relative">
                <input 
                  v-model.number="form.interceptionSecondErranderPercentage"
                  @input="onSecondErranderPercentChange"
                  type="number" required min="1" max="99" step="1"
                  class="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">%</span>
              </div>

              <div class="text-[11px] bg-indigo-50/60 text-indigo-900 p-2.5 rounded-xl border border-indigo-100/60 flex items-center justify-between">
                <span>on ₦{{ Math.max(0, form.roomDeliveryFee - form.commissionFlatFee) }} delivery pool:</span>
                <span class="font-bold">₦{{ Math.round((Math.max(0, form.roomDeliveryFee - form.commissionFlatFee)) * (form.interceptionSecondErranderPercentage / 100)) }}</span>
              </div>

              <div v-if="activeInfo === 'secondErranderPct'" class="p-3 bg-purple-50 text-purple-900 rounded-xl text-xs font-medium leading-relaxed space-y-1 border border-purple-100">
                <p class="font-bold text-purple-950">what is 2nd errander share?</p>
                <p>the intercepting runner who received the parcel from runner 1 and completes the journey to the student with delivery confirmation PIN. the sum of both shares always equals 100%.</p>
                <button @click="activeInfo = ''" class="text-purple-600 hover:text-purple-800 underline text-[11px] font-bold">dismiss</button>
              </div>
            </div>
          </div>

          <!-- Interception Payout Simulator Live Preview -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-purple-50/70 border border-purple-100 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-purple-900">live interception earnings simulation</span>
              <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">split: {{ form.interceptionFirstErranderPercentage }}% / {{ form.interceptionSecondErranderPercentage }}%</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Room Delivery Interception -->
              <div class="bg-white/90 p-4 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-800">room delivery (fee: ₦{{ form.roomDeliveryFee }})</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">doorstep</span>
                </div>
                <div class="text-[11px] text-gray-500">rider pool after platform cut (₦{{ form.commissionFlatFee }}): <strong class="text-gray-900">₦{{ Math.max(0, form.roomDeliveryFee - form.commissionFlatFee) }}</strong></div>
                <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                  <span class="text-gray-600">1st runner ({{ form.interceptionFirstErranderPercentage }}%):</span>
                  <span class="font-extrabold text-purple-700">₦{{ Math.round((Math.max(0, form.roomDeliveryFee - form.commissionFlatFee)) * (form.interceptionFirstErranderPercentage / 100)) }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-600">2nd runner ({{ form.interceptionSecondErranderPercentage }}%):</span>
                  <span class="font-extrabold text-indigo-700">₦{{ Math.round((Math.max(0, form.roomDeliveryFee - form.commissionFlatFee)) * (form.interceptionSecondErranderPercentage / 100)) }}</span>
                </div>
              </div>

              <!-- Drop-off Point Interception -->
              <div class="bg-white/90 p-4 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-800">drop-off point (fee: ₦{{ form.dropoffServiceFee }})</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700">station</span>
                </div>
                <div class="text-[11px] text-gray-500">rider pool after platform cut (₦{{ form.commissionFlatFee }}): <strong class="text-gray-900">₦{{ Math.max(0, form.dropoffServiceFee - form.commissionFlatFee) }}</strong></div>
                <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                  <span class="text-gray-600">1st runner ({{ form.interceptionFirstErranderPercentage }}%):</span>
                  <span class="font-extrabold text-purple-700">₦{{ Math.round((Math.max(0, form.dropoffServiceFee - form.commissionFlatFee)) * (form.interceptionFirstErranderPercentage / 100)) }}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-600">2nd runner ({{ form.interceptionSecondErranderPercentage }}%):</span>
                  <span class="font-extrabold text-indigo-700">₦{{ Math.round((Math.max(0, form.dropoffServiceFee - form.commissionFlatFee)) * (form.interceptionSecondErranderPercentage / 100)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: VENDOR TAKE-RATE & MENU PRICING -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900 lowercase">vendor commission & menu pricing</h3>
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">vendor take-rate</span>
              </div>
              <p class="text-xs text-gray-500 lowercase mt-0.5">how erranders earns from partner restaurants, eateries, and stores</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Vendor Commission / Platform Service Fee % -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-emerald-400/40">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">vendor commission / service fee (%)</label>
                  <button @click="showInfo('vendorServiceFee')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">percentage deducted from vendor's food subtotal before settlement</p>
              </div>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-lg shrink-0">
                silent revenue
              </span>
            </div>

            <div class="relative">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">%</span>
              <input 
                v-model.number="form.platformServiceFeePercentage"
                type="number" required min="0" max="100" step="1"
                class="w-full px-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <!-- Calculation Example -->
            <div class="text-[11px] bg-emerald-50/70 text-emerald-950 p-3 rounded-xl border border-emerald-100/70 space-y-1">
              <span class="font-bold block">example on ₦5,000 food order:</span>
              <div class="flex justify-between text-gray-700">
                <span>vendor payout:</span>
                <span class="font-bold text-gray-900">₦{{ (5000 - Math.round(5000 * (form.platformServiceFeePercentage || 0) / 100)).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-emerald-800">
                <span>erranders retains:</span>
                <span class="font-extrabold text-emerald-600">+₦{{ Math.round(5000 * (form.platformServiceFeePercentage || 0) / 100).toLocaleString() }} ({{ form.platformServiceFeePercentage }}%)</span>
              </div>
            </div>

            <p v-if="form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from {{ originalForm.platformServiceFeePercentage }}% → {{ form.platformServiceFeePercentage }}%.</span>
            </p>

            <div v-if="activeInfo === 'vendorServiceFee'" class="p-3.5 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1.5 border border-blue-100">
              <p class="font-bold text-blue-950">what is vendor commission (service fee %)?</p>
              <p>this is the percentage take-rate that erranders deducts from restaurants before paying them out for their food sales. industry standard is 5%–20%. this is your largest silent revenue driver.</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>

          <!-- Food Markup % -->
          <div class="space-y-3 p-5 rounded-2xl bg-gray-50/60 border border-gray-100 transition-all hover:bg-white hover:border-emerald-400/40">
            <div class="flex items-start justify-between gap-2">
              <div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-gray-800 lowercase">food menu markup (%)</label>
                  <button @click="showInfo('foodMarkup')" type="button" class="w-5 h-5 rounded-full bg-gray-200/70 text-gray-600 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                    <Info class="w-3.5 h-3.5" />
                  </button>
                </div>
                <p class="text-[11px] text-gray-500 mt-0.5">inflates vendor menu prices shown on the student app</p>
              </div>
              <span class="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-lg shrink-0">
                menu inflation
              </span>
            </div>

            <div class="relative">
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">%</span>
              <input 
                v-model.number="form.foodMarkupPercentage"
                type="number" required min="0" max="100" step="1"
                class="w-full px-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div v-if="form.foodMarkupPercentage === 0" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium leading-relaxed flex items-start gap-2 border border-emerald-100">
              <CheckCircle class="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>0% markup (recommended)</strong>: students pay exact in-store vendor prices. builds maximum campus trust and word-of-mouth adoption.</span>
            </div>
            <div v-else class="p-3 bg-purple-50 text-purple-900 rounded-xl text-[11px] font-medium leading-relaxed border border-purple-100 space-y-1">
              <span class="font-bold block">markup active ({{ form.foodMarkupPercentage }}%):</span>
              <p>a vendor item priced at ₦2,000 will display as <strong>₦{{ Math.round(2000 * (1 + form.foodMarkupPercentage / 100)).toLocaleString() }}</strong> on the student app.</p>
            </div>

            <p v-if="form.foodMarkupPercentage !== originalForm.foodMarkupPercentage" class="text-[11px] font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-amber-200/60">
              <AlertTriangle class="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>changing from {{ originalForm.foodMarkupPercentage }}% → {{ form.foodMarkupPercentage }}%.</span>
            </p>

            <div v-if="activeInfo === 'foodMarkup'" class="p-3.5 bg-blue-50 text-blue-900 rounded-xl text-xs font-medium leading-relaxed space-y-1.5 border border-blue-100">
              <p class="font-bold text-blue-950">what is food markup?</p>
              <p>inflates vendor menu prices by this percentage on the student app. the extra amount goes to erranders. set to 0% for "same as in-store" pricing (highly recommended for building trust with university students).</p>
              <button @click="activeInfo = ''" class="text-blue-600 hover:text-blue-800 underline text-[11px] font-bold">dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 4: CUSTOM ERRANDS & PEER-TO-PEER TASKS -->
      <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center justify-between border-b border-gray-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900 lowercase">custom errands & peer-to-peer tasks</h3>
                <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">p2p errands</span>
              </div>
              <p class="text-xs text-gray-500 lowercase mt-0.5">pricing floor limits, suggested rates, and safety margin for on-demand errands</p>
            </div>
          </div>
        </div>

        <!-- Sub-block A: Minimum Runner Fees & Suggested Rates -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-700 uppercase tracking-wider">A. errand runner fee floors & suggested rates (₦)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <!-- Min Custom Errand Fee -->
            <div class="space-y-2 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-800 lowercase">min base custom fee</label>
                <button @click="showInfo('minCustomErrandFee')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                  <Info class="w-3 h-3" />
                </button>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.minCustomErrandFee"
                  min="0" step="50"
                  class="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
              </div>
              <p class="text-[10px] text-gray-500 leading-tight">absolute minimum runner fee allowed for any task</p>
              <div v-if="activeInfo === 'minCustomErrandFee'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] leading-snug border border-blue-100">
                the baseline minimum fee students must offer runners for custom errands.
              </div>
            </div>

            <!-- Min Campus Environs Fee -->
            <div class="space-y-2 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-800 lowercase">min campus environs fee</label>
                <button @click="showInfo('minCampusEnvironsFee')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                  <Info class="w-3 h-3" />
                </button>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.minCampusEnvironsFee"
                  min="0" step="50"
                  class="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
              </div>
              <p class="text-[10px] text-gray-500 leading-tight">minimum fee for tasks around campus periphery</p>
              <div v-if="activeInfo === 'minCampusEnvironsFee'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] leading-snug border border-blue-100">
                minimum runner fee enforced for errands located around the campus gate and nearby student hubs.
              </div>
            </div>

            <!-- Min Far Off-Campus Fee -->
            <div class="space-y-2 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-800 lowercase">min far off-campus fee</label>
                <button @click="showInfo('minOutsideCampusFee')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                  <Info class="w-3 h-3" />
                </button>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.minOutsideCampusFee"
                  min="0" step="50"
                  class="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
              </div>
              <p class="text-[10px] text-gray-500 leading-tight">minimum fee for long distances outside campus</p>
              <div v-if="activeInfo === 'minOutsideCampusFee'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] leading-snug border border-blue-100">
                enforces a higher minimum floor for errands traveling off-campus to city markets and town centres.
              </div>
            </div>

            <!-- Suggested Standard Base Fee -->
            <div class="space-y-2 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-800 lowercase">suggested standard fee</label>
                <button @click="showInfo('baseFee')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                  <Info class="w-3 h-3" />
                </button>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.baseFee"
                  min="0" step="50"
                  class="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
              </div>
              <p class="text-[10px] text-gray-500 leading-tight">default recommended fee in student errand creator</p>
              <div v-if="activeInfo === 'baseFee'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] leading-snug border border-blue-100">
                pre-filled default fee suggested to students when creating normal custom errands.
              </div>
            </div>

            <!-- Suggested Express Fee -->
            <div class="space-y-2 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-800 lowercase">suggested express fee</label>
                <button @click="showInfo('expressFee')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                  <Info class="w-3 h-3" />
                </button>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                <input 
                  type="number" 
                  v-model.number="form.expressFee"
                  min="0" step="50"
                  class="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-8 pr-3 text-sm font-bold text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                >
              </div>
              <p class="text-[10px] text-gray-500 leading-tight">recommended fee when student toggles express delivery</p>
              <div v-if="activeInfo === 'expressFee'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-[11px] leading-snug border border-blue-100">
                recommended runner fee suggested when an errand is marked urgent or priority.
              </div>
            </div>
          </div>
        </div>

        <!-- Sub-block B: Custom Errand Margin & Safety Buffer -->
        <div class="pt-4 border-t border-gray-100 space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-700 uppercase tracking-wider">B. platform take-rate & purchase protection (%)</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Custom Errand Commission % -->
            <div class="space-y-3 p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-gray-800 lowercase">custom errand commission (%)</label>
                    <button @click="showInfo('customCommission')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                      <Info class="w-3 h-3" />
                    </button>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">percentage erranders takes from runner's custom delivery fee</p>
                </div>
                <span class="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">p2p cut</span>
              </div>
              <div class="relative">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                <input 
                  v-model.number="form.customErrandCommissionPercentage"
                  type="number" required min="0" max="100"
                  class="w-full px-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-purple-500 outline-none"
                />
              </div>
              <div class="text-[11px] text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100">
                on a ₦1,000 runner fee, Erranders keeps <strong>₦{{ Math.round(1000 * (form.customErrandCommissionPercentage || 0) / 100) }}</strong> and runner receives <strong>₦{{ 1000 - Math.round(1000 * (form.customErrandCommissionPercentage || 0) / 100) }}</strong>.
              </div>
              <div v-if="activeInfo === 'customCommission'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-xs leading-relaxed border border-blue-100">
                the platform's cut on custom errands. deducted from the runner fee that the student sets.
              </div>
            </div>

            <!-- Safety Buffer % -->
            <div class="space-y-3 p-5 rounded-2xl bg-gray-50/70 border border-gray-100">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-gray-800 lowercase">item cost safety buffer (%)</label>
                    <button @click="showInfo('safetyBuffer')" type="button" class="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:text-[#FF5C1A]">
                      <Info class="w-3 h-3" />
                    </button>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">buffer added to estimated item costs for purchasing errands</p>
                </div>
                <span class="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">price protection</span>
              </div>
              <div class="relative">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                <input 
                  v-model.number="form.customErrandSafetyBufferPercentage"
                  type="number" required min="0" max="100"
                  class="w-full px-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:border-purple-500 outline-none"
                />
              </div>
              <div class="text-[11px] text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100">
                protects runner if market price is higher than student's estimate. unused funds are refunded.
              </div>
              <div v-if="activeInfo === 'safetyBuffer'" class="p-2.5 bg-blue-50 text-blue-900 rounded-lg text-xs leading-relaxed border border-blue-100">
                percentage added to estimated item purchase price. held in escrow and reconciled after receipt upload.
              </div>
            </div>

            <!-- Service Business & Agency Commission % -->
            <div class="space-y-3 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 sm:col-span-2">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <label class="text-sm font-bold text-emerald-950 lowercase">service business & agency commission (%)</label>
                    <button @click="showInfo('serviceBusinessCommission')" type="button" class="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center hover:text-emerald-950">
                      <Info class="w-3 h-3" />
                    </button>
                  </div>
                  <p class="text-[11px] text-emerald-700 mt-0.5">platform commission deducted from registered service businesses (e.g. fumigation partners, movers, cleaners)</p>
                </div>
                <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">business vendor cut</span>
              </div>
              <div class="relative max-w-sm">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                <input 
                  v-model.number="form.serviceBusinessCommissionPercentage"
                  type="number" required min="0" max="100"
                  class="w-full px-4 pr-10 py-3 bg-white border border-emerald-200 rounded-xl text-base font-bold text-gray-900 focus:border-emerald-500 outline-none"
                />
              </div>
              <div class="text-[11px] text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-100">
                on a ₦20,000 fumigation/moving booking, Erranders keeps <strong>₦{{ Math.round(20000 * (form.serviceBusinessCommissionPercentage || 0) / 100) }}</strong> and the business vendor receives <strong>₦{{ 20000 - Math.round(20000 * (form.serviceBusinessCommissionPercentage || 0) / 100) }}</strong>.
              </div>
              <div v-if="activeInfo === 'serviceBusinessCommission'" class="p-2.5 bg-emerald-100 text-emerald-950 rounded-lg text-xs leading-relaxed border border-emerald-200">
                applies to commercial vendors on Decluttered (e.g., fumigation providers, student movers, cleaners) who hire staff/recruits and operate dedicated subdomains.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 5: REAL-TIME ORDER ECONOMICS & REVENUE SIMULATOR -->
      <div class="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-6 sm:p-8 rounded-[2rem] text-white space-y-6 border border-gray-800 shadow-2xl relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FF5C1A]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5 relative z-10">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Calculator class="w-5 h-5 text-[#FF5C1A]" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold tracking-tight lowercase">real-time order economics simulator</h3>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF5C1A]/20 text-[#FF5C1A]">interactive test</span>
              </div>
              <p class="text-xs text-gray-400 lowercase mt-0.5">simulate an order using your active settings to inspect the exact cash flow</p>
            </div>
          </div>

          <!-- Interactive Simulator Controls -->
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                type="button"
                @click="simDeliveryType = 'room'"
                :class="simDeliveryType === 'room' ? 'bg-[#FF5C1A] text-white' : 'text-gray-400 hover:text-white'"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                room delivery
              </button>
              <button 
                type="button"
                @click="simDeliveryType = 'dropoff'"
                :class="simDeliveryType === 'dropoff' ? 'bg-[#FF5C1A] text-white' : 'text-gray-400 hover:text-white'"
                class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                drop-off point
              </button>
            </div>

            <!-- Quick Subtotal Presets -->
            <div class="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-xl border border-white/10 text-xs">
              <span class="text-gray-400 text-[11px] mr-1">food:</span>
              <button 
                v-for="preset in [2000, 3500, 5000, 8000]" 
                :key="preset"
                type="button"
                @click="simFoodSubtotal = preset"
                :class="simFoodSubtotal === preset ? 'bg-white/20 text-white font-bold' : 'text-gray-400 hover:text-white'"
                class="px-2 py-1 rounded-lg transition-all"
              >
                ₦{{ (preset / 1000).toFixed(0) }}k
              </button>
            </div>
          </div>
        </div>

        <!-- 3-Way Financial Settlement Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          <!-- Card 1: What Customer Pays -->
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-gray-400 uppercase tracking-wider font-bold">1. student checkout</span>
              <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            </div>
            <div>
              <p class="text-2xl font-bold tracking-tight text-white">₦{{ simCustomerTotal.toLocaleString() }}</p>
              <p class="text-[11px] text-gray-400 mt-0.5">total charged at checkout</p>
            </div>
            <div class="text-[11px] space-y-1.5 pt-2 border-t border-white/10 text-gray-300">
              <div class="flex justify-between">
                <span>food subtotal:</span>
                <span class="font-medium text-white">₦{{ simFoodSubtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>delivery ({{ simDeliveryType }}):</span>
                <span class="font-medium text-white">₦{{ simDeliveryFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-orange-300">
                <span>order service fee:</span>
                <span class="font-bold">₦{{ (form.convenienceFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>processing fee:</span>
                <span>₦{{ (form.platformProcessingFee || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Vendor Receives -->
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">2. vendor payout</span>
              <Store class="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p class="text-2xl font-bold tracking-tight text-emerald-400">₦{{ simVendorPayout.toLocaleString() }}</p>
              <p class="text-[11px] text-gray-400 mt-0.5">sent to restaurant bank account</p>
            </div>
            <div class="text-[11px] space-y-1.5 pt-2 border-t border-white/10 text-gray-300">
              <div class="flex justify-between">
                <span>food subtotal:</span>
                <span class="font-medium text-white">₦{{ simFoodSubtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-emerald-400">
                <span>vendor cut ({{ form.platformServiceFeePercentage }}%):</span>
                <span class="font-bold">-₦{{ simVendorCut.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-[10px] text-gray-400 pt-1">
                <span>net share:</span>
                <span>{{ 100 - (form.platformServiceFeePercentage || 0) }}% of food</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Rider Receives -->
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-blue-400 uppercase tracking-wider font-bold">3. rider payout</span>
              <Truck class="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p class="text-2xl font-bold tracking-tight text-blue-400">₦{{ simRunnerPayout.toLocaleString() }}</p>
              <p class="text-[11px] text-gray-400 mt-0.5">credited to rider wallet</p>
            </div>
            <div class="text-[11px] space-y-1.5 pt-2 border-t border-white/10 text-gray-300">
              <div class="flex justify-between">
                <span>gross delivery fee:</span>
                <span class="font-medium text-white">₦{{ simDeliveryFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-blue-400">
                <span>delivery commission:</span>
                <span class="font-bold">-₦{{ simDeliveryCommission.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-[10px] text-gray-400 pt-1">
                <span>rider guarantee:</span>
                <span>fair wage floor guaranteed</span>
              </div>
              <div v-if="form.interceptionEnabled" class="flex justify-between text-[10px] text-purple-300 pt-1 border-t border-white/5">
                <span>if intercepted:</span>
                <span>1st: ₦{{ Math.round(simRunnerPayout * (form.interceptionFirstErranderPercentage / 100)).toLocaleString() }} ({{ form.interceptionFirstErranderPercentage }}%) · 2nd: ₦{{ Math.round(simRunnerPayout * (form.interceptionSecondErranderPercentage / 100)).toLocaleString() }} ({{ form.interceptionSecondErranderPercentage }}%)</span>
              </div>
            </div>
          </div>

          <!-- Card 4: Platform Net Earnings -->
          <div class="bg-gradient-to-b from-[#FF5C1A]/20 to-[#FF5C1A]/10 rounded-2xl p-5 border border-[#FF5C1A]/40 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-[#FF5C1A] uppercase tracking-wider font-bold">4. erranders profit</span>
              <Sparkles class="w-4 h-4 text-[#FF5C1A]" />
            </div>
            <div>
              <p class="text-2xl font-bold tracking-tight text-[#FF5C1A]">₦{{ simPlatformTotal.toLocaleString() }}</p>
              <p class="text-[11px] text-orange-200 mt-0.5">gross platform income on this order</p>
            </div>
            <div class="text-[11px] space-y-1.5 pt-2 border-t border-white/10 text-orange-100">
              <div class="flex justify-between">
                <span>order service fee:</span>
                <span class="font-bold">₦{{ (form.convenienceFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>vendor commission:</span>
                <span class="font-bold">₦{{ simVendorCut.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>delivery commission:</span>
                <span class="font-bold">₦{{ simDeliveryCommission.toLocaleString() }}</span>
              </div>
              <div v-if="form.platformProcessingFee > 0" class="flex justify-between text-gray-300">
                <span>processing fee:</span>
                <span>₦{{ (form.platformProcessingFee || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Explanatory note -->
        <p class="text-xs text-gray-400 leading-relaxed pt-2 border-t border-gray-800">
          💡 <strong class="text-white">how erranders makes money:</strong> on each order, the platform earns from three simultaneous streams: the <strong>order service fee</strong> paid by the student (₦{{ form.convenienceFee }}), the <strong>vendor commission</strong> retained from the food sale (₦{{ simVendorCut }}), and the <strong>delivery commission</strong> from the delivery fee (₦{{ simDeliveryCommission }}).
        </p>
      </div>

      <!-- SAVE SETTINGS BAR -->
      <div class="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div :class="pricingChangesCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'" class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle v-if="pricingChangesCount > 0" class="w-4 h-4" />
            <CheckCircle v-else class="w-4 h-4" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-900 lowercase">
              {{ pricingChangesCount > 0 ? `${pricingChangesCount} pricing changes pending` : 'all pricing settings up to date' }}
            </p>
            <p class="text-xs text-gray-500 lowercase">changes take effect immediately for all subsequent customer orders</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            v-if="pricingChangesCount > 0"
            @click="Object.assign(form, { ...originalForm })"
            type="button"
            class="px-5 py-3 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            reset changes
          </button>
          <button 
            @click="confirmSave('pricing')" 
            :disabled="saving"
            class="px-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold lowercase hover:bg-[#FF5C1A] transition-all shadow-lg shadow-gray-200 disabled:opacity-50 flex items-center gap-2"
          >
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>{{ saving ? 'saving...' : 'save pricing settings' }}</span>
          </button>
        </div>
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
    </Teleport>
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
  Eye, X, ExternalLink, BarChart2, Sparkles, Check, ArrowRight, ShoppingBag, Store, CreditCard, HelpCircle,
  ArrowRightLeft
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
  roomDeliveryFee: 300,
  dropoffServiceFee: 300,
  platformFee: 150,
  convenienceFee: 150,
  commissionFlatFee: 0,
  customErrandCommissionPercentage: 20,
  serviceBusinessCommissionPercentage: 15,
  customErrandSafetyBufferPercentage: 0,
  minCustomErrandFee: 400,
  enableTransferFee: true,
  minOutsideCampusFee: 450,
  minCampusEnvironsFee: 450,
  platformProcessingFee: 0,
  platformServiceFeePercentage: 0,
  foodMarkupPercentage: 0,
  interceptionEnabled: true,
  interceptionFirstErranderPercentage: 60,
  interceptionSecondErranderPercentage: 40,
});

const onFirstErranderPercentChange = () => {
  let val = Number(form.interceptionFirstErranderPercentage) || 0;
  if (val > 99) val = 99;
  if (val < 1) val = 1;
  form.interceptionFirstErranderPercentage = val;
  form.interceptionSecondErranderPercentage = 100 - val;
};

const onSecondErranderPercentChange = () => {
  let val = Number(form.interceptionSecondErranderPercentage) || 0;
  if (val > 99) val = 99;
  if (val < 1) val = 1;
  form.interceptionSecondErranderPercentage = val;
  form.interceptionFirstErranderPercentage = 100 - val;
};

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

// ─── Revenue & Order Economics Simulator ────────────────
const simFoodSubtotal = ref(3500);
const simDeliveryType = ref<'room' | 'dropoff'>('room');

const simDeliveryFee = computed(() => {
  return simDeliveryType.value === 'room' ? (Number(form.roomDeliveryFee) || 350) : (Number(form.dropoffServiceFee) || 300);
});

const simDeliveryCommission = computed(() => {
  return Math.min(Number(form.commissionFlatFee) || 0, simDeliveryFee.value);
});

const simRunnerPayout = computed(() => {
  return Math.max(0, simDeliveryFee.value - simDeliveryCommission.value);
});

const simVendorCut = computed(() => {
  const pct = Number(form.platformServiceFeePercentage) || 0;
  return Math.round((simFoodSubtotal.value * pct) / 100);
});

const simVendorPayout = computed(() => {
  return Math.max(0, simFoodSubtotal.value - simVendorCut.value);
});

const simOrderServiceFee = computed(() => {
  return Number(form.convenienceFee) || 0;
});

const simProcessingFee = computed(() => {
  return Number(form.platformProcessingFee) || 0;
});

const simCustomerTotal = computed(() => {
  return simFoodSubtotal.value + simDeliveryFee.value + simOrderServiceFee.value + simProcessingFee.value;
});

const simPlatformTotal = computed(() => {
  return simOrderServiceFee.value + simProcessingFee.value + simDeliveryCommission.value + simVendorCut.value;
});

const estimatedRevenue = computed(() => {
  return form.convenienceFee + form.commissionFlatFee + form.platformProcessingFee;
});

const pricingChangesCount = computed(() => {
  let count = 0;
  if (form.convenienceFee !== originalForm.convenienceFee) count++;
  if (form.platformProcessingFee !== originalForm.platformProcessingFee) count++;
  if (form.enableTransferFee !== originalForm.enableTransferFee) count++;
  if (form.roomDeliveryFee !== originalForm.roomDeliveryFee) count++;
  if (form.dropoffServiceFee !== originalForm.dropoffServiceFee) count++;
  if (form.commissionFlatFee !== originalForm.commissionFlatFee) count++;
  if (form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage) count++;
  if (form.foodMarkupPercentage !== originalForm.foodMarkupPercentage) count++;
  if (form.minCustomErrandFee !== originalForm.minCustomErrandFee) count++;
  if (form.minCampusEnvironsFee !== originalForm.minCampusEnvironsFee) count++;
  if (form.minOutsideCampusFee !== originalForm.minOutsideCampusFee) count++;
  if (form.baseFee !== originalForm.baseFee) count++;
  if (form.expressFee !== originalForm.expressFee) count++;
  if (form.customErrandCommissionPercentage !== originalForm.customErrandCommissionPercentage) count++;
  if (form.serviceBusinessCommissionPercentage !== originalForm.serviceBusinessCommissionPercentage) count++;
  if (form.customErrandSafetyBufferPercentage !== originalForm.customErrandSafetyBufferPercentage) count++;
  if (form.interceptionEnabled !== originalForm.interceptionEnabled) count++;
  if (form.interceptionFirstErranderPercentage !== originalForm.interceptionFirstErranderPercentage) count++;
  if (form.interceptionSecondErranderPercentage !== originalForm.interceptionSecondErranderPercentage) count++;
  return count;
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
    if (form.convenienceFee !== originalForm.convenienceFee) confirmModal.changes.push(`order service fee (cart): <strong>₦${originalForm.convenienceFee}</strong> → <strong>₦${form.convenienceFee}</strong>`);
    if (form.platformProcessingFee !== originalForm.platformProcessingFee) confirmModal.changes.push(`payment processing fee: <strong>₦${originalForm.platformProcessingFee}</strong> → <strong>₦${form.platformProcessingFee}</strong>`);
    if (form.enableTransferFee !== originalForm.enableTransferFee) confirmModal.changes.push(`bank transfer fee: <strong>${originalForm.enableTransferFee ? 'enabled' : 'disabled'}</strong> → <strong>${form.enableTransferFee ? 'enabled' : 'disabled'}</strong>`);
    if (form.roomDeliveryFee !== originalForm.roomDeliveryFee) confirmModal.changes.push(`room delivery fee: <strong>₦${originalForm.roomDeliveryFee}</strong> → <strong>₦${form.roomDeliveryFee}</strong>`);
    if (form.dropoffServiceFee !== originalForm.dropoffServiceFee) confirmModal.changes.push(`drop-off point fee: <strong>₦${originalForm.dropoffServiceFee}</strong> → <strong>₦${form.dropoffServiceFee}</strong>`);
    if (form.commissionFlatFee !== originalForm.commissionFlatFee) confirmModal.changes.push(`delivery commission: <strong>₦${originalForm.commissionFlatFee}</strong> → <strong>₦${form.commissionFlatFee}</strong>`);
    if (form.platformServiceFeePercentage !== originalForm.platformServiceFeePercentage) confirmModal.changes.push(`vendor commission (service fee): <strong>${originalForm.platformServiceFeePercentage}%</strong> → <strong>${form.platformServiceFeePercentage}%</strong>`);
    if (form.foodMarkupPercentage !== originalForm.foodMarkupPercentage) confirmModal.changes.push(`menu price markup: <strong>${originalForm.foodMarkupPercentage}%</strong> → <strong>${form.foodMarkupPercentage}%</strong>`);
    if (form.minCustomErrandFee !== originalForm.minCustomErrandFee) confirmModal.changes.push(`min custom errand fee: <strong>₦${originalForm.minCustomErrandFee}</strong> → <strong>₦${form.minCustomErrandFee}</strong>`);
    if (form.minCampusEnvironsFee !== originalForm.minCampusEnvironsFee) confirmModal.changes.push(`min campus environs fee: <strong>₦${originalForm.minCampusEnvironsFee}</strong> → <strong>₦${form.minCampusEnvironsFee}</strong>`);
    if (form.minOutsideCampusFee !== originalForm.minOutsideCampusFee) confirmModal.changes.push(`min far off-campus fee: <strong>₦${originalForm.minOutsideCampusFee}</strong> → <strong>₦${form.minOutsideCampusFee}</strong>`);
    if (form.baseFee !== originalForm.baseFee) confirmModal.changes.push(`suggested standard errand fee: <strong>₦${originalForm.baseFee}</strong> → <strong>₦${form.baseFee}</strong>`);
    if (form.expressFee !== originalForm.expressFee) confirmModal.changes.push(`suggested express errand fee: <strong>₦${originalForm.expressFee}</strong> → <strong>₦${form.expressFee}</strong>`);
    if (form.customErrandCommissionPercentage !== originalForm.customErrandCommissionPercentage) confirmModal.changes.push(`custom errand commission: <strong>${originalForm.customErrandCommissionPercentage}%</strong> → <strong>${form.customErrandCommissionPercentage}%</strong>`);
    if (form.serviceBusinessCommissionPercentage !== originalForm.serviceBusinessCommissionPercentage) confirmModal.changes.push(`service business commission: <strong>${originalForm.serviceBusinessCommissionPercentage}%</strong> → <strong>${form.serviceBusinessCommissionPercentage}%</strong>`);
    if (form.customErrandSafetyBufferPercentage !== originalForm.customErrandSafetyBufferPercentage) confirmModal.changes.push(`custom errand safety buffer: <strong>${originalForm.customErrandSafetyBufferPercentage}%</strong> → <strong>${form.customErrandSafetyBufferPercentage}%</strong>`);
    if (form.interceptionEnabled !== originalForm.interceptionEnabled) confirmModal.changes.push(`order interception: <strong>${originalForm.interceptionEnabled ? 'enabled' : 'disabled'}</strong> → <strong>${form.interceptionEnabled ? 'enabled' : 'disabled'}</strong>`);
    if (form.interceptionFirstErranderPercentage !== originalForm.interceptionFirstErranderPercentage || form.interceptionSecondErranderPercentage !== originalForm.interceptionSecondErranderPercentage) {
      confirmModal.changes.push(`errander interception split: <strong>${originalForm.interceptionFirstErranderPercentage}% / ${originalForm.interceptionSecondErranderPercentage}%</strong> → <strong>${form.interceptionFirstErranderPercentage}% / ${form.interceptionSecondErranderPercentage}%</strong>`);
    }
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
    const results = await Promise.allSettled([
      admin_api.getCustomErrandSettings(),
      admin_api.getCommunicationsSettings(),
      admin_api.getAdvertSettings(),
      admin_api.getExamBrethrenSettings(),
      admin_api.getErranderSettings(),
      admin_api.getPayoutSettings(),
      admin_api.getPlatformStatus()
    ]);
    
    const [errandSettled, commsSettled, advertSettled, examBrethrenSettled, erranderSettingsSettled, payoutSettled, platformSettled] = results;

    if (errandSettled.status === 'fulfilled' && errandSettled.value?.data) {
      const errandSettings = errandSettled.value.data;
      form.baseFee = errandSettings.baseFee != null && !isNaN(Number(errandSettings.baseFee)) ? Number(errandSettings.baseFee) : 450;
      form.expressFee = errandSettings.expressFee != null && !isNaN(Number(errandSettings.expressFee)) ? Number(errandSettings.expressFee) : 850;
      form.roomDeliveryFee = errandSettings.roomDeliveryFee != null && !isNaN(Number(errandSettings.roomDeliveryFee)) ? Number(errandSettings.roomDeliveryFee) : 300;
      form.dropoffServiceFee = errandSettings.dropoffServiceFee != null && !isNaN(Number(errandSettings.dropoffServiceFee)) ? Number(errandSettings.dropoffServiceFee) : 300;
      form.platformFee = errandSettings.convenienceFee != null && !isNaN(Number(errandSettings.convenienceFee))
        ? Number(errandSettings.convenienceFee)
        : (errandSettings.platformFee != null && !isNaN(Number(errandSettings.platformFee)) ? Number(errandSettings.platformFee) : 150);
      form.convenienceFee = form.platformFee;
      form.commissionFlatFee = errandSettings.commissionFlatFee != null && !isNaN(Number(errandSettings.commissionFlatFee))
        ? Math.max(0, Math.min(50, Number(errandSettings.commissionFlatFee)))
        : 0;
      form.customErrandCommissionPercentage = errandSettings.customErrandCommissionPercentage != null && !isNaN(Number(errandSettings.customErrandCommissionPercentage))
        ? Number(errandSettings.customErrandCommissionPercentage)
        : 20;
      form.serviceBusinessCommissionPercentage = errandSettings.serviceBusinessCommissionPercentage != null && !isNaN(Number(errandSettings.serviceBusinessCommissionPercentage))
        ? Number(errandSettings.serviceBusinessCommissionPercentage)
        : 15;
      form.customErrandSafetyBufferPercentage = errandSettings.customErrandSafetyBufferPercentage != null && !isNaN(Number(errandSettings.customErrandSafetyBufferPercentage))
        ? Number(errandSettings.customErrandSafetyBufferPercentage)
        : 0;
      form.minCustomErrandFee = errandSettings.minCustomErrandFee != null && !isNaN(Number(errandSettings.minCustomErrandFee))
        ? Number(errandSettings.minCustomErrandFee)
        : 400;
      form.enableTransferFee = Boolean(errandSettings.enableTransferFee);
      form.minOutsideCampusFee = errandSettings.minOutsideCampusFee != null && !isNaN(Number(errandSettings.minOutsideCampusFee))
        ? Number(errandSettings.minOutsideCampusFee)
        : 450;
      form.minCampusEnvironsFee = errandSettings.minCampusEnvironsFee != null && !isNaN(Number(errandSettings.minCampusEnvironsFee))
        ? Number(errandSettings.minCampusEnvironsFee)
        : 450;
      form.platformProcessingFee = errandSettings.platformProcessingFee != null && !isNaN(Number(errandSettings.platformProcessingFee))
        ? Number(errandSettings.platformProcessingFee)
        : 0;
      form.platformServiceFeePercentage = errandSettings.platformServiceFeePercentage != null && !isNaN(Number(errandSettings.platformServiceFeePercentage))
        ? Number(errandSettings.platformServiceFeePercentage)
        : 0;
      form.foodMarkupPercentage = errandSettings.foodMarkupPercentage != null && !isNaN(Number(errandSettings.foodMarkupPercentage))
        ? Number(errandSettings.foodMarkupPercentage)
        : 0;
      form.interceptionEnabled = errandSettings.interceptionEnabled !== undefined ? Boolean(errandSettings.interceptionEnabled) : true;
      form.interceptionFirstErranderPercentage = errandSettings.interceptionFirstErranderPercentage != null && !isNaN(Number(errandSettings.interceptionFirstErranderPercentage))
        ? Number(errandSettings.interceptionFirstErranderPercentage)
        : 60;
      form.interceptionSecondErranderPercentage = errandSettings.interceptionSecondErranderPercentage != null && !isNaN(Number(errandSettings.interceptionSecondErranderPercentage))
        ? Number(errandSettings.interceptionSecondErranderPercentage)
        : 40;
      // Snapshot the originals for change detection
      Object.assign(originalForm, { ...form });
    }

    if (commsSettled.status === 'fulfilled' && commsSettled.value?.data) {
      commsForm.emailsEnabled = commsSettled.value.data.emailsEnabled ?? true;
      commsForm.pushNotificationsEnabled = commsSettled.value.data.pushNotificationsEnabled ?? true;
    }

    if (advertSettled.status === 'fulfilled' && advertSettled.value?.data) {
      const aData = advertSettled.value.data;
      advertForm.enabled = aData.enabled ?? true;
      advertForm.intervalMinutes = aData.intervalMinutes ?? 15;
      advertForm.autoCloseSeconds = aData.autoCloseSeconds ?? 0;
      advertForm.contentType = aData.contentType || 'custom';
      advertForm.customAds = Array.isArray(aData.customAds) ? aData.customAds : [];
      if (aData.customAd) {
        advertForm.customAd = { ...advertForm.customAd, ...aData.customAd };
      }
    }
    
    if (examBrethrenSettled.status === 'fulfilled' && examBrethrenSettled.value?.data) {
      examBrethrenForm.isActive = examBrethrenSettled.value.data.isActive ?? false;
    }

    if (erranderSettingsSettled.status === 'fulfilled' && erranderSettingsSettled.value?.data) {
      erranderForm.maxConcurrentOrders = erranderSettingsSettled.value.data.maxConcurrentOrders ?? 0;
    }

    if (payoutSettled.status === 'fulfilled' && payoutSettled.value?.data) {
      erranderForm.minimumPayout = payoutSettled.value.data.amount ?? 1000;
    }

    if (platformSettled.status === 'fulfilled' && platformSettled.value?.data) {
      const pData = platformSettled.value.data;
      platformForm.isStudentAppClosed = pData.isStudentAppClosed ?? pData.isClosed ?? false;
      platformForm.isVendorAppClosed = pData.isVendorAppClosed ?? pData.isClosed ?? false;
      platformForm.isDispatchAppClosed = pData.isDispatchAppClosed ?? pData.isClosed ?? false;
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
    const resolvedOrderServiceFee = form.convenienceFee != null && form.convenienceFee !== '' && !isNaN(Number(form.convenienceFee))
      ? Number(form.convenienceFee)
      : (form.platformFee != null && form.platformFee !== '' && !isNaN(Number(form.platformFee)) ? Number(form.platformFee) : 150);
    form.convenienceFee = resolvedOrderServiceFee;
    form.platformFee = resolvedOrderServiceFee;

    const payload = {
      baseFee: form.baseFee != null && form.baseFee !== '' && !isNaN(Number(form.baseFee)) ? Number(form.baseFee) : 450,
      expressFee: form.expressFee != null && form.expressFee !== '' && !isNaN(Number(form.expressFee)) ? Number(form.expressFee) : 850,
      roomDeliveryFee: form.roomDeliveryFee != null && form.roomDeliveryFee !== '' && !isNaN(Number(form.roomDeliveryFee)) ? Number(form.roomDeliveryFee) : 300,
      dropoffServiceFee: form.dropoffServiceFee != null && form.dropoffServiceFee !== '' && !isNaN(Number(form.dropoffServiceFee)) ? Number(form.dropoffServiceFee) : 300,
      platformFee: resolvedOrderServiceFee,
      convenienceFee: resolvedOrderServiceFee,
      commissionFlatFee: form.commissionFlatFee != null && form.commissionFlatFee !== '' && !isNaN(Number(form.commissionFlatFee))
        ? Math.max(0, Math.min(50, Number(form.commissionFlatFee)))
        : 0,
      customErrandCommissionPercentage: form.customErrandCommissionPercentage != null && form.customErrandCommissionPercentage !== '' && !isNaN(Number(form.customErrandCommissionPercentage))
        ? Number(form.customErrandCommissionPercentage)
        : 20,
      serviceBusinessCommissionPercentage: form.serviceBusinessCommissionPercentage != null && form.serviceBusinessCommissionPercentage !== '' && !isNaN(Number(form.serviceBusinessCommissionPercentage))
        ? Number(form.serviceBusinessCommissionPercentage)
        : 15,
      customErrandSafetyBufferPercentage: form.customErrandSafetyBufferPercentage != null && form.customErrandSafetyBufferPercentage !== '' && !isNaN(Number(form.customErrandSafetyBufferPercentage))
        ? Number(form.customErrandSafetyBufferPercentage)
        : 0,
      minCustomErrandFee: form.minCustomErrandFee != null && form.minCustomErrandFee !== '' && !isNaN(Number(form.minCustomErrandFee))
        ? Number(form.minCustomErrandFee)
        : 400,
      minCampusEnvironsFee: form.minCampusEnvironsFee != null && form.minCampusEnvironsFee !== '' && !isNaN(Number(form.minCampusEnvironsFee))
        ? Number(form.minCampusEnvironsFee)
        : 450,
      minOutsideCampusFee: form.minOutsideCampusFee != null && form.minOutsideCampusFee !== '' && !isNaN(Number(form.minOutsideCampusFee))
        ? Number(form.minOutsideCampusFee)
        : 450,
      enableTransferFee: Boolean(form.enableTransferFee),
      platformProcessingFee: form.platformProcessingFee != null && form.platformProcessingFee !== '' && !isNaN(Number(form.platformProcessingFee))
        ? Number(form.platformProcessingFee)
        : 0,
      platformServiceFeePercentage: form.platformServiceFeePercentage != null && form.platformServiceFeePercentage !== '' && !isNaN(Number(form.platformServiceFeePercentage))
        ? Number(form.platformServiceFeePercentage)
        : 0,
      foodMarkupPercentage: form.foodMarkupPercentage != null && form.foodMarkupPercentage !== '' && !isNaN(Number(form.foodMarkupPercentage))
        ? Number(form.foodMarkupPercentage)
        : 0,
      interceptionEnabled: Boolean(form.interceptionEnabled),
      interceptionFirstErranderPercentage: form.interceptionFirstErranderPercentage != null && form.interceptionFirstErranderPercentage !== '' && !isNaN(Number(form.interceptionFirstErranderPercentage))
        ? Number(form.interceptionFirstErranderPercentage)
        : 60,
      interceptionSecondErranderPercentage: form.interceptionSecondErranderPercentage != null && form.interceptionSecondErranderPercentage !== '' && !isNaN(Number(form.interceptionSecondErranderPercentage))
        ? Number(form.interceptionSecondErranderPercentage)
        : 40,
    };

    const res = await admin_api.updateCustomErrandSettings(payload);
    if (res.data) {
      Object.assign(form, {
        baseFee: res.data.baseFee ?? form.baseFee,
        expressFee: res.data.expressFee ?? form.expressFee,
        roomDeliveryFee: res.data.roomDeliveryFee ?? form.roomDeliveryFee,
        dropoffServiceFee: res.data.dropoffServiceFee ?? form.dropoffServiceFee,
        platformFee: res.data.convenienceFee ?? res.data.platformFee ?? form.platformFee,
        convenienceFee: res.data.convenienceFee ?? res.data.platformFee ?? form.convenienceFee,
        commissionFlatFee: res.data.commissionFlatFee ?? form.commissionFlatFee,
        customErrandCommissionPercentage: res.data.customErrandCommissionPercentage ?? form.customErrandCommissionPercentage,
        serviceBusinessCommissionPercentage: res.data.serviceBusinessCommissionPercentage ?? form.serviceBusinessCommissionPercentage,
        customErrandSafetyBufferPercentage: res.data.customErrandSafetyBufferPercentage ?? form.customErrandSafetyBufferPercentage,
        minCustomErrandFee: res.data.minCustomErrandFee ?? form.minCustomErrandFee,
        enableTransferFee: res.data.enableTransferFee ?? form.enableTransferFee,
        minOutsideCampusFee: res.data.minOutsideCampusFee ?? form.minOutsideCampusFee,
        minCampusEnvironsFee: res.data.minCampusEnvironsFee ?? form.minCampusEnvironsFee,
        platformProcessingFee: res.data.platformProcessingFee ?? form.platformProcessingFee,
        platformServiceFeePercentage: res.data.platformServiceFeePercentage ?? form.platformServiceFeePercentage,
        foodMarkupPercentage: res.data.foodMarkupPercentage ?? form.foodMarkupPercentage,
        interceptionEnabled: res.data.interceptionEnabled ?? form.interceptionEnabled,
        interceptionFirstErranderPercentage: res.data.interceptionFirstErranderPercentage ?? form.interceptionFirstErranderPercentage,
        interceptionSecondErranderPercentage: res.data.interceptionSecondErranderPercentage ?? form.interceptionSecondErranderPercentage,
      });
    }
    Object.assign(originalForm, { ...form });
    showToast({ title: 'success', message: 'pricing and revenue settings saved successfully!', toastType: 'success' });
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
