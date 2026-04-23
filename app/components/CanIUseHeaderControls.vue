<script setup lang="ts">
import {
  DEFAULT_ELIGIBILITY_MONTHS,
  sanitizeEligibilityMonths,
} from '@/composables/useCanIUseFeatures'

withDefaults(
  defineProps<{
    modelValue: number
    windowLabel?: string
  }>(),
  {
    windowLabel: 'Eligibility Window',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const colorMode = useColorMode()

function handleUpdate(value: number | null) {
  emit('update:modelValue', sanitizeEligibilityMonths(value))
}

const themeOptions = [
  { label: 'Auto', value: 'system', icon: 'i-lucide-monitor' },
  { label: 'Light', value: 'light', icon: 'i-lucide-sun-medium' },
  { label: 'Dark', value: 'dark', icon: 'i-lucide-moon-star' },
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
  <div class="grid w-full gap-3 sm:grid-cols-2 lg:w-full">
    <UFormField :label="windowLabel" :ui="{ label: 'text-[var(--page-text-muted)]' }">
      <UInputNumber
        :model-value="modelValue"
        :min="1"
        :max="120"
        :step="1"
        :default-value="DEFAULT_ELIGIBILITY_MONTHS"
        size="sm"
        class="w-full"
        :ui="{ base: 'h-9 min-h-9 tabular-nums' }"
        @update:model-value="handleUpdate"
      />
    </UFormField>

    <UFormField label="Color Scheme" :ui="{ label: 'text-[var(--page-text-muted)]' }">
      <ClientOnly>
        <UDropdownMenu
          :items="themeMenuItems"
          :content="{ align: 'end' }"
          :ui="{ content: 'min-w-36' }"
        >
          <UButton
            :label="selectedTheme.label"
            :icon="selectedTheme.icon"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="outline"
            size="sm"
            class="h-9 min-h-9 w-full justify-between"
          />
        </UDropdownMenu>

        <template #fallback>
          <UButton
            label="Auto"
            icon="i-lucide-monitor"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="outline"
            size="sm"
            class="h-9 min-h-9 w-full justify-between"
            disabled
          />
        </template>
      </ClientOnly>
    </UFormField>
  </div>
</template>
