<template>
  <div class="space-y-6 animate-fade-in container mx-auto pb-20 font-sans">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold text-gray-900 font-heading tracking-tight">Booked Services</h1>
        <p class="text-sm font-medium text-gray-500">Monitor and track client service bookings, appointments, and platform revenue.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          @click="fetchBookings"
          class="rounded-xl bg-gray-100 hover:bg-gray-200 px-3.5 py-2.5 text-xs font-bold text-gray-700 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>

        <!-- Date Filters -->
        <DateRangePicker 
          v-model:start="startDate" 
          v-model:end="endDate" 
          @update:start="fetchBookings" 
          @update:end="fetchBookings" 
        />

        <button 
          v-if="startDate || endDate || selectedStatus || selectedPaymentStatus || selectedPaymentMethod || searchQuery" 
          @click="clearFilters" 
          class="text-xs font-bold text-gray-500 hover:text-gray-900 underline underline-offset-2 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Status Guide Legend -->
    <div class="bg-indigo-50/50 border border-indigo-100 rounded-[1.25rem] p-4 flex flex-col md:flex-row gap-4 items-start md:items-center text-xs text-indigo-900">
      <div class="flex items-center gap-2 font-bold whitespace-nowrap">
        <Activity class="w-4 h-4 text-indigo-600" />
        Booking Status Guide:
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-500"></span><strong class="font-semibold">Pending:</strong> Awaiting confirmation</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-500"></span><strong class="font-semibold">Confirmed:</strong> Slot held & deposit secured</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span><strong class="font-semibold">Completed:</strong> Service rendered successfully</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span><strong class="font-semibold">Cancelled:</strong> Terminated booking</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-500"></span><strong class="font-semibold">No Show:</strong> Client missed slot</span>
        <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><strong class="font-semibold">Verification:</strong> Transfer receipt awaiting check</span>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <!-- Total Bookings -->
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-none col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
            <CalendarCheck class="w-4 h-4" />
          </div>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Bookings</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight mt-0.5">{{ stats.totalBookings || 0 }}</h3>
        </div>
      </div>

      <!-- Erranders Service Fee Revenue -->
      <div class="bg-white p-4 rounded-[1.25rem] border border-emerald-100/80 bg-gradient-to-br from-emerald-50/30 to-white shadow-none col-span-2 lg:col-span-2">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-700">
            <ShieldCheck class="w-4 h-4" />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Erranders Profit</span>
        </div>
        <div>
          <p class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Erranders Service Charge</p>
          <h3 class="text-xl font-black text-emerald-700 tracking-tight mt-0.5">₦{{ (stats.totalServiceCharge || 0).toLocaleString() }}</h3>
        </div>
      </div>

      <!-- Total Service GMV -->
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-none col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total GMV</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight mt-0.5">₦{{ (stats.totalRevenue || 0).toLocaleString() }}</h3>
        </div>
      </div>

      <!-- Pending -->
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-none">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight mt-0.5">{{ stats.pending || 0 }}</h3>
        </div>
      </div>

      <!-- Confirmed -->
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-none">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
            <CheckCircle2 class="w-4 h-4" />
          </div>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirmed</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight mt-0.5">{{ stats.confirmed || 0 }}</h3>
        </div>
      </div>

      <!-- Completed -->
      <div class="bg-white p-4 rounded-[1.25rem] border border-gray-100 shadow-none">
        <div class="flex items-center justify-between mb-3">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
            <Check class="w-4 h-4" />
          </div>
        </div>
        <div>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
          <h3 class="text-xl font-black text-gray-900 tracking-tight mt-0.5">{{ stats.completed || 0 }}</h3>
        </div>
      </div>
    </div>

    <!-- Verification Banner if pending direct transfers -->
    <div 
      v-if="stats.pendingVerifications > 0" 
      class="bg-amber-500/10 border border-amber-300 rounded-[1.25rem] p-4 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          !
        </div>
        <div>
          <h4 class="text-sm font-bold text-amber-900">
            {{ stats.pendingVerifications }} Direct Transfer{{ stats.pendingVerifications > 1 ? 's' : '' }} Awaiting Payment Verification
          </h4>
          <p class="text-xs text-amber-700">Filter by payment status to review uploaded bank receipts and confirm bookings.</p>
        </div>
      </div>
      <button 
        @click="selectedPaymentStatus = 'pending_verification'; fetchBookings()" 
        class="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition"
      >
        View Pending Transfers
      </button>
    </div>

    <!-- Filters & Search Bar -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
      <!-- Search Input -->
      <div class="relative md:col-span-1">
        <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          v-model="searchQuery"
          @input="handleSearchDebounced"
          type="text"
          placeholder="Search by ref, client, vendor..."
          class="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <!-- Status Filter -->
      <select 
        v-model="selectedStatus" 
        @change="fetchBookings"
        class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="no_show">No Show</option>
      </select>

      <!-- Payment Status Filter -->
      <select 
        v-model="selectedPaymentStatus" 
        @change="fetchBookings"
        class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
      >
        <option value="">All Payment Statuses</option>
        <option value="success">Paid / Success</option>
        <option value="pending_verification">Awaiting Verification</option>
        <option value="pending">Pending Payment</option>
        <option value="failed">Failed</option>
      </select>

      <!-- Payment Method Filter -->
      <select 
        v-model="selectedPaymentMethod" 
        @change="fetchBookings"
        class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
      >
        <option value="">All Payment Methods</option>
        <option value="paystack">Online (Paystack)</option>
        <option value="direct_transfer">Direct Bank Transfer</option>
      </select>
    </div>

    <!-- Bookings Table Section -->
    <div class="bg-white rounded-[1.25rem] border border-gray-100 overflow-hidden min-h-[400px]">
      <!-- Skeleton Loading State -->
      <div v-if="loading" class="p-8 space-y-5">
        <div v-for="i in 5" :key="`skel-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-100 rounded-full w-1/3" />
            <div class="h-2 bg-gray-100 rounded-full w-1/4" />
          </div>
          <div class="w-20 h-7 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="py-24 text-center bg-gray-50/30">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <CalendarX class="w-6 h-6 text-gray-400" />
        </div>
        <h4 class="font-bold text-gray-900 text-base tracking-tight">No booked services found</h4>
        <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Try adjusting your filters or date range.</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              <th class="px-4 py-3 w-[22%]">Client & Reference</th>
              <th class="px-4 py-3 w-[18%]">Service Provider</th>
              <th class="px-4 py-3 w-[18%]">Services & Duration</th>
              <th class="px-4 py-3 w-[16%]">Schedule Date</th>
              <th class="px-4 py-3 text-right w-[16%]">Financials</th>
              <th class="px-4 py-3 text-center w-[10%]">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100/70 text-xs">
            <tr 
              v-for="booking in bookings" 
              :key="booking._id" 
              @click="openDetails(booking)"
              class="hover:bg-gray-50/60 transition-colors group cursor-pointer"
            >
              <!-- Client & Ref -->
              <td class="px-4 py-3 align-top">
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {{ getClientInitials(booking) }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <p class="font-bold text-gray-900 truncate">{{ getClientName(booking) }}</p>
                      <a 
                        v-if="getClientPhone(booking) && getClientPhone(booking) !== 'N/A'" 
                        :href="`https://wa.me/${cleanPhoneForWhatsApp(getClientPhone(booking))}`" 
                        @click.stop 
                        target="_blank" 
                        class="text-emerald-500 hover:text-emerald-600"
                        title="Chat Client on WhatsApp"
                      >
                        <MessageCircle class="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p class="text-[11px] text-gray-500 truncate">{{ getClientEmail(booking) }}</p>
                    <div class="flex items-center gap-1.5 mt-1">
                      <span class="text-[9px] font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded font-bold">
                        {{ booking.paymentReference || booking._id?.slice(-8).toUpperCase() }}
                      </span>
                      <span 
                        class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                        :class="booking.user ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'"
                      >
                        {{ booking.user ? 'Student' : 'Guest' }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Service Provider -->
              <td class="px-4 py-3 align-top">
                <div class="flex items-start gap-2">
                  <Store class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 truncate max-w-[180px]">{{ booking.vendor?.storeName || 'Service Vendor' }}</p>
                    <p class="text-[11px] text-gray-500 truncate max-w-[180px]">{{ booking.vendor?.address || 'Campus Vendor' }}</p>
                    <p v-if="booking.vendor?.phone" class="text-[10px] text-gray-400 mt-0.5">{{ booking.vendor.phone }}</p>
                  </div>
                </div>
              </td>

              <!-- Services & Duration -->
              <td class="px-4 py-3 align-top">
                <div>
                  <p class="font-bold text-gray-900 truncate max-w-[180px]">
                    {{ booking.items?.[0]?.service?.name || 'Service' }}
                    <span v-if="booking.items?.length > 1" class="text-indigo-600 font-semibold">+{{ booking.items.length - 1 }} more</span>
                  </p>
                  <p v-if="booking.items?.[0]?.variantName" class="text-[11px] text-indigo-600 font-medium">
                    {{ booking.items[0].variantName }}
                  </p>
                  <div class="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
                    <Clock class="w-3 h-3 text-gray-400" />
                    <span>{{ calculateTotalDuration(booking) }} mins</span>
                  </div>
                </div>
              </td>

              <!-- Schedule Date -->
              <td class="px-4 py-3 align-top">
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-gray-900">{{ formatDateOnly(booking.scheduledDate) }}</span>
                    <span 
                      v-if="isToday(booking.scheduledDate)" 
                      class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800"
                    >
                      Today
                    </span>
                  </div>
                  <p class="text-[11px] text-gray-500 mt-0.5">{{ booking.startTime }} - {{ booking.endTime }}</p>
                </div>
              </td>

              <!-- Financials -->
              <td class="px-4 py-3 align-top text-right">
                <div class="space-y-0.5">
                  <p class="font-black text-gray-900">₦{{ Number(booking.price || 0).toLocaleString() }}</p>
                  <div class="flex items-center justify-end gap-1">
                    <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100" title="Erranders Platform Service Charge">
                      Fee: ₦{{ Number(booking.serviceCharge || 0).toLocaleString() }}
                    </span>
                  </div>
                  <p class="text-[10px] text-gray-400">
                    Paid: ₦{{ Number(booking.totalOnlineFee || booking.commitmentFee || 0).toLocaleString() }} · Bal: ₦{{ Number(booking.pendingBalance || 0).toLocaleString() }}
                  </p>
                  <div>
                    <span 
                      class="inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border"
                      :class="getPaymentBadgeClass(booking.paymentStatus)"
                    >
                      {{ booking.paymentStatus?.replace('_', ' ') }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-4 py-3 align-top text-center">
                <span 
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border"
                  :class="getStatusBadgeClass(booking.status)"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(booking.status)"></span>
                  {{ booking.status?.replace('_', ' ') }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 align-top text-right">
                <div class="flex items-center justify-end gap-1.5" @click.stop>
                  <button
                    v-if="booking.paymentStatus === 'pending_verification'"
                    @click="verifyDirectTransfer(booking)"
                    class="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-sm transition"
                    title="Verify Direct Transfer"
                  >
                    Verify
                  </button>

                  <button
                    @click="openDetails(booking)"
                    class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                    title="View Details"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="meta.totalPages > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-500 font-medium">
          Showing <span class="font-bold text-gray-900">{{ (meta.page - 1) * meta.limit + 1 }}</span> to 
          <span class="font-bold text-gray-900">{{ Math.min(meta.page * meta.limit, meta.total) }}</span> of 
          <span class="font-bold text-gray-900">{{ meta.total }}</span> bookings
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="meta.page <= 1"
            @click="changePage(meta.page - 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>
          <span class="text-xs font-bold text-gray-900 px-2">{{ meta.page }} / {{ meta.totalPages }}</span>
          <button
            type="button"
            :disabled="meta.page >= meta.totalPages"
            @click="changePage(meta.page + 1)"
            class="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Details Drawer Component -->
    <BookingDetailsDrawer
      :isOpen="isDrawerOpen"
      :booking="selectedBooking"
      @close="isDrawerOpen = false"
      @updated="handleBookingUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { appointments_api } from '@/api_factory/modules/appointments';
import { useCustomToast } from '@/composables/core/useCustomToast';
import BookingDetailsDrawer from '@/components/services/BookingDetailsDrawer.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';
import { 
  CalendarCheck, 
  CalendarX, 
  Clock, 
  Search, 
  Store, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Check, 
  Activity, 
  DollarSign, 
  RefreshCw, 
  Eye 
} from 'lucide-vue-next';

definePageMeta({
  layout: 'admin',
});

const { showToast } = useCustomToast();

const loading = ref(false);
const bookings = ref<any[]>([]);
const stats = ref<any>({});
const meta = ref({
  page: 1,
  limit: 15,
  total: 0,
  totalPages: 1
});

// Filters
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedPaymentStatus = ref('');
const selectedPaymentMethod = ref('');
const startDate = ref('');
const endDate = ref('');

// Drawer state
const isDrawerOpen = ref(false);
const selectedBooking = ref<any>(null);

let debounceTimeout: any = null;
const handleSearchDebounced = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    meta.value.page = 1;
    fetchBookings();
  }, 400);
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  selectedPaymentStatus.value = '';
  selectedPaymentMethod.value = '';
  startDate.value = '';
  endDate.value = '';
  meta.value.page = 1;
  fetchBookings();
};

const fetchBookings = async () => {
  loading.value = true;
  try {
    const query: Record<string, any> = {
      page: meta.value.page,
      limit: meta.value.limit,
    };

    if (searchQuery.value.trim()) query.search = searchQuery.value.trim();
    if (selectedStatus.value) query.status = selectedStatus.value;
    if (selectedPaymentStatus.value) query.paymentStatus = selectedPaymentStatus.value;
    if (selectedPaymentMethod.value) query.paymentMethod = selectedPaymentMethod.value;
    if (startDate.value) query.startDate = startDate.value;
    if (endDate.value) query.endDate = endDate.value;

    const res = await appointments_api.getAdminAppointments(query);
    const result = res.data || {};
    bookings.value = result.data || [];
    meta.value = result.meta || { page: 1, limit: 15, total: 0, totalPages: 1 };
    stats.value = result.stats || {};
  } catch (err: any) {
    console.error('Failed to load bookings:', err);
    showToast({ title: 'Error', message: 'Failed to load booked services.', toastType: 'error' });
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage: number) => {
  meta.value.page = newPage;
  fetchBookings();
};

const openDetails = (booking: any) => {
  selectedBooking.value = booking;
  isDrawerOpen.value = true;
};

const handleBookingUpdated = () => {
  fetchBookings();
  if (selectedBooking.value?._id) {
    appointments_api.getAdminAppointment(selectedBooking.value._id).then(res => {
      selectedBooking.value = res.data;
    }).catch(() => {});
  }
};

const verifyDirectTransfer = async (booking: any) => {
  try {
    await appointments_api.verifyDirectTransfer(booking._id);
    showToast({ title: 'Success', message: 'Payment verified and appointment confirmed!', toastType: 'success' });
    fetchBookings();
  } catch (err: any) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Verification failed', toastType: 'error' });
  }
};

const getClientName = (booking: any) => {
  if (booking?.user) {
    const f = booking.user.firstName || '';
    const l = booking.user.lastName || '';
    return `${f} ${l}`.trim() || 'Client';
  }
  if (booking?.guestInfo) {
    const f = booking.guestInfo.firstName || '';
    const l = booking.guestInfo.lastName || '';
    return `${f} ${l}`.trim() || 'Guest';
  }
  return 'Client';
};

const getClientEmail = (booking: any) => {
  return booking?.user?.email || booking?.guestInfo?.email || 'N/A';
};

const getClientPhone = (booking: any) => {
  return booking?.user?.phoneNumber || booking?.guestInfo?.phone || 'N/A';
};

const getClientInitials = (booking: any) => {
  const name = getClientName(booking);
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'CL';
};

const calculateTotalDuration = (booking: any) => {
  if (!booking?.items?.length) return 0;
  return booking.items.reduce((acc: number, item: any) => {
    let dur = item.durationInMinutes || 0;
    if (item.extras?.length) {
      dur += item.extras.reduce((extAcc: number, ext: any) => extAcc + (ext.durationInMinutes || 0), 0);
    }
    return acc + dur;
  }, 0);
};

const formatDateOnly = (dateVal: any) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isToday = (dateVal: any) => {
  if (!dateVal) return false;
  const d = new Date(dateVal);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

const cleanPhoneForWhatsApp = (phone: string) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.startsWith('0')) cleaned = '234' + cleaned.slice(1);
  return cleaned;
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

onMounted(() => {
  fetchBookings();
});
</script>

