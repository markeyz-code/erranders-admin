<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Trigger Box -->
    <div 
      class="w-full min-h-[38px] rounded-xl border border-gray-200 bg-gray-50/70 p-1.5 flex flex-wrap gap-1.5 items-center transition-all cursor-pointer hover:border-gray-300 focus-within:border-[#FF5C1A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#FF5C1A]/20"
      :class="[
        isOpen ? 'border-[#FF5C1A] bg-white ring-2 ring-[#FF5C1A]/20' : '',
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      ]"
      @click="toggleOpen"
    >
      <!-- Selected Item Badges -->
      <div 
        v-for="item in selectedItems" 
        :key="item.value" 
        class="inline-flex items-center gap-1 bg-white border border-gray-200/80 text-gray-800 px-2 py-0.5 rounded-lg text-xs font-semibold shadow-2xs group"
      >
        <span v-if="item.emoji" class="text-xs shrink-0">{{ item.emoji }}</span>
        <span class="truncate max-w-[140px] text-[11px]">{{ item.label }}</span>
        <button 
          v-if="!disabled"
          type="button" 
          @click.stop="removeItem(item.value)" 
          class="p-0.5 text-gray-400 hover:text-rose-600 rounded-md transition-colors"
          title="Remove"
        >
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Placeholder or Search Hint -->
      <div v-if="selectedItems.length === 0" class="px-2 py-1 text-xs text-gray-400 font-medium select-none">
        {{ placeholder }}
      </div>

      <div class="ml-auto flex items-center gap-1.5 pr-1 shrink-0">
        <span 
          v-if="selectedItems.length > 0 && !disabled"
          role="button"
          tabindex="0"
          @click.stop="clearAll"
          class="text-[10px] font-bold text-gray-400 hover:text-rose-600 px-1 py-0.5 rounded transition-colors"
          title="Clear all selections"
        >
          Clear
        </span>
        <ChevronDown 
          class="h-3.5 w-3.5 text-gray-400 transition-transform duration-200" 
          :class="{ 'rotate-180': isOpen }" 
        />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen" 
      class="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
    >
      <!-- Search and Header Controls -->
      <div class="border-b border-gray-100 p-2 space-y-1.5 bg-gray-50/50">
        <div class="relative">
          <Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input 
            ref="searchInputRef"
            type="text" 
            v-model="searchQuery" 
            :placeholder="searchPlaceholder" 
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#FF5C1A] focus:outline-none"
            @keydown.esc="close"
          />
        </div>

        <div class="flex items-center justify-between px-1 text-[11px] text-gray-500">
          <span>{{ selectedItems.length }} selected</span>
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              @click.stop="selectAll"
              class="font-bold text-[#FF5C1A] hover:underline"
            >
              Select All
            </button>
            <span class="text-gray-300">•</span>
            <button 
              type="button" 
              @click.stop="clearAll"
              class="font-bold text-gray-500 hover:text-rose-600 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Options List -->
      <ul class="max-h-60 overflow-y-auto py-1 divide-y divide-gray-50" role="listbox">
        <li v-if="filteredOptions.length === 0" class="px-3 py-6 text-center text-xs text-gray-400">
          No matches found for "{{ searchQuery }}"
        </li>

        <li 
          v-for="option in filteredOptions" 
          :key="option.value"
          @click="toggleItem(option.value)"
          class="flex items-center justify-between gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
          :class="isSelected(option.value) ? 'bg-orange-50/40 text-gray-900' : 'text-gray-700'"
        >
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <input 
              type="checkbox" 
              :checked="isSelected(option.value)" 
              class="w-3.5 h-3.5 accent-[#FF5C1A] rounded border-gray-300 pointer-events-none shrink-0"
            />
            <span v-if="option.emoji" class="shrink-0 text-sm">{{ option.emoji }}</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold truncate leading-tight">{{ option.label }}</p>
              <p v-if="option.sublabel" class="text-[10px] text-gray-400 truncate mt-0.5">{{ option.sublabel }}</p>
            </div>
          </div>
          <Check v-if="isSelected(option.value)" class="w-3.5 h-3.5 text-[#FF5C1A] shrink-0" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Search, X, Check, ChevronDown } from 'lucide-vue-next'

export interface MultiSelectOption {
  label: string
  value: string
  sublabel?: string
  emoji?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string[]
    options: MultiSelectOption[]
    placeholder?: string
    searchPlaceholder?: string
    disabled?: boolean
  }>(),
  {
    placeholder: 'Select options...',
    searchPlaceholder: 'Search options...',
    disabled: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [string[]]
  change: [string[]]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const selectedItems = computed(() => {
  const current = props.modelValue || []
  return props.options.filter(opt => current.includes(opt.value))
})

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return props.options
  const query = searchQuery.value.trim().toLowerCase()
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(query) || 
    (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
    opt.value.toLowerCase().includes(query)
  )
})

const isSelected = (val: string) => {
  return (props.modelValue || []).includes(val)
}

const toggleOpen = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    await nextTick()
    searchInputRef.value?.focus()
  }
}

const close = () => {
  isOpen.value = false
}

const toggleItem = (val: string) => {
  const current = [...(props.modelValue || [])]
  const idx = current.indexOf(val)
  if (idx === -1) {
    current.push(val)
  } else {
    current.splice(idx, 1)
  }
  emit('update:modelValue', current)
  emit('change', current)
}

const removeItem = (val: string) => {
  const current = (props.modelValue || []).filter(item => item !== val)
  emit('update:modelValue', current)
  emit('change', current)
}

const selectAll = () => {
  const allFilteredValues = filteredOptions.value.map(o => o.value)
  const merged = Array.from(new Set([...(props.modelValue || []), ...allFilteredValues]))
  emit('update:modelValue', merged)
  emit('change', merged)
}

const clearAll = () => {
  emit('update:modelValue', [])
  emit('change', [])
}

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
