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
    class="grid gap-4 rounded-2xl border border-[var(--page-divider-soft)] bg-[var(--page-card-bg)] shadow-[var(--page-shadow)] hover:border-[var(--page-card-hover-border)] lg:grid-cols-[2fr_1fr]"
  >
    <div class="space-y-4 bg-[var(--page-card-body-bg)] p-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-full border border-transparent px-2.5 py-1 text-xs font-medium"
          :class="
            tab.id === 'recent'
              ? 'border-[var(--page-badge-recent-border)] bg-[var(--page-badge-recent-bg)] text-[var(--page-badge-recent-text)]'
              : 'border-[var(--page-badge-upcoming-border)] bg-[var(--page-badge-upcoming-bg)] text-[var(--page-badge-upcoming-text)]'
          "
        >
          {{ tab.label }}
        </span>
        <h3 class="text-xl font-semibold text-[var(--page-text)]">
          {{ feature.name }}
        </h3>
        <code
          class="rounded-full border border-[var(--page-divider-soft)] bg-[var(--page-code-bg)] px-2.5 py-1 text-xs text-[var(--page-text-muted)]"
        >
          {{ feature.id }}
        </code>
      </div>

      <p v-if="feature.description" class="max-w-4xl text-sm/6 text-[var(--page-text-soft)]">
        {{ feature.description }}
      </p>

      <div v-if="feature.spec.length" class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a
          v-for="url in feature.spec.slice(0, 3)"
          :key="url"
          :href="url"
          target="_blank"
          rel="noreferrer"
          class="text-[var(--page-link)] hover:text-[var(--page-link-hover)] hover:underline"
        >
          {{ formatSpecHostname(url) }}
        </a>
      </div>
    </div>
    <dl
      class="flex flex-col border-l border-[var(--page-divider-soft)] bg-[var(--page-card-meta-bg)] text-sm"
    >
      <div class="border-b border-[var(--page-divider-soft)] p-4 last:border-b-0">
        <dt
          class="text-xs uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-olive-600)_72%,white)]"
        >
          Baseline low date
        </dt>
        <dd class="mt-2 font-semibold text-[var(--page-text)]">
          {{ feature.baselineLowDate }}
        </dd>
      </div>
      <div class="border-b border-[var(--page-divider-soft)] p-4 last:border-b-0">
        <dt
          class="text-xs uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-olive-600)_72%,white)]"
        >
          Available at
        </dt>
        <dd class="mt-2 font-semibold text-[var(--page-text)]">
          {{ feature.availableAt }}
        </dd>
      </div>
      <div class="p-4">
        <dt
          class="text-xs uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--color-olive-600)_72%,white)]"
        >
          Support versions
        </dt>
        <dd
          class="mt-3 grid gap-4 text-[var(--page-text-soft)] [grid-template-columns:repeat(var(--browser-count),minmax(0,1fr))]"
          :style="{ '--browser-count': CORE_BROWSERS.length }"
        >
          <span
            v-for="browser in CORE_BROWSERS"
            :key="browser"
            class="inline-flex items-center gap-2"
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
