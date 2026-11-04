<template>
  <div class="space-y-6 animate-fade-in">
    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- 1. LIVE "ON DUTY NOW" HERO BANNER                            -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-6 sm:p-7 text-white shadow-xl border border-gray-800">
      <!-- Background Glow -->
      <div class="absolute -top-24 -right-24 w-72 h-72 bg-[#FF5C1A]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <!-- Left: Current Duty Status -->
        <div class="space-y-3">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span
              v-if="dutyStatus.isShiftActive && settings.enabled"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              SHIFT ACTIVE NOW
            </span>
            <span
              v-else-if="!settings.enabled"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30"
            >
              ⚠️ SHIFT FILTERING DISABLED (Broadcasting to All)
            </span>
            <span
              v-else
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-700/60 text-gray-300 border border-gray-700"
            >
              🌙 OFF-HOURS (No Shift Active)
            </span>

            <span class="text-xs text-gray-400 font-mono flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5 text-gray-400" />
              {{ dutyStatus.currentDay }} · {{ dutyStatus.currentTime }} WAT (Nigeria)
            </span>
          </div>

          <div class="flex items-center gap-4 flex-wrap">
            <!-- Ninja Avatar -->
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5C1A] to-orange-400 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 shrink-0 border-2 border-white/20">
              🛵
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Currently On Duty</p>
              <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{{ dutyStatus.assignedNinjaName || 'None' }}</span>
                <span v-if="dutyStatus.isShiftActive" class="text-xs font-bold px-2 py-0.5 rounded-lg bg-[#FF5C1A] text-white">
                  Errand Ninja
                </span>
              </h2>
              <p class="text-xs text-gray-300 mt-0.5">
                <span class="font-bold text-orange-400">{{ dutyStatus.currentShift?.name || 'Off-Hours' }}</span>:
                {{ dutyStatus.currentShift?.timeLabel || 'Outside scheduled shifts (11 PM – 9 AM)' }}
              </p>
            </div>
          </div>

          <!-- Contact Status Pill -->
          <div class="flex items-center gap-3 text-xs flex-wrap pt-1">
            <div
              v-if="dutyStatus.onDutyNinja?.phone"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10"
            >
              <Phone class="w-3.5 h-3.5 text-emerald-400" />
              <span class="font-mono font-bold">{{ dutyStatus.onDutyNinja.phone }}</span>
              <span class="text-[10px] text-emerald-400 font-bold">● WhatsApp Ready</span>
            </div>
            <div
              v-else
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold"
            >
              <AlertCircle class="w-3.5 h-3.5" />
              No WhatsApp phone configured for {{ dutyStatus.assignedNinjaName }}. Add in roster below!
            </div>
          </div>
        </div>

        <!-- Right: Actions & Upcoming Shift Preview -->
        <div class="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
          <!-- Test WhatsApp Alert Button -->
          <button
            @click="sendTestAlert"
            :disabled="testingAlert"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all shadow-md"
            :class="dutyStatus.onDutyNinja?.phone
              ? 'bg-[#FF5C1A] hover:bg-[#e04f14] text-white shadow-orange-500/30'
              : 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'"
          >
            <Send class="w-3.5 h-3.5" :class="{ 'animate-pulse': testingAlert }" />
            <span>{{ testingAlert ? 'Sending Test...' : `Test WhatsApp Alert to ${dutyStatus.assignedNinjaName}` }}</span>
          </button>

          <!-- Next Shift Preview Card -->
          <div v-if="dutyStatus.nextShift" class="p-3 rounded-2xl bg-white/5 border border-white/10 text-right min-w-[220px]">
            <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Next Upcoming Shift</p>
            <p class="text-xs font-black text-white mt-0.5">
              {{ dutyStatus.nextShift.day }} · {{ dutyStatus.nextShift.shift?.timeLabel }}
            </p>
            <p class="text-xs font-bold text-orange-400 mt-0.5">
              Assigned: {{ dutyStatus.nextShift.assignedNinja }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- 2. SHIFT SETTINGS & CONTROLS TOOLBAR                          -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h3 class="text-sm font-black text-gray-900 flex items-center gap-2">
          <Shield class="w-4 h-4 text-[#FF5C1A]" />
          Shift-Controlled Bot Dispatch Rules
        </h3>
        <p class="text-xs text-gray-500">
          When enabled, Erranders Bot sends new errand notifications only to the ninja assigned to the current shift slot.
        </p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <!-- Master Enable Toggle -->
        <label class="flex items-center gap-2.5 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2 px-3 rounded-xl border border-gray-200 transition-colors">
          <input
            v-model="settings.enabled"
            type="checkbox"
            class="w-4 h-4 accent-[#FF5C1A] rounded"
          />
          <div class="text-left">
            <span class="text-xs font-black block" :class="settings.enabled ? 'text-gray-900' : 'text-gray-500'">
              {{ settings.enabled ? 'Shift Filtering Active' : 'Shift Filtering Disabled' }}
            </span>
            <span class="text-[10px] text-gray-400 block">
              {{ settings.enabled ? 'Alerts restricted to on-duty ninja' : 'Broadcasts to all campus erranders' }}
            </span>
          </div>
        </label>

        <!-- Off-Hours Fallback Toggle -->
        <label class="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 p-2 px-3 rounded-xl border border-gray-200 transition-colors">
          <input
            type="checkbox"
            :checked="settings.offHoursFallback === 'all'"
            @change="settings.offHoursFallback = ($event.target as any).checked ? 'all' : 'none'"
            class="w-4 h-4 accent-[#FF5C1A] rounded"
          />
          <span class="text-xs font-bold text-gray-700">Fallback to All during Off-Hours</span>
        </label>

        <!-- Reset Button -->
        <button
          @click="resetToDefaults"
          :disabled="saving"
          title="Reset to official schedule"
          class="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <RotateCcw class="w-3.5 h-3.5 text-gray-400" />
          <span>Reset Schedule</span>
        </button>

        <!-- Save Button -->
        <button
          @click="saveSchedule"
          :disabled="saving"
          class="flex items-center gap-2 px-4 py-2 bg-[#FF5C1A] hover:bg-[#e04f14] text-white rounded-xl text-xs font-black transition-all shadow-sm shadow-[#FF5C1A]/20"
        >
          <Save class="w-3.5 h-3.5" :class="{ 'animate-spin': saving }" />
          <span>{{ saving ? 'Saving...' : 'Save All Changes' }}</span>
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- 3. WEEKLY SHIFT SCHEDULE MATRIX (7 DAYS x 3 SHIFTS)           -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
      <div class="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 bg-gray-50/50">
        <div class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-[#FF5C1A]" />
          <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider">Weekly Shift Timetable</h3>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5C1A]">
            7 Days · 3 Shift Slots / Day
          </span>
        </div>
        <p class="text-xs text-gray-400">Click any shift cell to reassign the on-duty Errand Ninja</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-[11px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-100">
              <th class="px-5 py-4 w-36">Day of Week</th>
              <th
                v-for="shift in settings.shifts"
                :key="shift.shiftId"
                class="px-5 py-4"
              >
                <div class="flex items-center gap-1.5">
                  <span class="text-base">
                    {{ shift.shiftId === 'shift_1' ? '🌅' : shift.shiftId === 'shift_2' ? '☀️' : '🌙' }}
                  </span>
                  <div>
                    <p class="font-black text-gray-900">{{ shift.name }}</p>
                    <p class="text-[10px] text-gray-400 font-mono">{{ shift.timeLabel }}</p>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-xs">
            <tr
              v-for="daySched in settings.schedule"
              :key="daySched.day"
              class="hover:bg-gray-50/80 transition-colors"
              :class="{ 'bg-orange-50/30 font-bold': daySched.day.toLowerCase() === dutyStatus.currentDay?.toLowerCase() }"
            >
              <!-- Day Column -->
              <td class="px-5 py-4 font-black text-gray-900">
                <div class="flex items-center gap-2">
                  <span>{{ daySched.day }}</span>
                  <span
                    v-if="daySched.day.toLowerCase() === dutyStatus.currentDay?.toLowerCase()"
                    class="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#FF5C1A] text-white"
                  >
                    Today
                  </span>
                </div>
              </td>

              <!-- Shift Columns -->
              <td
                v-for="shift in settings.shifts"
                :key="shift.shiftId"
                class="px-5 py-3.5"
                :class="{
                  'bg-orange-100/40 border-2 border-[#FF5C1A]/40 rounded-xl': isCurrentShiftSlot(daySched.day, shift.shiftId),
                }"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="relative w-full">
                    <select
                      :value="getSlotNinja(daySched.day, shift.shiftId)"
                      @change="setSlotNinja(daySched.day, shift.shiftId, ($event.target as any).value)"
                      class="w-full pl-3 pr-8 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer appearance-none"
                      :class="getNinjaSelectClass(getSlotNinja(daySched.day, shift.shiftId))"
                    >
                      <option
                        v-for="ninja in settings.ninjas"
                        :key="ninja.id"
                        :value="ninja.name"
                      >
                        🛵 {{ ninja.name }} {{ ninja.phone ? `(${ninja.phone})` : '' }}
                      </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <ChevronDown class="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <!-- Active Live Badge if this exact slot is active right now -->
                  <span
                    v-if="isCurrentShiftSlot(daySched.day, shift.shiftId) && settings.enabled"
                    class="shrink-0 px-2 py-1 rounded-lg text-[10px] font-black bg-[#FF5C1A] text-white flex items-center gap-1 shadow-2xs"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    ON DUTY
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- 4. NINJA PERSONNEL & WHATSAPP ROSTER DIRECTORY                -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 sm:p-6 space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-4">
        <div>
          <h3 class="text-sm font-black text-gray-900 flex items-center gap-2">
            <Users class="w-4 h-4 text-[#FF5C1A]" />
            Ninja Roster & Phone Numbers
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            Set each Errand Ninja's WhatsApp phone number so the bot knows exactly where to dispatch order alerts.
          </p>
        </div>

        <button
          @click="addNinjaToRoster"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
        >
          <Plus class="w-3.5 h-3.5 text-[#FF5C1A]" />
          Add Ninja to Roster
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="ninja in settings.ninjas"
          :key="ninja.id"
          class="p-4 rounded-2xl border transition-all space-y-3 relative"
          :class="dutyStatus.assignedNinjaName?.toLowerCase() === ninja.name.toLowerCase() && dutyStatus.isShiftActive
            ? 'bg-orange-50/50 border-orange-200 shadow-sm'
            : 'bg-white border-gray-200/80 hover:border-gray-300'"
        >
          <!-- Ninja Header -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-2xs"
                :class="getNinjaAvatarClass(ninja.name)"
              >
                <span>{{ ninja.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div>
                <input
                  v-model="ninja.name"
                  type="text"
                  placeholder="Ninja Name (e.g. Ife)"
                  class="text-xs font-black text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-[#FF5C1A] w-28"
                />
                <p class="text-[10px] text-gray-400 mt-0.5">
                  {{ getWeeklyShiftsCount(ninja.name) }} shifts · {{ getWeeklyShiftsCount(ninja.name) * 5 }} hrs/wk
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <span
                v-if="dutyStatus.assignedNinjaName?.toLowerCase() === ninja.name.toLowerCase() && dutyStatus.isShiftActive"
                class="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FF5C1A] text-white shadow-2xs"
              >
                On Duty
              </span>
              <button
                v-if="settings.ninjas.length > 3"
                @click="removeNinja(ninja.id)"
                title="Remove Ninja"
                class="text-gray-300 hover:text-red-500 p-1"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- WhatsApp Phone Input -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
              <span>WhatsApp Phone</span>
              <span v-if="ninja.phone" class="text-emerald-600 font-normal">Ready</span>
              <span v-else class="text-amber-600 font-bold">Required</span>
            </label>
            <div class="relative">
              <Phone class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="ninja.phone"
                type="text"
                placeholder="e.g. +2348012345678"
                class="w-full pl-8 pr-2.5 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5C1A] font-mono text-gray-900"
              />
            </div>
          </div>

          <!-- Account Link (Optional) -->
          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between">
              <span>Link User Account</span>
              <span class="text-[9px] text-gray-400">For in-app push alerts</span>
            </label>
            <select
              v-model="ninja.userId"
              class="w-full px-2.5 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5C1A] text-gray-800"
            >
              <option value="">Unlinked (WhatsApp Direct Only)</option>
              <option
                v-for="user in erranderUsers"
                :key="user._id"
                :value="user._id"
              >
                {{ user.firstName }} {{ user.lastName }} ({{ user.phone || user.email }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Clock,
  Send,
  Phone,
  AlertCircle,
  Shield,
  RotateCcw,
  Save,
  Calendar,
  ChevronDown,
  Users,
  Plus,
  Trash2,
} from 'lucide-vue-next';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';

const { showToast } = useToast();

const loading = ref(true);
const saving = ref(false);
const testingAlert = ref(false);

const settings = ref<any>({
  enabled: true,
  timezone: 'Africa/Lagos',
  offHoursFallback: 'all',
  directWhatsAppEnabled: true,
  shifts: [],
  ninjas: [],
  schedule: [],
});

const dutyStatus = ref<any>({
  enabled: true,
  isShiftActive: false,
  currentDay: '',
  currentTime: '',
  assignedNinjaName: '',
  currentShift: null,
  onDutyNinja: null,
  nextShift: null,
});

const erranderUsers = ref<any[]>([]);

// Load Schedule & Duty Status
const loadData = async () => {
  loading.value = true;
  try {
    const [shiftsRes, usersRes] = await Promise.all([
      admin_api.getNinjaShifts(),
      admin_api.getUsers().catch(() => ({ data: [] })),
    ]);

    if (shiftsRes.data?.settings) {
      settings.value = shiftsRes.data.settings;
    }
    if (shiftsRes.data?.dutyStatus) {
      dutyStatus.value = shiftsRes.data.dutyStatus;
    }

    const allUsers = Array.isArray(usersRes.data?.users) ? usersRes.data.users : Array.isArray(usersRes.data) ? usersRes.data : [];
    erranderUsers.value = allUsers.filter((u: any) => u.role === 'errander');
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Could not load shift timetable',
      toastType: 'error',
    } as any);
  } finally {
    loading.value = false;
  }
};

// Slot Helpers
const getSlotNinja = (day: string, shiftId: string) => {
  const daySched = settings.value.schedule?.find((s: any) => s.day.toLowerCase() === day.toLowerCase());
  const slot = daySched?.slots?.find((sl: any) => sl.shiftId === shiftId);
  return slot?.ninjaName || '';
};

const setSlotNinja = (day: string, shiftId: string, ninjaName: string) => {
  const daySched = settings.value.schedule?.find((s: any) => s.day.toLowerCase() === day.toLowerCase());
  if (!daySched) return;
  const slot = daySched.slots?.find((sl: any) => sl.shiftId === shiftId);
  if (slot) {
    slot.ninjaName = ninjaName;
  } else {
    daySched.slots.push({ shiftId, ninjaName });
  }
};

const isCurrentShiftSlot = (day: string, shiftId: string) => {
  if (!dutyStatus.value.isShiftActive) return false;
  return (
    day.toLowerCase() === dutyStatus.value.currentDay?.toLowerCase() &&
    shiftId === dutyStatus.value.currentShift?.shiftId
  );
};

const getWeeklyShiftsCount = (ninjaName: string) => {
  if (!ninjaName || !settings.value.schedule) return 0;
  let count = 0;
  for (const day of settings.value.schedule) {
    for (const slot of day.slots || []) {
      if (slot.ninjaName?.toLowerCase() === ninjaName.toLowerCase()) {
        count++;
      }
    }
  }
  return count;
};

// Styling Helpers
const getNinjaSelectClass = (name: string) => {
  switch (name?.toLowerCase()) {
    case 'ife':
      return 'bg-purple-50 text-purple-800 border-purple-200';
    case 'brandy':
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case 'seun':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

const getNinjaAvatarClass = (name: string) => {
  switch (name?.toLowerCase()) {
    case 'ife':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'brandy':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'seun':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Roster Management
const addNinjaToRoster = () => {
  const newId = `ninja_${Date.now()}`;
  settings.value.ninjas.push({
    id: newId,
    name: `Ninja ${settings.value.ninjas.length + 1}`,
    phone: '',
    userId: '',
    isActive: true,
  });
};

const removeNinja = (id: string) => {
  settings.value.ninjas = settings.value.ninjas.filter((n: any) => n.id !== id);
};

// Save All Changes
const saveSchedule = async () => {
  saving.value = true;
  try {
    const res = await admin_api.updateNinjaShifts(settings.value);
    if (res.data?.settings) settings.value = res.data.settings;
    if (res.data?.dutyStatus) dutyStatus.value = res.data.dutyStatus;

    showToast({
      title: 'Schedule Saved',
      message: 'Weekly Shift Schedule and bot dispatch rules saved successfully!',
      toastType: 'success',
    } as any);
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Failed to save shift schedule',
      toastType: 'error',
    } as any);
  } finally {
    saving.value = false;
  }
};

// Reset to Default Schedule
const resetToDefaults = async () => {
  if (!confirm('Are you sure you want to reset the timetable back to the official Ife/Brandy/Seun schedule?')) {
    return;
  }
  saving.value = true;
  try {
    const res = await admin_api.resetNinjaShifts();
    if (res.data?.settings) settings.value = res.data.settings;
    if (res.data?.dutyStatus) dutyStatus.value = res.data.dutyStatus;

    showToast({
      title: 'Schedule Reset',
      message: 'Timetable reset to the official weekly schedule!',
      toastType: 'success',
    } as any);
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Failed to reset schedule',
      toastType: 'error',
    } as any);
  } finally {
    saving.value = false;
  }
};

// Send Test WhatsApp Alert
const sendTestAlert = async () => {
  testingAlert.value = true;
  try {
    const res = await admin_api.testNinjaShiftAlert({
      phone: dutyStatus.value.onDutyNinja?.phone,
      ninjaName: dutyStatus.value.assignedNinjaName,
    });

    if (res.data?.success) {
      showToast({
        title: 'Test Alert Sent',
        message: res.data.message || `Test message sent to ${dutyStatus.value.assignedNinjaName}!`,
        toastType: 'success',
      } as any);
    } else {
      showToast({
        title: 'Alert Warning',
        message: res.data?.message || 'Could not send test WhatsApp alert',
        toastType: 'warning',
      } as any);
    }
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Failed to trigger test alert',
      toastType: 'error',
    } as any);
  } finally {
    testingAlert.value = false;
  }
};

onMounted(loadData);
</script>

