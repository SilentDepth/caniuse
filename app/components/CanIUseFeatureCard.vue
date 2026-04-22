<script setup lang="ts">
import {
  CORE_BROWSERS,
  type CoreBrowser,
  formatSpecHostname,
  type FeatureRecord,
  type FeatureTab,
} from '@/composables/useCanIUseFeatures'

const browserIcons: Record<CoreBrowser, string> = {
  chrome: 'logos:chrome',
  edge: 'logos:microsoft-edge',
  firefox: 'logos:firefox',
  safari: 'logos:safari',
}

defineProps<{
  feature: FeatureRecord
  tab: FeatureTab
}>()
</script>

<template>
  <article
    class="grid gap-4 rounded-2xl border border-muted bg-elevated shadow-xs lg:grid-cols-[2fr_1fr]"
  >
    <div class="p-4 space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-full px-2.5 py-1 text-xs font-medium"
          :class="tab.id === 'recent' ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'"
        >
          {{ tab.label }}
        </span>
        <h3 class="text-xl font-semibold text-highlighted">
          {{ feature.name }}
        </h3>
        <code class="rounded-full border border-muted bg-default px-2.5 py-1 text-xs text-toned">
          {{ feature.id }}
        </code>
      </div>

      <p v-if="feature.description" class="max-w-4xl text-sm leading-6 text-default">
        {{ feature.description }}
      </p>

      <div v-if="feature.spec.length" class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a
          v-for="url in feature.spec.slice(0, 3)"
          :key="url"
          :href="url"
          target="_blank"
          rel="noreferrer"
          class="text-primary hover:underline"
        >
          {{ formatSpecHostname(url) }}
        </a>
      </div>
    </div>
    <dl class="text-sm flex flex-col border-l border-muted divide-y divide-muted">
      <div class="p-4">
        <dt class="text-xs uppercase tracking-[0.18em] text-muted">Baseline low date</dt>
        <dd class="mt-2 font-semibold text-highlighted">
          {{ feature.baselineLowDate }}
        </dd>
      </div>
      <div class="p-4">
        <dt class="text-xs uppercase tracking-[0.18em] text-muted">Available at</dt>
        <dd class="mt-2 font-semibold text-highlighted">
          {{ feature.availableAt }}
        </dd>
      </div>
      <div class="p-4">
        <dt class="text-xs uppercase tracking-[0.18em] text-muted">Support versions</dt>
        <dd
          class="mt-3 grid gap-4"
          :style="{ gridTemplateColumns: `repeat(${CORE_BROWSERS.length}, 1fr)` }"
        >
          <span
            v-for="browser in CORE_BROWSERS"
            :key="browser"
            class="inline-flex items-center gap-[0.5em] text-default"
          >
            <UIcon :name="browserIcons[browser]" class="size-5 shrink-0" />
            <span>
              {{ feature.support[browser] ?? '—' }}
            </span>
          </span>
        </dd>
      </div>
    </dl>
  </article>
</template>
