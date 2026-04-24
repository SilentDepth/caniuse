<script setup lang="ts">
import {
  CORE_BROWSERS,
  type CoreBrowser,
  type FeatureRecord,
} from '@/composables/useCanIUseFeatures'

const props = defineProps<{
  feature: FeatureRecord
  showAvailableAtStatus?: boolean
}>()

const browserIcons: Record<CoreBrowser, string> = {
  chrome: 'logos:chrome',
  edge: 'logos:microsoft-edge',
  firefox: 'logos:firefox',
  safari: 'logos:safari',
}

const isAvailable = computed(() => {
  if (!props.feature.availableAt) return false

  const availableAtTime = new Date(`${props.feature.availableAt}T00:00:00.000Z`).getTime()
  return Number.isFinite(availableAtTime) && availableAtTime <= Date.now()
})
</script>

<template>
  <article
    class="rounded-xl border border-(--page-divider-soft) bg-(--page-card-bg) p-4 lg:rounded-none"
  >
    <div class="min-w-0 space-y-4 lg:pr-3">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="min-w-0 text-xl font-semibold tracking-tight wrap-break-word text-(--page-text) text-balance">
          {{ feature.name }}
        </h3>
        <code
          class="inline-flex max-w-full rounded-full border border-(--page-divider-soft) bg-(--page-code-bg) px-2.5 py-1 font-mono text-[0.8125rem] break-all text-(--page-text-muted) sm:text-xs"
        >
          {{ feature.id }}
        </code>
      </div>
      <p
        v-if="feature.description"
        class="max-w-4xl text-base/7 text-pretty text-(--page-text-soft) sm:text-sm/6"
      >
        {{ feature.description }}
      </p>
      <div
        v-if="feature.spec.length"
        class="flex flex-wrap gap-x-4 gap-y-2 text-base/7 sm:text-sm/6"
      >
        <a
          v-for="url in feature.spec.slice(0, 3)"
          :key="url"
          :href="url"
          target="_blank"
          rel="noreferrer"
          class="flex min-w-0 items-center text-(--page-link) underline-offset-1 hover:text-(--page-link-hover) hover:underline"
        >
          <span class="truncate">
            {{ formatSpecHostname(url) }}
          </span>
          <UIcon name="mingcute:arrow-right-up-line" class="flex-none size-4" />
        </a>
      </div>
    </div>
    <dl
      class="mt-5 grid gap-4 border-t border-(--page-divider-soft) pt-4 text-base/7 sm:text-sm/6 lg:contents"
    >
      <div>
        <dt>
          Baseline low date
        </dt>
        <dd class="mt-1 font-semibold text-(--page-text) sm:mt-2">
          {{ feature.baselineLowDate || 'Not available' }}
        </dd>
      </div>
      <div>
        <dt>
          Available at
        </dt>
        <dd class="mt-1 font-semibold text-(--page-text) sm:mt-2">
          <span class="inline-flex items-center gap-1.5">
            <UIcon
              v-if="showAvailableAtStatus"
              :name="isAvailable ? 'mingcute:check-circle-fill' : 'mingcute:time-line'"
              class="size-5 sm:size-4"
              :class="isAvailable ? 'text-success' : 'text-warning'"
            />
            <span>{{ feature.availableAt || 'Not available' }}</span>
          </span>
        </dd>
      </div>
      <div>
        <dt>
          Support versions
        </dt>
        <dd
          class="mt-2 grid grid-cols-[repeat(var(--browser-count),minmax(0,1fr))] gap-3 text-(--page-text-soft) sm:gap-4"
          :style="{ '--browser-count': CORE_BROWSERS.length }"
        >
          <span
            v-for="browser in CORE_BROWSERS"
            :key="browser"
            class="inline-flex flex-col items-center"
          >
            <UIcon :name="browserIcons[browser]" class="size-7 sm:size-6" />
            <span class="mt-[0.25em] tabular-nums">
              {{ feature.support[browser] ?? '—' }}
            </span>
          </span>
        </dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
@reference 'tailwindcss';

dt {
  @apply font-medium text-[color-mix(in_srgb,var(--color-olive-600)_72%,white)] uppercase tracking-wide;
  @apply text-[0.8125rem] sm:text-xs;
}
</style>
