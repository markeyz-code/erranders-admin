<template>
  <SideDrawer :isOpen="isOpen" size="lg" @close="close">
    <template v-if="booking">
      <!-- Header Profile -->
      <div class="flex flex-col items-center justify-center pt-6 pb-6 border-b border-gray-100">
        <div class="relative mb-3">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-500/20">
            {{ clientInitials }}
          </div>
          <span 
            class="absolute -bottom-1 -right-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-white text-white"
            :class="booking.user ? 'bg-indigo-600' : 'bg-amber-600'"
          >
            {{ booking.user ? 'Student' : 'Guest' }}
          </span>
        </div>
        
        <h3 class="text-lg font-bold text-gray-900 font-heading">{{ clientName }}</h3>
        <p class="text-xs font-medium text-gray-500 mb-4">{{ clientEmail }}</p>
        
        <!-- Summary Numbers -->
        <div class="grid grid-cols-3 gap-2 w-full bg-gray-50/80 rounded-2xl p-3 border border-gray-100 text-center">
          <div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Service Subtotal</p>
            <p class="text-sm font-bold text-gray-900 mt-0.5">₦{{ Number(booking.price || 0).toLocaleString() }}</p>
          </div>
          <div class="border-x border-gray-200/60 px-1">
            <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Erranders Fee</p>
            <p class="text-sm font-black text-emerald-600 mt-0.5">₦{{ Number(booking.serviceCharge || 0).toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Balance In-Person</p>
            <p class="text-sm font-bold text-gray-700 mt-0.5">₦{{ Number(booking.pendingBalance || 0).toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Content Sections -->
      <div class="py-6 space-y-6 pb-28">
        
        <!-- Status & Schedule Banner -->
        <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
              <span 
                class="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border flex items-center gap-1.5"
                :class="getStatusBadgeClass(booking.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(booking.status)"></span>
                {{ booking.status?.replace('_', ' ') }}
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</span>
              <span 
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border"
                :class="getPaymentBadgeClass(booking.paymentStatus)"
              >
                {{ booking.paymentStatus?.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <div class="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2 text-gray-600">
              <Calendar class="w-4 h-4 text-gray-400" />
              <span class="font-semibold">{{ formatScheduledDate(booking.scheduledDate) }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <Clock class="w-4 h-4 text-gray-400" />
              <span class="font-semibold">{{ booking.startTime }} - {{ booking.endTime }} ({{ totalDuration }} mins)</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] pt-1 text-gray-400">
            <span>Reference: <strong class="font-mono text-gray-700">{{ booking.paymentReference || booking._id }}</strong></span>
            <button @click="copyReference" class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
              <Copy class="w-3 h-3" /> {{ copied ? 'Copied!' : 'Copy Ref' }}
            </button>
          </div>
        </div>

        <!-- Direct Transfer Verification Alert (if applicable) -->
        <div v-if="booking.paymentStatus === 'pending_verification'" class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
          <div class="flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div class="flex-1">
              <h4 class="text-sm font-bold text-amber-900">Direct Bank Transfer Awaiting Verification</h4>
              <p class="text-xs text-amber-700 mt-0.5">The client submitted a proof of payment. Verify the payment receipt below to confirm the appointment.</p>
            </div>
          </div>

          <div v-if="booking.proofOfPayment" class="mt-2">
            <p class="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5">Payment Receipt Image:</p>
            <a :href="booking.proofOfPayment" target="_blank" class="block w-full max-h-48 rounded-xl overflow-hidden border border-amber-200 bg-white relative group">
              <img :src="booking.proofOfPayment" alt="Proof of Payment" class="w-full h-48 object-contain" />
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                <ExternalLink class="w-4 h-4" /> Click to view full image
              </div>
            </a>
          </div>

          <button
            type="button"
            :disabled="verifying"
            @click="verifyDirectTransfer"
            class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>{{ verifying ? 'Verifying Payment...' : 'Verify & Confirm Appointment' }}</span>
          </button>
        </div>

        <!-- Services Booked Breakdown -->
        <div class="space-y-3">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 flex justify-between items-center">
            Booked Services ({{ booking.items?.length || 0 }})
            <span class="text-gray-500 font-semibold">{{ totalDuration }} mins total</span>
          </h4>

          <div class="space-y-2">
            <div 
              v-for="(item, idx) in booking.items" 
              :key="idx"
              class="p-3.5 rounded-xl border border-gray-100 bg-white space-y-2"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="text-sm font-bold text-gray-900">{{ item.service?.name || 'Service Item' }}</h5>
                  <p v-if="item.variantName" class="text-xs font-semibold text-indigo-600 mt-0.5">Variant: {{ item.variantName }}</p>
                  <p class="text-[11px] text-gray-400 mt-0.5">{{ item.durationInMinutes }} minutes</p>
                </div>
                <span class="text-sm font-bold text-gray-900">₦{{ Number(item.price || 0).toLocaleString() }}</span>
              </div>

              <!-- Extras/Addons -->
              <div v-if="item.extras?.length" class="pt-2 border-t border-gray-50 space-y-1">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Add-ons Selected:</p>
                <div v-for="ext in item.extras" :key="ext.name" class="flex justify-between text-xs text-gray-600 pl-2">
                  <span>+ {{ ext.name }} ({{ ext.durationInMinutes }}m)</span>
                  <span class="font-semibold text-gray-800">₦{{ Number(ext.price || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Information -->
        <div class="space-y-3">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Client Information
          </h4>
          <div class="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-gray-100">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Name</p>
              <p class="font-bold text-gray-900">{{ clientName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Account Type</p>
              <p class="font-bold text-gray-700">{{ booking.user ? 'Registered User' : 'Guest Booking' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Email</p>
              <a :href="`mailto:${clientEmail}`" class="font-medium text-indigo-600 hover:underline truncate block">
                {{ clientEmail }}
              </a>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Phone</p>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900">{{ clientPhone }}</span>
                <a 
                  v-if="clientPhone && clientPhone !== 'N/A'" 
                  :href="`https://wa.me/${cleanPhoneForWhatsApp(clientPhone)}`" 
                  target="_blank" 
                  class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                  title="WhatsApp Client"
                >
                  <MessageCircle class="w-3 h-3" />
                </a>
              </div>
            </div>
            <div v-if="booking.notes" class="col-span-2 pt-2 border-t border-gray-50">
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Client Notes / Special Requests</p>
              <p class="text-xs text-gray-700 italic">"{{ booking.notes }}"</p>
            </div>
          </div>
        </div>

        <!-- Service Provider (Vendor) Information -->
        <div class="space-y-3">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Service Provider (Vendor)
          </h4>
          <div class="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-gray-100">
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Store / Business Name</p>
              <p class="font-bold text-gray-900">{{ booking.vendor?.storeName || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Owner / Contact</p>
              <p class="font-bold text-gray-800">{{ vendorOwnerName }}</p>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Provider Phone</p>
              <div class="flex items-center gap-2">
                <span class="font-bold text-gray-900">{{ vendorPhone }}</span>
                <a 
                  v-if="vendorPhone && vendorPhone !== 'N/A'" 
                  :href="`https://wa.me/${cleanPhoneForWhatsApp(vendorPhone)}`" 
                  target="_blank" 
                  class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100"
                  title="WhatsApp Vendor"
                >
                  <MessageCircle class="w-3 h-3" />
                </a>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Provider Email</p>
              <p class="font-medium text-gray-700 truncate">{{ booking.vendor?.email || booking.vendor?.owner?.email || 'N/A' }}</p>
            </div>
            <div class="col-span-2 pt-2 border-t border-gray-50">
              <p class="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">Business Address</p>
              <p class="text-xs text-gray-700">{{ booking.vendor?.address || 'On-campus / Mobile provider' }}</p>
            </div>
          </div>
        </div>

        <!-- Financial Breakdown (Erranders Economics) -->
        <div class="space-y-3">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            Financial & Erranders Benefit Breakdown
          </h4>
          <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-gray-50 border border-emerald-100 space-y-2.5 text-xs">
            <div class="flex justify-between items-center text-gray-600">
              <span>Service Subtotal:</span>
              <span class="font-bold text-gray-900">₦{{ Number(booking.price || 0).toLocaleString() }}</span>
            </div>

            <div class="flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
              <span class="flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-emerald-600" />
                Erranders Service Charge (Platform Revenue):
              </span>
              <span class="text-emerald-800 text-sm">₦{{ Number(booking.serviceCharge || 0).toLocaleString() }}</span>
            </div>

            <div class="flex justify-between items-center text-gray-600">
              <span>Vendor Commitment Deposit (Holding fee):</span>
              <span class="font-semibold text-gray-800">₦{{ Number(booking.commitmentFee || 0).toLocaleString() }}</span>
            </div>

            <div class="flex justify-between items-center text-indigo-900 font-extrabold bg-indigo-50/60 px-2.5 py-1.5 rounded-lg border border-indigo-100">
              <span>Total Upfront Amount (Charged Online):</span>
              <span class="text-indigo-600 text-sm">
                ₦{{ Number(booking.totalOnlineFee || (booking.commitmentFee + (booking.serviceCharge || 0)) || 0).toLocaleString() }}
              </span>
            </div>

            <div class="flex justify-between items-center text-gray-500 pt-1 border-t border-gray-100">
              <span>Balance Paid Directly to Vendor In-Person:</span>
              <span class="font-bold text-gray-700">₦{{ Number(booking.pendingBalance || 0).toLocaleString() }}</span>
            </div>

            <div class="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-500">
              <div>
                <span class="text-gray-400 block">Payment Method:</span>
                <strong class="text-gray-800 uppercase">{{ booking.paymentMethod?.replace('_', ' ') || 'Paystack' }}</strong>
              </div>
              <div>
                <span class="text-gray-400 block">Gateway Ref:</span>
                <strong class="text-gray-800 font-mono truncate block">{{ booking.paymentReference || 'N/A' }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Internal Notes -->
        <div v-if="booking.adminNotes" class="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs text-gray-700">
          <p class="font-bold text-[10px] text-gray-400 uppercase tracking-wider mb-1">Admin Internal Note:</p>
          <p>{{ booking.adminNotes }}</p>
        </div>

        <!-- Management Actions -->
        <div class="space-y-3 pt-4 border-t border-gray-100">
          <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Admin Status Controls
          </h4>

          <div class="grid grid-cols-2 gap-2">
            <button
              v-if="booking.status !== 'confirmed'"
              type="button"
              :disabled="actionLoading"
              @click="handleStatusChange('confirmed')"
              class="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check class="w-3.5 h-3.5" /> Mark Confirmed
            </button>

            <button
              v-if="booking.status !== 'completed'"
              type="button"
              :disabled="actionLoading"
              @click="handleStatusChange('completed')"
              class="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 class="w-3.5 h-3.5" /> Mark Completed
            </button>

            <button
              v-if="booking.status !== 'no_show' && booking.status !== 'completed'"
              type="button"
              :disabled="actionLoading"
              @click="handleStatusChange('no_show')"
              class="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <AlertTriangle class="w-3.5 h-3.5" /> Mark No-Show
            </button>

            <button
              v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
              type="button"
              :disabled="actionLoading"
              @click="handleStatusChange('cancelled')"
              class="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <XCircle class="w-3.5 h-3.5" /> Cancel Booking
            </button>
          </div>

          <!-- Reschedule Button -->
          <button
            type="button"
            v-if="booking.status !== 'completed' && booking.status !== 'cancelled'"
            @click="showRescheduleModal = true"
            class="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CalendarClock class="w-4 h-4 text-gray-500" /> Reschedule Appointment
          </button>
        </div>

      </div>

      <!-- Reschedule Modal -->
      <Teleport to="body">
        <div v-if="showRescheduleModal" class="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in border border-gray-100">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-gray-900">Reschedule Booking</h3>
              <button @click="showRescheduleModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-gray-700 mb-1">New Date</label>
                <input 
                  v-model="rescheduleDate" 
                  type="date" 
                  class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-indigo-500" 
                />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block font-bold text-gray-700 mb-1">Start Time (24h)</label>
                  <input 
                    v-model="rescheduleStartTime" 
                    type="time" 
                    class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label class="block font-bold text-gray-700 mb-1">End Time (24h)</label>
                  <input 
                    v-model="rescheduleEndTime" 
                    type="time" 
                    class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-indigo-500" 
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-2">
              <button 
                type="button" 
                @click="showRescheduleModal = false" 
                class="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button 
                type="button" 
                :disabled="rescheduling || !rescheduleDate || !rescheduleStartTime || !rescheduleEndTime"
                @click="submitReschedule" 
                class="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ rescheduling ? 'Saving...' : 'Save & Notify' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </template>
  </SideDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import { appointments_api } from '@/api_factory/modules/appointments';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { 
  Calendar, 
  Clock, 
  Copy, 
  MessageCircle, 
  CheckCircle2, 
  Check, 
  XCircle, 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  CalendarClock
} from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  booking: any;
}>();

const emit = defineEmits(['close', 'updated']);
const { showToast } = useCustomToast();

const copied = ref(false);
const verifying = ref(false);
const actionLoading = ref(false);
const showRescheduleModal = ref(false);
const rescheduling = ref(false);
const rescheduleDate = ref('');
const rescheduleStartTime = ref('');
const rescheduleEndTime = ref('');

const close = () => {
  emit('close');
};

const clientName = computed(() => {
  if (props.booking?.user) {
    const f = props.booking.user.firstName || '';
    const l = props.booking.user.lastName || '';
    return `${f} ${l}`.trim() || 'Client';
  }
  if (props.booking?.guestInfo) {
    const f = props.booking.guestInfo.firstName || '';
    const l = props.booking.guestInfo.lastName || '';
    return `${f} ${l}`.trim() || 'Guest Client';
  }
  return 'Client';
});

const clientEmail = computed(() => {
  return props.booking?.user?.email || props.booking?.guestInfo?.email || 'N/A';
});

const clientPhone = computed(() => {
  return props.booking?.user?.phoneNumber || props.booking?.guestInfo?.phone || 'N/A';
});

const clientInitials = computed(() => {
  const name = clientName.value;
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'CL';
});

const vendorOwnerName = computed(() => {
  const o = props.booking?.vendor?.owner;
  if (!o) return 'Provider';
  return `${o.firstName || ''} ${o.lastName || ''}`.trim() || o.email || 'Provider';
});

const vendorPhone = computed(() => {
  return props.booking?.vendor?.phone || props.booking?.vendor?.owner?.phone || 'N/A';
});

const totalDuration = computed(() => {
  if (!props.booking?.items?.length) return 0;
  return props.booking.items.reduce((acc: number, item: any) => {
    let dur = item.durationInMinutes || 0;
    if (item.extras?.length) {
      dur += item.extras.reduce((extAcc: number, ext: any) => extAcc + (ext.durationInMinutes || 0), 0);
    }
    return acc + dur;
  }, 0);
});

const formatScheduledDate = (dateVal: any) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const cleanPhoneForWhatsApp = (phone: string) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.startsWith('0')) cleaned = '234' + cleaned.slice(1);
  return cleaned;
};

const copyReference = () => {
  const refCode = props.booking?.paymentReference || props.booking?._id;
  if (!refCode) return;
  navigator.clipboard.writeText(refCode);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
  showToast({ title: 'Copied', message: 'Booking reference copied to clipboard', toastType: 'success' });
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'no_show': return 'bg-amber-50 text-amber-700 border-amber-200';
    default: return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

const getStatusDotClass = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-purple-500';
    case 'completed': return 'bg-emerald-500';
    case 'cancelled': return 'bg-rose-500';
    case 'no_show': return 'bg-amber-500';
    default: return 'bg-blue-500 animate-pulse';
  }
};

const getPaymentBadgeClass = (status: string) => {
  switch (status) {
    case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'pending_verification': return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
    case 'failed': return 'bg-rose-50 text-rose-700 border-rose-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const verifyDirectTransfer = async () => {
  if (!props.booking?._id) return;
  verifying.value = true;
  try {
    await appointments_api.verifyDirectTransfer(props.booking._id);
    showToast({ title: 'Success', message: 'Direct transfer verified successfully. Booking is now confirmed!', toastType: 'success' });
    emit('updated');
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Verification failed', toastType: 'error' });
  } finally {
    verifying.value = false;
  }
};

const handleStatusChange = async (newStatus: string) => {
  if (!props.booking?._id) return;
  actionLoading.value = true;
  try {
    await appointments_api.updateStatus(props.booking._id, newStatus);
    showToast({ title: 'Success', message: `Booking marked as ${newStatus}`, toastType: 'success' });
    emit('updated');
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Failed to update status', toastType: 'error' });
  } finally {
    actionLoading.value = false;
  }
};

const submitReschedule = async () => {
  if (!props.booking?._id || !rescheduleDate.value || !rescheduleStartTime.value || !rescheduleEndTime.value) return;
  rescheduling.value = true;
  try {
    await appointments_api.reschedule(props.booking._id, {
      scheduledDate: rescheduleDate.value,
      startTime: rescheduleStartTime.value,
      endTime: rescheduleEndTime.value
    });
    showToast({ title: 'Success', message: 'Appointment rescheduled successfully!', toastType: 'success' });
    showRescheduleModal.value = false;
    emit('updated');
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Failed to reschedule', toastType: 'error' });
  } finally {
    rescheduling.value = false;
  }
};
</script>

