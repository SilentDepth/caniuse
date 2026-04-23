<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function handleControlsUpdate(value: number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <header class="page-header border-b">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
      <div class="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-4">
        <div class="space-y-2">
          <h1 class="page-heading max-w-[26ch] text-2xl font-light tracking-tight sm:text-3xl">
            When Web Features Become Safe to Count On
          </h1>
          <p class="page-subtitle max-w-[56ch] text-sm leading-6">
            This view tracks features that cross the full-support threshold after a
            {{ props.modelValue }}-month adoption window across Chrome, Edge, Firefox, and Safari.
          </p>
        </div>

        <CanIUseHeaderControls
          :model-value="props.modelValue"
          window-label="Lag (months)"
          @update:model-value="handleControlsUpdate"
        />
      </div>
    </div>
  </header>
</template>
