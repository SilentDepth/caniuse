<script setup lang="ts">
import type { FeatureGroup, FeatureTab } from '@/composables/useCanIUseFeatures'

defineProps<{
  groups: FeatureGroup[]
  tab: FeatureTab
}>()
</script>

<template>
  <section class="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
    <div v-if="groups.length" class="space-y-8">
      <section v-for="group in groups" :key="group.monthKey" class="space-y-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold text-[var(--page-text)] text-balance">
            {{ group.monthLabel }}
          </h2>
          <span
            class="rounded-full border border-[var(--page-divider)] bg-[var(--page-count-bg)] px-2.5 py-1 text-xs text-[var(--page-text-muted)]"
          >
            {{ group.items.length }}
            {{ group.items.length === 1 ? 'feature' : 'features' }}
          </span>
        </div>

        <CanIUseFeatureCard
          v-for="feature in group.items"
          :key="feature.id"
          :feature="feature"
          :tab="tab"
        />
      </section>
    </div>

    <div
      v-else
      class="rounded-2xl border border-dashed border-[var(--page-divider)] bg-[var(--page-empty-bg)] px-6 py-12 text-sm text-[var(--page-text-muted)]"
    >
      {{ tab.emptyText }}
    </div>
  </section>
</template>
