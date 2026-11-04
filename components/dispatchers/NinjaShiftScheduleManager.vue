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

        <!-- Off-Hours Fallback Custom Dropdown -->
        <div class="relative custom-dropdown-container">
          <button
            type="button"
            @click.stop="toggleOffHoursDropdown"
            class="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 p-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 transition-all focus:outline-none focus:border-[#FF5C1A] shadow-2xs"
          >
            <span class="text-[10px] uppercase font-black tracking-wider text-gray-400">Off-Hours:</span>
            <span>{{ settings.offHoursFallback === 'all' ? '📢 Broadcast to All' : '🤫 Suppress Alerts' }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showOffHoursDropdown }" />
          </button>

          <div
            v-if="showOffHoursDropdown"
            class="absolute right-0 z-50 mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-1.5 space-y-1 animate-scale-in"
          >
            <button
              type="button"
              @click="setOffHoursFallback('all')"
              class="w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors"
              :class="settings.offHoursFallback === 'all' ? 'bg-orange-50/80 text-[#FF5C1A]' : 'hover:bg-gray-50 text-gray-700'"
            >
              <span class="text-base">📢</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-black">Broadcast to All (Default)</p>
                <p class="text-[10px] text-gray-400 leading-tight">Orders during 11 PM – 9 AM alert all active erranders.</p>
              </div>
              <Check v-if="settings.offHoursFallback === 'all'" class="w-4 h-4 text-[#FF5C1A] shrink-0 mt-0.5" />
            </button>

            <button
              type="button"
              @click="setOffHoursFallback('none')"
              class="w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors"
              :class="settings.offHoursFallback === 'none' ? 'bg-orange-50/80 text-[#FF5C1A]' : 'hover:bg-gray-50 text-gray-700'"
            >
              <span class="text-base">🤫</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-black">Suppress Alerts</p>
                <p class="text-[10px] text-gray-400 leading-tight">No bot notifications dispatched during off-hours.</p>
              </div>
              <Check v-if="settings.offHoursFallback === 'none'" class="w-4 h-4 text-[#FF5C1A] shrink-0 mt-0.5" />
            </button>
          </div>
        </div>

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
                  <div class="relative w-full custom-dropdown-container">
                    <!-- Custom Slot Dropdown Trigger -->
                    <button
                      type="button"
                      @click.stop="toggleSlotDropdown(daySched.day, shift.shiftId)"
                      class="w-full pl-3 pr-2.5 py-2 rounded-xl text-xs font-black border transition-all flex items-center justify-between gap-1.5 shadow-2xs hover:shadow-xs group focus:outline-none"
                      :class="[
                        getNinjaSelectClass(getSlotNinja(daySched.day, shift.shiftId)),
                        isSlotDropdownOpen(daySched.day, shift.shiftId) ? 'ring-2 ring-[#FF5C1A]/40 border-[#FF5C1A]' : ''
                      ]"
                    >
                      <div class="flex items-center gap-1.5 min-w-0 truncate">
                        <span class="text-sm shrink-0">🛵</span>
                        <span class="truncate">{{ getSlotNinja(daySched.day, shift.shiftId) || 'Unassigned' }}</span>
                        <span
                          v-if="getNinjaPhone(getSlotNinja(daySched.day, shift.shiftId))"
                          class="text-[10px] opacity-75 font-mono truncate hidden sm:inline"
                        >
                          ({{ getNinjaPhone(getSlotNinja(daySched.day, shift.shiftId)) }})
                        </span>
                      </div>
                      <ChevronDown
                        class="w-3.5 h-3.5 shrink-0 transition-transform duration-200 opacity-60 group-hover:opacity-100"
                        :class="{ 'rotate-180': isSlotDropdownOpen(daySched.day, shift.shiftId) }"
                      />
                    </button>

                    <!-- Custom Slot Dropdown Menu -->
                    <div
                      v-if="isSlotDropdownOpen(daySched.day, shift.shiftId)"
                      class="absolute left-0 z-50 w-full min-w-[240px] max-w-[280px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-1.5 space-y-1 animate-scale-in"
                      :class="daySched.dayIndex >= 5 ? 'bottom-full mb-1.5' : 'top-full mt-1.5'"
                    >
                      <div class="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-400">
                        <span>Assign Errand Ninja</span>
                        <span class="font-normal lowercase text-gray-400">{{ shift.name }}</span>
                      </div>

                      <div class="max-h-56 overflow-y-auto space-y-0.5 py-0.5">
                        <button
                          v-for="ninja in settings.ninjas"
                          :key="ninja.id"
                          type="button"
                          @click="selectSlotNinja(daySched.day, shift.shiftId, ninja.name)"
                          class="w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left transition-all"
                          :class="getSlotNinja(daySched.day, shift.shiftId).toLowerCase() === ninja.name.toLowerCase()
                            ? 'bg-orange-50 font-black text-[#FF5C1A]'
                            : 'hover:bg-gray-50 text-gray-800 font-bold'"
                        >
                          <div class="flex items-center gap-2 min-w-0">
                            <div
                              class="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold"
                              :class="getNinjaAvatarClass(ninja.name)"
                            >
                              🛵
                            </div>
                            <div class="min-w-0">
                              <p class="text-xs truncate flex items-center gap-1.5">
                                <span>{{ ninja.name }}</span>
                                <span v-if="!ninja.isActive" class="text-[9px] px-1 rounded bg-gray-200 text-gray-500 font-normal">Inactive</span>
                              </p>
                              <p v-if="ninja.phone" class="text-[10px] font-mono text-gray-400 truncate">
                                {{ ninja.phone }}
                              </p>
                              <p v-else class="text-[10px] text-amber-500 font-normal">
                                No WhatsApp phone set
                              </p>
                            </div>
                          </div>

                          <Check
                            v-if="getSlotNinja(daySched.day, shift.shiftId).toLowerCase() === ninja.name.toLowerCase()"
                            class="w-4 h-4 text-[#FF5C1A] shrink-0"
                          />
                        </button>
                      </div>
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
            <div class="relative custom-dropdown-container">
              <button
                type="button"
                @click.stop="toggleUserLinkDropdown(ninja.id)"
                class="w-full px-2.5 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-gray-800 flex items-center justify-between gap-1.5 transition-colors focus:outline-none focus:border-[#FF5C1A] text-left"
                :class="{ 'border-[#FF5C1A] ring-2 ring-[#FF5C1A]/20': activeUserDropdownNinjaId === ninja.id }"
              >
                <div class="flex items-center gap-1.5 min-w-0 truncate">
                  <span class="truncate font-semibold" :class="ninja.userId ? 'text-gray-900 font-bold' : 'text-gray-500'">
                    {{ getLinkedUserLabel(ninja.userId) }}
                  </span>
                </div>
                <ChevronDown
                  class="w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200"
                  :class="{ 'rotate-180': activeUserDropdownNinjaId === ninja.id }"
                />
              </button>

              <div
                v-if="activeUserDropdownNinjaId === ninja.id"
                class="absolute left-0 z-50 mt-1.5 w-full min-w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 space-y-2 animate-scale-in"
              >
                <!-- Search Input -->
                <div class="relative">
                  <Search class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    v-model="userSearchQuery"
                    type="text"
                    placeholder="Search erranders by name or phone..."
                    class="w-full pl-8 pr-2.5 py-1.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5C1A] text-gray-800"
                    @click.stop
                  />
                </div>

                <!-- Options List -->
                <div class="max-h-48 overflow-y-auto space-y-0.5">
                  <!-- Unlinked Option -->
                  <button
                    type="button"
                    @click="selectLinkedUser(ninja, '')"
                    class="w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left text-xs transition-colors"
                    :class="!ninja.userId ? 'bg-orange-50 text-[#FF5C1A] font-bold' : 'hover:bg-gray-50 text-gray-600'"
                  >
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold">✕</span>
                      <span>Unlinked (WhatsApp Direct Only)</span>
                    </div>
                    <Check v-if="!ninja.userId" class="w-3.5 h-3.5 text-[#FF5C1A] shrink-0" />
                  </button>

                  <!-- Matching Users -->
                  <button
                    v-for="user in filteredErranderUsers"
                    :key="user._id"
                    type="button"
                    @click="selectLinkedUser(ninja, user._id)"
                    class="w-full flex items-center justify-between gap-2 p-2 rounded-xl text-left text-xs transition-colors"
                    :class="ninja.userId === user._id ? 'bg-orange-50 text-[#FF5C1A] font-bold' : 'hover:bg-gray-50 text-gray-800'"
                  >
                    <div class="min-w-0">
                      <p class="font-bold truncate">{{ user.firstName }} {{ user.lastName }}</p>
                      <p class="text-[10px] font-mono text-gray-400 truncate">{{ user.phone || user.email }}</p>
                    </div>
                    <Check v-if="ninja.userId === user._id" class="w-3.5 h-3.5 text-[#FF5C1A] shrink-0" />
                  </button>

                  <div v-if="filteredErranderUsers.length === 0" class="p-3 text-center text-xs text-gray-400">
                    No erranders found matching "{{ userSearchQuery }}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- 4. OPERATIONS MANAGER NOTIFICATION (KIM)                       -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-2xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            👩‍💼
          </div>
          <div>
            <h3 class="text-sm font-black text-gray-900 flex items-center gap-2">
              Operations Manager Alert (Kim)
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">Always Notified</span>
            </h3>
            <p class="text-xs text-gray-500">
              Kim receives instant WhatsApp bot notifications for all incoming orders regardless of which ninja is currently on duty.
            </p>
          </div>
        </div>

        <button
          @click="sendManagerTestAlert"
          :disabled="testingManagerAlert"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors shrink-0"
        >
          <Send class="w-3.5 h-3.5" :class="{ 'animate-pulse': testingManagerAlert }" />
          <span>{{ testingManagerAlert ? 'Testing...' : 'Test Manager WhatsApp' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Manager Name</label>
          <input
            v-model="settings.manager.name"
            type="text"
            placeholder="Kim"
            class="w-full px-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-[#FF5C1A]"
          />
        </div>

        <div>
          <label class="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">WhatsApp Phone Number</label>
          <div class="relative">
            <Phone class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="settings.manager.phone"
              type="text"
              placeholder="+2348052854256"
              class="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 font-mono text-gray-900 focus:outline-none focus:border-[#FF5C1A]"
            />
          </div>
        </div>

        <div class="flex items-center pt-5">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="settings.manager.enabled" class="sr-only peer" />
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
            <span class="ml-2.5 text-xs font-bold text-gray-700">Manager Bot Alerts Active</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
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
  Check,
  Search,
  X,
} from 'lucide-vue-next';
import { admin_api } from '@/api_factory/modules/admin';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';

const { showToast } = useToast();

const loading = ref(true);
const saving = ref(false);
const testingAlert = ref(false);
const testingManagerAlert = ref(false);

// Custom Dropdown Open States
const activeSlotDropdown = ref<string | null>(null);
const showOffHoursDropdown = ref(false);
const activeUserDropdownNinjaId = ref<string | null>(null);
const userSearchQuery = ref('');

const settings = ref<any>({
  enabled: true,
  timezone: 'Africa/Lagos',
  offHoursFallback: 'all',
  directWhatsAppEnabled: true,
  manager: {
    name: 'Kim',
    phone: '+2348052854256',
    enabled: true,
  },
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

// Slot Helpers
const getSlotNinja = (day: string, shiftId: string) => {
  const daySched = settings.value.schedule?.find((s: any) => s.day.toLowerCase() === day.toLowerCase());
  const slot = daySched?.slots?.find((sl: any) => sl.shiftId === shiftId);
  return slot?.ninjaName || '';
};

const getNinjaPhone = (name: string) => {
  if (!name || !settings.value.ninjas) return '';
  const ninja = settings.value.ninjas.find((n: any) => n.name.toLowerCase() === name.toLowerCase());
  return ninja?.phone || '';
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

// Timetable Slot Custom Dropdown Handlers
const toggleSlotDropdown = (day: string, shiftId: string) => {
  const key = `${day}_${shiftId}`;
  activeSlotDropdown.value = activeSlotDropdown.value === key ? null : key;
  showOffHoursDropdown.value = false;
  activeUserDropdownNinjaId.value = null;
};

const isSlotDropdownOpen = (day: string, shiftId: string) => {
  return activeSlotDropdown.value === `${day}_${shiftId}`;
};

const selectSlotNinja = (day: string, shiftId: string, ninjaName: string) => {
  setSlotNinja(day, shiftId, ninjaName);
  activeSlotDropdown.value = null;
};

// Off-Hours Fallback Custom Dropdown Handlers
const toggleOffHoursDropdown = () => {
  showOffHoursDropdown.value = !showOffHoursDropdown.value;
  activeSlotDropdown.value = null;
  activeUserDropdownNinjaId.value = null;
};

const setOffHoursFallback = (mode: 'all' | 'none') => {
  settings.value.offHoursFallback = mode;
  showOffHoursDropdown.value = false;
};

// User Account Linking Custom Dropdown Handlers
const toggleUserLinkDropdown = (ninjaId: string) => {
  if (activeUserDropdownNinjaId.value === ninjaId) {
    activeUserDropdownNinjaId.value = null;
  } else {
    activeUserDropdownNinjaId.value = ninjaId;
    userSearchQuery.value = '';
    activeSlotDropdown.value = null;
    showOffHoursDropdown.value = false;
  }
};

const getLinkedUserLabel = (userId: string) => {
  if (!userId) return 'Unlinked (WhatsApp Direct Only)';
  const user = erranderUsers.value.find((u: any) => u._id === userId);
  if (!user) return 'Linked Account';
  return `${user.firstName} ${user.lastName} (${user.phone || user.email})`;
};

const selectLinkedUser = (ninja: any, userId: string) => {
  ninja.userId = userId;
  const user = erranderUsers.value.find((u: any) => u._id === userId);
  if (user) {
    if (!ninja.phone && user.phone) ninja.phone = user.phone;
    if (user.email) ninja.userEmail = user.email;
  }
  activeUserDropdownNinjaId.value = null;
};

const filteredErranderUsers = computed(() => {
  if (!userSearchQuery.value.trim()) return erranderUsers.value;
  const q = userSearchQuery.value.toLowerCase();
  return erranderUsers.value.filter((u: any) => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    return fullName.includes(q) || phone.includes(q) || email.includes(q);
  });
});

// Click-Outside Listener to Close Custom Dropdowns
const handleDocumentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.custom-dropdown-container')) {
    activeSlotDropdown.value = null;
    showOffHoursDropdown.value = false;
    activeUserDropdownNinjaId.value = null;
  }
};

// Load Schedule & Duty Status
const loadData = async () => {
  loading.value = true;
  try {
    const [shiftsRes, usersRes] = await Promise.all([
      admin_api.getNinjaShifts(),
      admin_api.getUsers().catch(() => ({ data: [] })),
    ]);

    if (shiftsRes.data?.settings) {
      settings.value = {
        ...shiftsRes.data.settings,
        manager: shiftsRes.data.settings.manager || {
          name: 'Kim',
          phone: '+2348052854256',
          enabled: true,
        },
      };
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
    case 'ruth':
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
    case 'ruth':
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

// Send Test WhatsApp Alert to Manager Kim
const sendManagerTestAlert = async () => {
  if (!settings.value.manager?.phone) {
    showToast({
      title: 'Phone Required',
      message: 'Please enter Kim\'s WhatsApp phone number first',
      toastType: 'warning',
    } as any);
    return;
  }

  testingManagerAlert.value = true;
  try {
    const res = await admin_api.testNinjaShiftAlert({
      phone: settings.value.manager.phone,
      ninjaName: `${settings.value.manager.name || 'Kim'} (Operations Manager)`,
      target: 'manager',
    });

    if (res.data?.success) {
      showToast({
        title: 'Manager Alert Sent',
        message: res.data.message || `Test message sent to ${settings.value.manager.name}!`,
        toastType: 'success',
      } as any);
    } else {
      showToast({
        title: 'Alert Warning',
        message: res.data?.message || 'Could not send test WhatsApp alert to manager',
        toastType: 'warning',
      } as any);
    }
  } catch (e: any) {
    showToast({
      title: 'Error',
      message: e.response?.data?.message || 'Failed to trigger test alert to manager',
      toastType: 'error',
    } as any);
  } finally {
    testingManagerAlert.value = false;
  }
};

onMounted(() => {
  loadData();
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

