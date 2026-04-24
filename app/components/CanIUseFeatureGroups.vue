<script setup lang="ts">
import type { FeatureGroup, FeatureTab } from '@/composables/useCanIUseFeatures'

defineProps<{
  groups: FeatureGroup[]
  tab: FeatureTab
}>()

function getGroupHeading(group: FeatureGroup, tab: FeatureTab) {
  return tab.id === 'upcoming'
    ? `Becomes eligible in ${group.monthLabel}`
    : `Became eligible in ${group.monthLabel}`
}
</script>

<template>
  <section class="px-4 sm:px-6 lg:px-8 mt-8">
    <div class="max-w-6xl mx-auto">
      <div v-if="groups.length" class="space-y-8">
        <section
          v-for="group in groups"
          :key="group.monthKey"
          class="grid gap-x-4"
          style="grid-template-columns: 1fr auto auto auto"
        >
          <div class="col-span-full mb-4 flex items-center gap-3">
            <h2 class="text-lg font-semibold text-(--page-text) text-balance">
              {{ getGroupHeading(group, tab) }}
            </h2>
            <span
              class="rounded-full border border-(--page-divider) bg-(--page-count-bg) px-2.5 py-1 text-xs text-(--page-text-muted)"
            >
              {{ group.items.length }}
              {{ group.items.length === 1 ? 'feature' : 'features' }}
            </span>
          </div>
          <CanIUseFeatureCard
            v-for="feature in group.items"
            :key="feature.id"
            :feature="feature"
            class="col-span-full grid grid-cols-subgrid [&+&]:-mt-px"
          />
        </section>
      </div>
      <div
        v-else
        class="rounded-2xl border border-dashed border-(--page-divider) bg-(--page-empty-bg) px-6 py-12 text-sm text-(--page-text-muted)"
      >
        {{ tab.emptyText }}
      </div>
    </div>
  </section>
</template>
