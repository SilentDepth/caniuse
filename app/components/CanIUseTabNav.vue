<script setup lang="ts">
import type { FeatureTabId } from '@/composables/useCanIUseFeatures'

const props = defineProps<{
  items: Array<{
    id: FeatureTabId
    label: string
  }>
  modelValue: FeatureTabId
  searchActive: boolean
  searchValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FeatureTabId]
  'update:searchValue': [value: string]
  'search-focus': []
  'search-escape': []
}>()

const searchInput = ref<{ inputRef?: HTMLInputElement | null } | null>(null)

const searchModel = computed({
  get: () => props.searchValue,
  set: value => emit('update:searchValue', String(value ?? '')),
})

function blurSearch() {
  searchInput.value?.inputRef?.blur()
}

function focusSearch() {
  searchInput.value?.inputRef?.focus()
}

defineExpose({
  blurSearch,
  focusSearch,
})
</script>

<template>
  <div
    class="px-4 sm:px-6 lg:px-8 sticky top-0 z-10 border-b border-(--page-divider-soft) bg-(--page-tabs-bg) shadow-[inset_0_1px_0_rgb(255_255_255/0.45)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.02)] backdrop-blur-lg"
  >
    <div class="max-w-6xl mx-auto flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:py-0">
      <UTabs
        :model-value="searchActive ? undefined : modelValue"
        :items="items"
        value-key="id"
        :content="false"
        variant="link"
        color="primary"
        class="min-w-0 flex-1"
        :ui="{
          root: 'block',
          list: 'gap-4',
          indicator: searchActive ? 'hidden' : '',
          trigger:
            'px-0 py-2 text-sm text-[var(--page-text-muted)] transition-colors data-[state=active]:text-[var(--page-text)]',
        }"
        @update:model-value="value => emit('update:modelValue', value as FeatureTabId)"
      />
      <UInput
        ref="searchInput"
        v-model="searchModel"
        type="search"
        placeholder="Search features"
        icon="mingcute:search-line"
        color="primary"
        variant="outline"
        :highlight="searchActive"
        class="w-full sm:w-72"
        :ui="{ base: 'text-sm' }"
        @focus="emit('search-focus')"
        @keydown.esc.stop.prevent="emit('search-escape')"
      />
    </div>
  </div>
</template>
