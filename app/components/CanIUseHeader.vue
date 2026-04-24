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
  { label: 'Auto', value: 'system', icon: 'mingcute:computer-line' },
  { label: 'Light', value: 'light', icon: 'mingcute:sun-line' },
  { label: 'Dark', value: 'dark', icon: 'mingcute:moon-stars-line' },
] as const

const selectedTheme = computed(
  () => themeOptions.find(option => option.value === colorMode.preference) ?? themeOptions[0],
)

const themeMenuItems = computed(() =>
  themeOptions.map(option => ({
    label: option.label,
    icon: option.icon,
    color: colorMode.preference === option.value ? 'primary' : 'neutral',
    onSelect: () => {
      colorMode.preference = option.value
    },
  })),
)
</script>

<template>
  <header
    class="p-4 sm:px-6 lg:px-8 border-b border-(--page-divider) bg-(--page-header-bg) backdrop-blur-lg"
  >
    <div class="max-w-6xl mx-auto flex justify-end">
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
            size="sm"
          />
        </UDropdownMenu>

        <template #fallback>
          <UButton
            icon="mingcute:computer-line"
            aria-label="Color scheme: Auto"
            color="neutral"
            variant="ghost"
            size="sm"
            disabled
          />
        </template>
      </ClientOnly>
    </div>
    <div class="max-w-6xl mx-auto space-y-2">
      <h1
        class="max-w-[26ch] text-2xl font-light capitalize tracking-tight text-(--page-text) text-balance sm:text-3xl"
      >
        Can I use this yet?
      </h1>
      <div
        class="flex flex-wrap items-center gap-x-2 gap-y-2 text-pretty text-base/7 text-(--page-text-muted) sm:text-sm/6"
      >
        <span>Features become eligible after</span>
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
        <span>of full support across Chrome, Edge, Firefox, and Safari.</span>
      </div>
    </div>
  </header>
</template>
