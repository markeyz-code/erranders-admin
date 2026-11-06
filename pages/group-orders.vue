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
                <button class="rounded-lg px-2 py-1 text-[11px] font-bold text-gray-500 hover:bg-gray-100" @click="openGroup(g)">
                  Details
                </button>
              </td>
            </tr>

          </template>
        </tbody>
      </table>
    </div>

    <!-- Details drawer -->
    <Teleport to="body">
      <div v-if="selected" class="fixed inset-0 z-[100] flex justify-end">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" @click="selected = null" />

        <aside class="relative flex h-full w-full max-w-[560px] flex-col bg-white shadow-2xl">
          <!-- Header -->
          <header class="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="statusClass(selected.status)">
                  {{ selected.status }}
                </span>
                <span class="font-mono text-[11px] text-gray-400">{{ selected.inviteCode }}</span>
              </div>
              <h2 class="mt-1 truncate text-lg font-black tracking-tight text-gray-900">
                {{ selected.name || 'Untitled group' }}
              </h2>
              <p class="text-xs text-gray-500">
                {{ selected.participants.length }} people · {{ selected.orders.length }} store orders · created
                {{ new Date(selected.createdAt).toLocaleDateString() }}
              </p>
            </div>
            <button class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" @click="selected = null">
              <X class="h-5 w-5" />
            </button>
          </header>

          <div class="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <!-- Money -->
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Group total</p>
                <p class="mt-0.5 text-base font-black text-gray-900">₦{{ Number(selected.groupTotal).toLocaleString() }}</p>
              </div>
              <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Split</p>
                <p class="mt-0.5 text-base font-black capitalize text-gray-900">{{ (selected.splitType || '—').replace('_', ' ') }}</p>
              </div>
              <div class="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Orders</p>
                <p class="mt-0.5 text-base font-black text-gray-900">{{ selected.orders.length }}</p>
              </div>
            </div>

            <!-- Host -->
            <section>
              <h3 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">Host</h3>
              <div class="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ selected.host }}</p>
                  <p class="text-[11px] text-gray-500">{{ selected.hostEmail || 'no email' }}</p>
                </div>
                <a
                  v-if="selected.hostPhone"
                  :href="waLink(selected.hostPhone)"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  <MessageCircle class="h-3.5 w-3.5" /> {{ selected.hostPhone }}
                </a>
                <span v-else class="text-[11px] text-gray-400">no phone</span>
              </div>
            </section>

            <!-- Participants -->
            <section>
              <h3 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Participants ({{ selected.participants.length }})
              </h3>
              <div class="space-y-2">
                <div v-for="(p, i) in selected.participants" :key="i" class="rounded-xl border border-gray-100 p-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-900">{{ p.name }}</p>
                      <p class="truncate text-[11px] text-gray-500">{{ p.email || 'guest' }}</p>
                      <p v-if="p.phone" class="mt-0.5 font-mono text-[11px] text-gray-500">{{ p.phone }}</p>
                    </div>
                    <div class="flex shrink-0 flex-col items-end gap-1">
                      <p class="text-sm font-black text-gray-900">₦{{ Number(p.total).toLocaleString() }}</p>
                      <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="p.isReady ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'">
                        {{ p.isReady ? 'ready' : 'adding' }}
                      </span>
                    </div>
                  </div>

                  <a
                    v-if="p.phone"
                    :href="waLink(p.phone)"
                    target="_blank"
                    rel="noopener"
                    class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <MessageCircle class="h-3 w-3" /> message on whatsapp
                  </a>

                  <ul v-if="p.itemList?.length" class="mt-2 space-y-1 border-t border-gray-50 pt-2">
                    <li v-for="(it, j) in p.itemList" :key="j" class="flex items-center justify-between text-[11px]">
                      <span class="text-gray-600">
                        {{ it.quantity }}× {{ it.name }}
                        <span v-if="it.vendorName" class="text-gray-400">· {{ it.vendorName }}</span>
                      </span>
                      <span class="font-semibold text-gray-700">₦{{ Number(it.subtotal).toLocaleString() }}</span>
                    </li>
                  </ul>
                  <p v-else class="mt-2 border-t border-gray-50 pt-2 text-[11px] text-gray-400">No items added.</p>
                </div>
                <p v-if="!selected.participants.length" class="rounded-xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                  Nobody joined this group.
                </p>
              </div>
            </section>

            <!-- Store orders -->
            <section>
              <h3 class="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Store orders ({{ selected.orders.length }})
              </h3>
              <div class="space-y-2">
                <div v-for="o in selected.orders" :key="o.orderNumber" class="rounded-xl border border-gray-100 p-3">
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-bold text-gray-900">{{ o.store }}</p>
                      <p class="font-mono text-[11px] text-gray-500">{{ o.orderNumber }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-black text-gray-900">₦{{ Number(o.total).toLocaleString() }}</p>
                      <span class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" :class="statusClass(o.status)">{{ o.status }}</span>
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-50 pt-2 text-[11px] text-gray-500">
                    <span>delivery ₦{{ Number(o.deliveryFee || 0).toLocaleString() }}</span>
                    <span>service ₦{{ Number(o.serviceFee || 0).toLocaleString() }}</span>
                    <span :class="String(o.paymentStatus).toLowerCase() === 'paid' ? 'font-bold text-emerald-600' : 'font-bold text-amber-600'">
                      {{ o.paymentStatus }}
                    </span>
                  </div>
                </div>
                <p v-if="!selected.orders.length" class="rounded-xl border border-dashed border-amber-200 bg-amber-50/40 p-4 text-center text-xs text-amber-700">
                  No store orders — this group has not checked out.
                </p>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Users, ShoppingBag, CheckCircle, Wallet, Search, X, MessageCircle } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';

const { showToast } = useToast();
const groups = ref<any[]>([]);
const loading = ref(true);
const selected = ref<any>(null);
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

const openGroup = (group: any) => {
  selected.value = group;
};

// WhatsApp needs digits only, with the Nigerian leading 0 replaced by 234.
const waLink = (phone: string) => {
  const digits = String(phone || '').replace(/\D/g, '');
  const normalised = digits.startsWith('0') ? '234' + digits.slice(1) : digits;
  return `https://wa.me/${normalised}`;
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
