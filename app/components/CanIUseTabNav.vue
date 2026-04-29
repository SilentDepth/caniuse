<script setup lang="ts">
import type { FeatureTabId } from '#shared/utils/caniuse-features'

const props = defineProps<{
  items: Array<{
    disabled?: boolean
    id: FeatureTabId
    label: string
  }>
  modelValue: FeatureTabId
  searchActive: boolean
  searchDisabled?: boolean
  searchPlaceholder?: string
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
    class="sticky top-0 z-10 border-b border-(--page-divider-soft) bg-(--page-tabs-bg) px-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.45)] backdrop-blur-lg sm:px-6 lg:px-8 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.02)]"
  >
    <div class="mx-auto flex max-w-6xl flex-col gap-2 py-2 sm:flex-row sm:items-center sm:py-0">
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
          list: 'px-0 gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          indicator: searchActive ? 'hidden' : 'bottom-0 h-0.5',
          trigger:
            'shrink-0 px-0 py-2 text-base text-[var(--page-text-muted)] transition-colors sm:text-sm data-[state=active]:text-[var(--page-text)]',
        }"
        @update:model-value="value => emit('update:modelValue', value as FeatureTabId)"
      />
      <UInput
        ref="searchInput"
        v-model="searchModel"
        type="search"
        :placeholder="searchPlaceholder ?? 'Search features'"
        :disabled="searchDisabled"
        icon="i-mingcute-search-line"
        color="primary"
        variant="outline"
        :highlight="searchActive"
        class="w-full sm:w-72"
        :ui="{ base: 'text-base sm:text-sm' }"
        @focus="emit('search-focus')"
        @keydown.esc.stop.prevent="emit('search-escape')"
      />
    </div>
  </div>
</template>
