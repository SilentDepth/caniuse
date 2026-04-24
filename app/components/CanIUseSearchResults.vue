<script setup lang="ts">
import type { FeatureRecord } from '@/composables/useCanIUseFeatures'

defineProps<{
  query: string
  results: FeatureRecord[]
}>()
</script>

<template>
  <section class="mt-6 px-3 sm:mt-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <p
        v-if="!query"
        class="rounded-xl border border-dashed border-(--page-divider) bg-(--page-empty-bg) px-5 py-10 text-base/7 text-(--page-text-muted) sm:px-6 sm:py-12 sm:text-sm/6"
      >
        Search by feature id, name, or description.
      </p>
      <div
        v-else-if="results.length"
        class="space-y-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:gap-x-4 lg:space-y-0"
      >
        <CanIUseFeatureCard
          v-for="feature in results"
          :key="feature.id"
          :feature="feature"
          show-available-at-status
          class="lg:col-span-full lg:grid lg:grid-cols-subgrid lg:[&+&]:-mt-px"
        />
      </div>
      <p
        v-else
        class="rounded-xl border border-dashed border-(--page-divider) bg-(--page-empty-bg) px-5 py-10 text-base/7 text-(--page-text-muted) sm:px-6 sm:py-12 sm:text-sm/6"
      >
        No matching features found for "{{ query }}".
      </p>
    </div>
  </section>
</template>
