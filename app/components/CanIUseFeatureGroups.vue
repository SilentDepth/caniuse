<script setup lang="ts">
import type { FeatureGroup, FeatureTab } from '#shared/utils/caniuse-features'

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
  <section class="mt-6 px-3 sm:mt-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <div v-if="groups.length" class="space-y-8">
        <section
          v-for="group in groups"
          :key="group.monthKey"
          class="space-y-3 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] lg:gap-x-4 lg:space-y-0"
        >
          <div class="flex items-center gap-3 lg:col-span-full lg:mb-4">
            <h2 class="min-w-0 text-lg font-semibold text-(--page-text) text-balance">
              {{ getGroupHeading(group, tab) }}
            </h2>
            <span
              class="shrink-0 rounded-full border border-(--page-divider) bg-(--page-count-bg) px-2.5 py-1 text-[0.8125rem] text-(--page-text-muted) sm:text-xs"
            >
              {{ group.items.length }}
              {{ group.items.length === 1 ? 'feature' : 'features' }}
            </span>
          </div>
          <CanIUseFeatureCard
            v-for="feature in group.items"
            :key="feature.id"
            :feature="feature"
            class="lg:col-span-full lg:grid lg:grid-cols-subgrid lg:[&+&]:-mt-px"
          />
        </section>
      </div>
      <div
        v-else
        class="rounded-xl border border-dashed border-(--page-divider) bg-(--page-empty-bg) px-5 py-10 text-base/7 text-(--page-text-muted) sm:px-6 sm:py-12 sm:text-sm/6"
      >
        {{ tab.emptyText }}
      </div>
    </div>
  </section>
</template>
