<template>
  <div class="container mx-auto space-y-6 pb-20">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900 font-heading">Group orders</h1>
        <p class="text-sm font-medium text-gray-500">
          One payment, several people, sometimes several stores.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50" @click="load">
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div v-for="card in stats" :key="card.label" class="rounded-[1.25rem] border border-gray-100 bg-white p-4">
        <div class="mb-3 flex items-center justify-between">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl" :class="card.tint">
            <component :is="card.icon" class="h-4 w-4" />
          </div>
        </div>
        <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ card.label }}</p>
        <h3 class="mt-0.5 text-xl font-black tracking-tight text-gray-900">{{ card.value }}</h3>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          placeholder="Search by group, host or invite code…"
          class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none focus:border-[#FF5C1A]"
        />
      </div>
      <div class="flex gap-2 overflow-x-auto">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          class="shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition"
          :class="statusFilter === tab.value ? 'border-[#FF5C1A] bg-orange-50 text-[#FF5C1A]' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
          <span class="ml-1 text-[10px] text-gray-400">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-400">
      Loading groups…
    </div>

    <div v-else-if="!filtered.length" class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center">
      <p class="text-sm font-bold text-gray-900">No group orders yet</p>
      <p class="mx-auto mt-1 max-w-sm text-xs text-gray-500">
        When students start a shared cart it will appear here with everyone in it and the store orders it produced.
      </p>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <table class="w-full text-left">
        <thead class="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <tr>
            <th class="px-4 py-3">Group</th>
            <th class="px-4 py-3">Host</th>
            <th class="px-4 py-3">People</th>
            <th class="px-4 py-3">Split</th>
            <th class="px-4 py-3">Total</th>
            <th class="px-4 py-3">Stores</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <template v-for="g in filtered" :key="g.id">
            <tr class="hover:bg-gray-50/60">
              <td class="px-4 py-3">
                <p class="text-sm font-bold text-gray-900">{{ g.name || 'Untitled group' }}</p>
                <p class="font-mono text-[11px] text-gray-400">{{ g.inviteCode }}</p>
              </td>
              <td class="px-4 py-3 text-xs text-gray-600">{{ g.host }}</td>
              <td class="px-4 py-3 text-xs text-gray-600">
                {{ g.participants.length }}
                <span class="text-[10px] text-gray-400">
                  ({{ g.participants.filter((p) => p.isReady).length }} ready)
                </span>
              </td>
              <td class="px-4 py-3 text-xs capitalize text-gray-600">{{ (g.splitType || '—').replace('_', ' ') }}</td>
              <td class="px-4 py-3 text-sm font-black text-gray-900">₦{{ Number(g.groupTotal).toLocaleString() }}</td>
              <td class="px-4 py-3 text-xs font-semibold text-gray-700">{{ g.orders.length }}</td>
              <td class="px-4 py-3">
                <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="statusClass(g.status)">{{ g.status }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <button class="rounded-lg px-2 py-1 text-[11px] font-bold text-gray-500 hover:bg-gray-100" @click="toggle(g.id)">
                  {{ expanded === g.id ? 'Hide' : 'Details' }}
                </button>
              </td>
            </tr>

            <tr v-if="expanded === g.id">
              <td colspan="8" class="bg-gray-50/70 px-4 py-4">
                <div class="grid gap-4 lg:grid-cols-2">
                  <!-- Who was in it -->
                  <div class="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <p class="border-b border-gray-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Participants</p>
                    <table class="w-full text-left text-xs">
                      <tbody class="divide-y divide-gray-50">
                        <tr v-for="(p, i) in g.participants" :key="i">
                          <td class="px-3 py-2">
                            <p class="font-semibold text-gray-800">{{ p.name }}</p>
                            <p class="text-[10px] text-gray-400">{{ p.email || 'guest' }}</p>
                          </td>
                          <td class="px-3 py-2 text-gray-500">{{ p.items }} items</td>
                          <td class="px-3 py-2 font-bold text-gray-800">₦{{ Number(p.total).toLocaleString() }}</td>
                          <td class="px-3 py-2">
                            <span v-if="p.isReady" class="text-[10px] font-bold text-emerald-600">ready</span>
                            <span v-else class="text-[10px] text-gray-400">adding</span>
                          </td>
                        </tr>
                        <tr v-if="!g.participants.length">
                          <td colspan="4" class="px-3 py-4 text-center text-gray-400">Nobody joined yet.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- What it became -->
                  <div class="overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <p class="border-b border-gray-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Store orders</p>
                    <table class="w-full text-left text-xs">
                      <tbody class="divide-y divide-gray-50">
                        <tr v-for="o in g.orders" :key="o.orderNumber">
                          <td class="px-3 py-2 font-mono text-[11px] text-gray-600">{{ o.orderNumber }}</td>
                          <td class="px-3 py-2 font-semibold text-gray-800">{{ o.store }}</td>
                          <td class="px-3 py-2 font-bold text-gray-900">₦{{ Number(o.total).toLocaleString() }}</td>
                          <td class="px-3 py-2">
                            <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="statusClass(o.status)">{{ o.status }}</span>
                          </td>
                        </tr>
                        <tr v-if="!g.orders.length">
                          <td colspan="4" class="px-3 py-4 text-center text-gray-400">
                            No orders yet — the group has not checked out.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Users, ShoppingBag, CheckCircle, Wallet, Search } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';

const { showToast } = useToast();
const groups = ref<any[]>([]);
const loading = ref(true);
const expanded = ref<string | null>(null);
const search = ref('');
const statusFilter = ref('all');

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase();
  return groups.value.filter((g) => {
    if (statusFilter.value !== 'all' && String(g.status).toLowerCase() !== statusFilter.value) return false;
    if (!term) return true;
    return [g.name, g.host, g.inviteCode].filter(Boolean).some((v: string) => String(v).toLowerCase().includes(term));
  });
});

const statusTabs = computed(() => [
  { value: 'all', label: 'All', count: groups.value.length },
  ...['open', 'locked', 'completed', 'cancelled'].map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
    count: groups.value.filter((g) => String(g.status).toLowerCase() === s).length,
  })),
]);

const stats = computed(() => {
  const totalValue = groups.value.reduce((sum, g) => sum + (Number(g.groupTotal) || 0), 0);
  return [
    { label: 'Groups', value: groups.value.length, icon: Users, tint: 'bg-blue-50 text-blue-600' },
    { label: 'Open now', value: groups.value.filter((g) => String(g.status).toLowerCase() === 'open').length, icon: ShoppingBag, tint: 'bg-amber-50 text-amber-600' },
    { label: 'Completed', value: groups.value.filter((g) => String(g.status).toLowerCase() === 'completed').length, icon: CheckCircle, tint: 'bg-emerald-50 text-emerald-600' },
    { label: 'Value', value: '₦' + totalValue.toLocaleString(), icon: Wallet, tint: 'bg-orange-50 text-[#FF5C1A]' },
  ];
});

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/group-orders');
    groups.value = res.data?.groups || [];
  } catch {
    showToast({ title: 'Error', message: 'Could not load group orders', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

const toggle = (id: string) => {
  expanded.value = expanded.value === id ? null : id;
};

const statusClass = (status: string) => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed') return 'bg-emerald-50 text-emerald-700';
  if (s === 'cancelled') return 'bg-rose-50 text-rose-700';
  if (s === 'locked') return 'bg-amber-50 text-amber-700';
  return 'bg-gray-100 text-gray-600';
};

onMounted(load);
</script>
