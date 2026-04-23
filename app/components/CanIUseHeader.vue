<script setup lang="ts">
import {
  DEFAULT_ELIGIBILITY_MONTHS,
  sanitizeEligibilityMonths,
} from '@/composables/useCanIUseFeatures'

const colorMode = useColorMode()

defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

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
  <header class="page-header border-b">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
      <div class="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-4">
        <div class="space-y-2">
          <h1 class="page-heading text-2xl font-light tracking-tight sm:text-3xl">
            Newly Eligible Web Features
          </h1>
          <p class="page-subtitle max-w-3xl text-sm leading-6">
            Web-platform capabilities whose baseline low date makes them newly eligible in a
            {{ modelValue }}-month rollout window.
          </p>
        </div>

        <div class="grid w-full gap-3 sm:grid-cols-2 lg:w-full">
          <UFormField label="Eligibility Window" class="header-field">
            <UInputNumber
              :model-value="modelValue"
              :min="1"
              :max="120"
              :step="1"
              :default-value="DEFAULT_ELIGIBILITY_MONTHS"
              size="sm"
              class="w-full"
              :ui="{ base: 'header-input tabular-nums' }"
              @update:model-value="handleUpdate"
            />
          </UFormField>

          <UFormField label="Color Scheme" class="header-field">
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
                  class="header-input w-full justify-between"
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
                  class="header-input w-full justify-between"
                  disabled
                />
              </template>
            </ClientOnly>
          </UFormField>
        </div>
      </div>
    </div>
  </header>
</template>
