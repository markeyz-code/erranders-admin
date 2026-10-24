<template>
  <div ref="containerRef" class="relative w-full">
    <!-- Trigger: reads like the input it replaces, but opens a searchable list. -->
    <button
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3 py-2 text-left text-xs font-semibold text-gray-800 transition-all hover:border-gray-300 focus:border-[#FF5C1A] focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
      :class="{ 'border-[#FF5C1A]/60 bg-orange-50/20 text-[#FF5C1A]': modelValue && modelValue !== '' }"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="truncate" :class="{ 'text-gray-900 font-bold': modelValue && modelValue !== '' }">{{ selectedLabel }}</span>
      <div class="flex items-center gap-1 shrink-0">
        <span
          v-if="modelValue && modelValue !== ''"
          role="button"
          tabindex="0"
          @click.stop="pick('')"
          class="p-0.5 hover:bg-gray-200/80 rounded-full text-gray-400 hover:text-rose-600 transition-colors"
          title="Clear filter"
        >
          <X class="w-3 h-3" />
        </span>
        <ChevronDown class="h-3.5 w-3.5 text-gray-400 transition-transform" :class="{ 'rotate-180': isOpen }" />
      </div>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full min-w-[16rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
    >
      <!-- Search, because these lists run to dozens of names. -->
      <div class="border-b border-gray-100 p-2">
        <div class="relative">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            ref="searchEl"
            v-model="query"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#FF5C1A] focus:bg-white focus:outline-none"
            @keydown.esc="close"
            @keydown.enter.prevent="selectFirst"
          />
        </div>
      </div>

      <ul class="max-h-64 overflow-y-auto py-1" role="listbox">
        <li v-if="showAllOption">
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-semibold text-gray-600 hover:bg-gray-50"
            :class="{ 'bg-orange-50 text-[#FF5C1A]': modelValue === '' }"
            @click="pick('')"
          >
            {{ allLabel }}
          </button>
        </li>

        <li v-if="filtered.length === 0" class="px-3 py-6 text-center text-xs text-gray-400">
          No match for “{{ query }}”
        </li>

        <li v-for="option in filtered" :key="option.value">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs hover:bg-gray-50"
            :class="{ 'bg-orange-50 font-bold text-[#FF5C1A]': option.value === modelValue }"
            @click="pick(option.value)"
          >
            <span class="truncate">{{ option.label }}</span>
            <Check v-if="option.value === modelValue" class="h-3.5 w-3.5 shrink-0" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Check, ChevronDown, Search, X } from 'lucide-vue-next';

/**
 * A single-select dropdown with a search box.
 *
 * These filters carry dozens of vendor, rider and student names, and a native <select>
 * makes finding one a scroll-and-squint exercise. This shows the same label in the trigger
 * but lets the list be typed into.
 */
const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: { value: string; label: string }[];
    allLabel?: string;
    showAllOption?: boolean;
    searchPlaceholder?: string;
    placeholder?: string;
  }>(),
  {
    allLabel: 'All',
    showAllOption: true,
    searchPlaceholder: 'Search…',
    placeholder: 'Select…',
  },
);

const emit = defineEmits<{ 'update:modelValue': [string]; change: [string] }>();

const containerRef = ref<HTMLElement | null>(null);
const searchEl = ref<HTMLInputElement | null>(null);
const isOpen = ref(false);
const query = ref('');

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label || props.allLabel,
);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    query.value = '';
    await nextTick();
    searchEl.value?.focus();
  }
};

const close = () => {
  isOpen.value = false;
};

const pick = (value: string) => {
  emit('update:modelValue', value);
  emit('change', value);
  close();
};

/** Enter picks the only remaining match, so typing plus Enter is enough. */
const selectFirst = () => {
  if (filtered.value.length === 1) pick(filtered.value[0].value);
};

const onClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) close();
};

onMounted(() => document.addEventListener('click', onClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside));

watch(isOpen, (open) => { if (!open) query.value = ''; });
</script>
