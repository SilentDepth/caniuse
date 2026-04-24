<script setup lang="ts">
import type { FeatureRecord } from '@/composables/useCanIUseFeatures'

defineProps<{
  query: string
  results: FeatureRecord[]
}>()
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 mt-8">
    <div class="max-w-6xl mx-auto">
      <p
        v-if="!query"
        class="rounded-2xl border border-dashed border-(--page-divider) bg-(--page-empty-bg) px-6 py-12 text-sm text-(--page-text-muted)"
      >
        Search by feature id, name, or description.
      </p>
      <div
        v-else-if="results.length"
        class="grid gap-x-4"
        style="grid-template-columns: 1fr auto auto auto"
      >
        <CanIUseFeatureCard
          v-for="feature in results"
          :key="feature.id"
          :feature="feature"
          show-available-at-status
          class="col-span-full grid grid-cols-subgrid [&+&]:-mt-px"
        />
      </div>
      <p
        v-else
        class="rounded-2xl border border-dashed border-(--page-divider) bg-(--page-empty-bg) px-6 py-12 text-sm text-(--page-text-muted)"
      >
        No matching features found for "{{ query }}".
      </p>
    </div>
  </section>
</template>
