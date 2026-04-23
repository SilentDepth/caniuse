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
  <article class="feature-card grid gap-4 rounded-2xl border lg:grid-cols-[2fr_1fr]">
    <div class="feature-card-body p-4 space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="feature-badge rounded-full px-2.5 py-1 text-xs font-medium"
          :class="tab.id === 'recent' ? 'feature-badge--recent' : 'feature-badge--upcoming'"
        >
          {{ tab.label }}
        </span>
        <h3 class="feature-title text-xl font-semibold">
          {{ feature.name }}
        </h3>
        <code class="feature-code rounded-full border px-2.5 py-1 text-xs">
          {{ feature.id }}
        </code>
      </div>

      <p v-if="feature.description" class="feature-description max-w-4xl text-sm leading-6">
        {{ feature.description }}
      </p>

      <div v-if="feature.spec.length" class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a
          v-for="url in feature.spec.slice(0, 3)"
          :key="url"
          :href="url"
          target="_blank"
          rel="noreferrer"
          class="feature-link hover:underline"
        >
          {{ formatSpecHostname(url) }}
        </a>
      </div>
    </div>
    <dl
      class="feature-card-meta text-sm flex flex-col border-l border-l-[rgb(119_138_98_/_0.14)] divide-y divide-[rgb(119_138_98_/_0.14)]"
    >
      <div class="p-4">
        <dt class="feature-label text-xs uppercase tracking-[0.18em]">Baseline low date</dt>
        <dd class="feature-date mt-2 font-semibold">
          {{ feature.baselineLowDate }}
        </dd>
      </div>
      <div class="p-4">
        <dt class="feature-label text-xs uppercase tracking-[0.18em]">Available at</dt>
        <dd class="feature-date mt-2 font-semibold">
          {{ feature.availableAt }}
        </dd>
      </div>
      <div class="p-4">
        <dt class="feature-label text-xs uppercase tracking-[0.18em]">Support versions</dt>
        <dd
          class="feature-support mt-3 grid gap-4"
          :style="{ gridTemplateColumns: `repeat(${CORE_BROWSERS.length}, 1fr)` }"
        >
          <span
            v-for="browser in CORE_BROWSERS"
            :key="browser"
            class="inline-flex items-center gap-[0.5em]"
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
