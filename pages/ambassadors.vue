<template>
  <div class="container mx-auto space-y-6 pb-20">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900 font-heading">Ambassadors</h1>
        <p class="text-sm font-medium text-gray-500">
          Who came in through each ambassador, what they ordered, and what they spent.
        </p>
      </div>
      <button class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50" @click="load">
        Refresh
      </button>
    </div>

    <!-- Totals across every ambassador -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-4">
        <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ card.label }}</p>
        <p class="mt-1 text-xl font-black text-gray-900">{{ card.value }}</p>
      </div>
    </div>

    <div v-if="loading" class="rounded-2xl border border-gray-100 bg-white p-10 text-center text-sm text-gray-400">
      Loading ambassadors…
    </div>

    <div v-else-if="!rows.length" class="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center">
      <p class="text-sm font-bold text-gray-900">No ambassadors yet</p>
      <p class="mx-auto mt-1 max-w-sm text-xs text-gray-500">
        Add a facilitator with a referral code and their sign-ups, orders and spend will appear here.
      </p>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <table class="w-full text-left">
        <thead class="bg-gray-50/80 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          <tr>
            <th class="px-4 py-3">Ambassador</th>
            <th class="px-4 py-3">Code</th>
            <th class="px-4 py-3">Referred</th>
            <th class="px-4 py-3">Active</th>
            <th class="px-4 py-3">Paid orders</th>
            <th class="px-4 py-3">Spend</th>
            <th class="px-4 py-3">Promo uses</th>
            <th class="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <template v-for="row in rows" :key="row.id">
            <tr class="hover:bg-gray-50/60">
              <td class="px-4 py-3">
                <p class="text-sm font-bold text-gray-900">{{ row.name }}</p>
                <p class="text-[11px] text-gray-400">{{ row.email || 'no email' }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="rounded-lg bg-orange-50 px-2 py-0.5 text-[11px] font-black text-[#FF5C1A]">{{ row.referralCode || '—' }}</span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-600">
                {{ row.totalReferrals }}
                <span class="text-[10px] text-gray-400">
                  ({{ row.referred.student }}s · {{ row.referred.vendor }}v · {{ row.referred.errander }}r)
                </span>
              </td>
              <td class="px-4 py-3 text-xs font-semibold" :class="row.activeReferrals ? 'text-emerald-600' : 'text-gray-400'">
                {{ row.activeReferrals }}
              </td>
              <td class="px-4 py-3 text-xs font-semibold text-gray-800">{{ row.ordersPlaced }}</td>
              <td class="px-4 py-3 text-sm font-black text-gray-900">₦{{ row.spend.toLocaleString() }}</td>
              <td class="px-4 py-3 text-xs text-gray-600">
                {{ row.promoRedemptions }}
                <span v-if="row.promoDiscountGiven" class="text-[10px] text-gray-400">· ₦{{ row.promoDiscountGiven.toLocaleString() }} off</span>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  class="rounded-lg px-2 py-1 text-[11px] font-bold text-gray-500 hover:bg-gray-100"
                  @click="openRow(row)"
                >
                  {{ expanded === row.id ? 'Hide' : 'Referred people' }}
                </button>
              </td>
            </tr>

            <tr v-if="expanded === row.id">
              <td colspan="8" class="bg-gray-50/70 px-4 py-3">
                <div v-if="!row.people.length" class="text-xs text-gray-400">Nobody has signed up with this code yet.</div>
                <div v-else class="overflow-hidden rounded-xl border border-gray-100 bg-white">
                  <table class="w-full text-left text-xs">
                    <thead class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      <tr>
                        <th class="px-3 py-2">Person</th>
                        <th class="px-3 py-2">Type</th>
                        <th class="px-3 py-2">Joined</th>
                        <th class="px-3 py-2">Orders</th>
                        <th class="px-3 py-2">Spent</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="person in row.people" :key="person.id">
                        <td class="px-3 py-2">
                          <p class="font-semibold text-gray-800">{{ person.name }}</p>
                          <p class="text-[10px] text-gray-400">{{ person.email }}</p>
                        </td>
                        <td class="px-3 py-2 capitalize text-gray-600">{{ person.role }}</td>
                        <td class="px-3 py-2 text-gray-500">{{ person.joinedAt ? new Date(person.joinedAt).toLocaleDateString() : '—' }}</td>
                        <td class="px-3 py-2 font-semibold">{{ person.orders }}</td>
                        <td class="px-3 py-2 font-bold" :class="person.spend ? 'text-emerald-600' : 'text-gray-400'">
                          ₦{{ person.spend.toLocaleString() }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast as useToast } from '@/composables/core/useCustomToast';

const { showToast } = useToast();

const rows = ref<any[]>([]);
const loading = ref(true);
const expanded = ref<string | null>(null);

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/ambassadors');
    rows.value = Array.isArray(res.data) ? res.data : [];
  } catch {
    showToast({ title: 'Error', message: 'Could not load ambassadors', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

const openRow = (row: any) => {
  expanded.value = expanded.value === row.id ? null : row.id;
};

const summaryCards = computed(() => {
  const totalReferred = rows.value.reduce((s, r) => s + (r.totalReferrals || 0), 0);
  const active = rows.value.reduce((s, r) => s + (r.activeReferrals || 0), 0);
  const spend = rows.value.reduce((s, r) => s + (r.spend || 0), 0);
  const orders = rows.value.reduce((s, r) => s + (r.ordersPlaced || 0), 0);
  return [
    { label: 'Ambassadors', value: rows.value.length },
    { label: 'Referred people', value: totalReferred },
    { label: 'Ordered at least once', value: active },
    { label: 'Spend driven', value: `₦${spend.toLocaleString()}` },
  ];
});

onMounted(load);
</script>
