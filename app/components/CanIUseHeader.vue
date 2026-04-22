<script setup lang="ts">
import {
  DEFAULT_ELIGIBILITY_MONTHS,
  sanitizeEligibilityMonths,
} from '@/composables/useCanIUseFeatures'

defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function handleUpdate(value: number | null) {
  emit('update:modelValue', sanitizeEligibilityMonths(value))
}
</script>

<template>
  <header class="border-b border-muted bg-default/90 backdrop-blur">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="space-y-2">
          <h1 class="text-2xl font-light tracking-tight text-highlighted sm:text-3xl">
            Newly Eligible Web Features
          </h1>
          <p class="max-w-3xl text-sm leading-6 text-muted">
            Web-platform capabilities whose baseline low date makes them newly eligible in a
            {{ modelValue }}-month rollout window.
          </p>
        </div>

        <UFormField
          label="Eligibility Window"
          :description="`Stored in the eligibility-months cookie for SSR.`"
          class="w-full max-w-xs shrink-0"
        >
          <UInputNumber
            :model-value="modelValue"
            :min="1"
            :max="120"
            :step="1"
            :default-value="DEFAULT_ELIGIBILITY_MONTHS"
            class="w-full"
            @update:model-value="handleUpdate"
          />
        </UFormField>
      </div>
    </div>
  </header>
</template>
