<script setup lang="ts">
import {
  DEFAULT_ELIGIBILITY_MONTHS,
  sanitizeEligibilityMonths,
} from '@/composables/useCanIUseFeatures'

const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const colorMode = useColorMode()

function handleUpdate(value: number | null) {
  emit('update:modelValue', sanitizeEligibilityMonths(value))
}

const themeOptions = [
  { label: 'Auto', value: 'system', icon: 'i-mingcute-computer-line' },
  { label: 'Light', value: 'light', icon: 'i-mingcute-sun-line' },
  { label: 'Dark', value: 'dark', icon: 'i-mingcute-moon-stars-line' },
] as const

const selectedTheme = computed(
  () => themeOptions.find(option => option.value === colorMode.preference) ?? themeOptions[0],
)

const themeMenuItems = computed(() =>
  themeOptions.map(option => ({
    label: option.label,
    icon: option.icon,
    color: colorMode.preference === option.value ? ('primary' as const) : ('neutral' as const),
    onSelect: () => {
      colorMode.preference = option.value
    },
  })),
)
</script>

<template>
  <header
    class="border-b border-(--page-divider) bg-(--page-header-bg) px-4 py-4 backdrop-blur-lg sm:px-6 sm:py-5 lg:px-8"
  >
    <div class="mx-auto max-w-6xl space-y-3">
      <div class="flex items-start justify-between gap-4">
        <h1
          class="max-w-[26ch] text-2xl font-light capitalize tracking-tight text-(--page-text) text-balance sm:text-3xl"
        >
          Can I use this yet?
        </h1>
        <ClientOnly>
          <UDropdownMenu
            :items="themeMenuItems"
            :content="{ align: 'end' }"
            :ui="{ content: 'min-w-36' }"
          >
            <UButton
              :icon="selectedTheme.icon"
              :aria-label="`Color scheme: ${selectedTheme.label}`"
              color="neutral"
              variant="ghost"
              size="md"
            />
          </UDropdownMenu>

          <template #fallback>
            <UButton
              icon="i-mingcute-computer-line"
              aria-label="Color scheme: Auto"
              color="neutral"
              variant="ghost"
              size="sm"
              class="shrink-0"
              disabled
            />
          </template>
        </ClientOnly>
      </div>
      <div
        class="flex flex-col gap-2 text-pretty text-base/7 text-(--page-text-muted) sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-2 sm:text-sm/6"
      >
        <span class="inline-flex items-center gap-2">
          <span>Eligible after</span>
          <UInputNumber
            name="eligibility-months"
            :model-value="props.modelValue"
            :min="1"
            :max="120"
            :step="1"
            :default-value="DEFAULT_ELIGIBILITY_MONTHS"
            size="sm"
            class="w-24 shrink-0"
            :ui="{ base: 'tabular-nums max-sm:text-base' }"
            aria-label="Safety window in months"
            @update:model-value="handleUpdate"
          />
          <span class="font-medium text-(--page-text)">months</span>
        </span>
        <span>of full support across Chrome, Edge, Firefox, and Safari.</span>
      </div>
    </div>
  </header>
</template>
