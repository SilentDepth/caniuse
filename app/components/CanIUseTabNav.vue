<script setup lang="ts">
import type { FeatureTabId } from '@/composables/useCanIUseFeatures'

defineProps<{
  items: Array<{
    id: FeatureTabId
    label: string
  }>
  modelValue: FeatureTabId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FeatureTabId]
}>()
</script>

<template>
  <div
    class="sticky top-0 z-10 border-b border-(--page-divider-soft) bg-(--page-tabs-bg) shadow-[inset_0_1px_0_rgb(255_255_255/0.45)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.02)] backdrop-blur-lg"
  >
    <UTabs
      :model-value="modelValue"
      :items="items"
      value-key="id"
      :content="false"
      variant="link"
      color="primary"
      class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      :ui="{
        root: 'block',
        list: 'gap-3',
        trigger:
          'px-0 py-2 text-sm text-[var(--page-text-muted)] transition-colors data-[state=active]:text-[var(--page-text)]',
      }"
      @update:model-value="value => emit('update:modelValue', value as FeatureTabId)"
    />
  </div>
</template>
