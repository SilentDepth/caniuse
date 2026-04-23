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
  <header
    class="border-b border-[var(--page-divider)] bg-[var(--page-header-bg)] [backdrop-filter:blur(18px)] [-webkit-backdrop-filter:blur(18px)]"
  >
    <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <div class="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-end lg:gap-4">
        <div class="space-y-2">
          <h1
            class="max-w-[26ch] text-2xl font-light tracking-tight text-[var(--page-text)] text-balance sm:text-3xl"
          >
            When Web Features Become Safe to Count On
          </h1>
          <p class="max-w-[56ch] text-pretty text-sm/6 text-[var(--page-text-muted)]">
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
