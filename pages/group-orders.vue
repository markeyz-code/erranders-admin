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
          @click="statusFilter = tab.value; page = 1"
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
                <div class="relative inline-block text-left">
                  <button
                    class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    @click.stop="openMenu = openMenu === g.id ? null : g.id"
                  >
                    <MoreHorizontal class="h-4 w-4" />
                  </button>

                  <div
                    v-if="openMenu === g.id"
                    class="absolute right-0 z-30 mt-1 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-xl"
                    @click.stop
                  >
                    <button class="menu-item" @click="openGroup(g); openMenu = null">
                      <Eye class="h-3.5 w-3.5" /> view details
                    </button>
                    <button class="menu-item" @click="copyInvite(g); openMenu = null">
                      <LinkIcon class="h-3.5 w-3.5" /> copy invite link
                    </button>
                    <button v-if="g.hostPhone" class="menu-item" @click="openGroup(g); openMenu = null">
                      <MessageCircle class="h-3.5 w-3.5" /> message host
                    </button>

                    <div class="my-1 border-t border-gray-50" />

                    <button v-if="g.status !== 'locked'" class="menu-item" @click="setStatus(g, 'locked')">
                      <Lock class="h-3.5 w-3.5" /> lock group
                    </button>
                    <button v-if="g.status === 'locked'" class="menu-item" @click="setStatus(g, 'open')">
                      <LockOpen class="h-3.5 w-3.5" /> unlock group
                    </button>
                    <button v-if="g.status !== 'cancelled'" class="menu-item" @click="setStatus(g, 'cancelled')">
                      <Ban class="h-3.5 w-3.5" /> cancel group
                    </button>

                    <template v-if="!g.orders.length">
                      <div class="my-1 border-t border-gray-50" />
                      <button class="menu-item text-rose-600" @click="removeGroup(g)">
                        <Trash2 class="h-3.5 w-3.5" /> delete group
                      </button>
                    </template>
                  </div>
                </div>
              </td>
            </tr>

          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="total > limit" class="flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-gray-100 bg-white px-4 py-3">
      <p class="text-xs text-gray-500">
        Showing
        <span class="font-bold text-gray-800">{{ (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }}</span>
        of <span class="font-bold text-gray-800">{{ total }}</span> groups
      </p>
      <div class="flex items-center gap-1">
        <button
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 disabled:opacity-40"
          :disabled="page === 1"
          @click="goToPage(page - 1)"
        >
          Previous
        </button>
        <span class="px-2 text-xs font-bold text-gray-700">{{ page }} / {{ totalPages }}</span>
        <button
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-bold text-gray-600 disabled:opacity-40"
          :disabled="page >= totalPages"
          @click="goToPage(page + 1)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Delete confirmation -->
    <Teleport to="body">
      <div v-if="pendingDelete" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px]" @click="pendingDelete = null" />
        <div class="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
          <h3 class="text-base font-black tracking-tight text-gray-900">Delete this group?</h3>
          <p class="mt-1 text-xs text-gray-500">
            <span class="font-bold text-gray-700">{{ pendingDelete.name || 'Untitled group' }}</span>
            ({{ pendingDelete.inviteCode }}) will be removed for everyone in it. This cannot be undone.
          </p>
          <div class="mt-4 flex justify-end gap-2">
            <button class="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50" @click="pendingDelete = null">
              Keep it
            </button>
            <button class="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700" @click="confirmDelete">
              Delete group
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  text-align: left;
  transition: background-color 0.12s ease;
}
.menu-item:hover {
  background-color: #f9fafb;
}
</style>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Users, ShoppingBag, CheckCircle, Wallet, Search, X, MessageCircle, MoreHorizontal, Eye, Link as LinkIcon, Lock, LockOpen, Ban, Trash2 } from 'lucide-vue-next';
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
  { value: 'all', label: 'All', count: summary.value.total || 0 },
  ...['open', 'locked', 'completed', 'cancelled'].map((s) => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1),
    count: summary.value[s] || 0,
  })),
]);

const stats = computed(() => [
  { label: 'Groups', value: summary.value.total || 0, icon: Users, tint: 'bg-blue-50 text-blue-600' },
  { label: 'Open now', value: summary.value.open || 0, icon: ShoppingBag, tint: 'bg-amber-50 text-amber-600' },
  { label: 'Completed', value: summary.value.completed || 0, icon: CheckCircle, tint: 'bg-emerald-50 text-emerald-600' },
  { label: 'Value', value: '₦' + Number(summary.value.value || 0).toLocaleString(), icon: Wallet, tint: 'bg-orange-50 text-[#FF5C1A]' },
]);

const page = ref(1);
const limit = ref(20);
const total = ref(0);
const summary = ref<any>({ total: 0, open: 0, locked: 0, completed: 0, cancelled: 0, value: 0 });
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/group-orders', { params: { page: page.value, limit: limit.value } });
    groups.value = res.data?.groups || [];
    total.value = Number(res.data?.total) || 0;
    summary.value = res.data?.summary || summary.value;
  } catch {
    showToast({ title: 'Error', message: 'Could not load group orders', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

const goToPage = async (next: number) => {
  const target = Math.min(Math.max(1, next), totalPages.value);
  if (target === page.value) return;
  page.value = target;
  await load();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

const openMenu = ref<string | null>(null);

const copyInvite = async (g: any) => {
  const link = `${window.location.origin.replace('admin.', 'www.')}/group/${g.inviteCode}`;
  try {
    await navigator.clipboard.writeText(link);
    showToast({ title: 'Copied', message: 'Invite link copied to clipboard', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Invite code', message: g.inviteCode, toastType: 'info' } as any);
  }
  openMenu.value = null;
};

const setStatus = async (g: any, status: 'open' | 'locked' | 'cancelled') => {
  openMenu.value = null;
  try {
    await api.patch(`/admin/group-orders/${g.id}/status`, { status });
    showToast({ title: 'Updated', message: `Group is now ${status}`, toastType: 'success' } as any);
    await load();
  } catch (e: any) {
    showToast({
      title: 'Could not update',
      message: e?.response?.data?.message || 'Try again',
      toastType: 'error',
    } as any);
  }
};

const pendingDelete = ref<any>(null);

const removeGroup = async (g: any) => {
  openMenu.value = null;
  pendingDelete.value = g;
};

const confirmDelete = async () => {
  const g = pendingDelete.value;
  if (!g) return;
  pendingDelete.value = null;
  try {
    await api.delete(`/admin/group-orders/${g.id}`);
    showToast({ title: 'Deleted', message: 'Group removed', toastType: 'success' } as any);
    await load();
  } catch (e: any) {
    showToast({
      title: 'Could not delete',
      message: e?.response?.data?.message || 'This group cannot be deleted',
      toastType: 'error',
    } as any);
  }
};

const closeMenu = () => { openMenu.value = null; };
onMounted(() => {
  load();
  window.addEventListener('click', closeMenu);
  onUnmounted(() => window.removeEventListener('click', closeMenu));
});
</script>
