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
  <article class="p-4 bg-(--page-card-bg) border border-(--page-divider-soft)">
    <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <h3 class="text-xl font-semibold text-(--page-text)">
          {{ feature.name }}
        </h3>
        <code
          class="rounded-full border border-(--page-divider-soft) bg-(--page-code-bg) px-2.5 py-1 text-xs text-(--page-text-muted)"
        >
          {{ feature.id }}
        </code>
      </div>
      <p v-if="feature.description" class="max-w-4xl text-sm/6 text-(--page-text-soft)">
        {{ feature.description }}
      </p>
      <div v-if="feature.spec.length" class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <a
          v-for="url in feature.spec.slice(0, 3)"
          :key="url"
          :href="url"
          target="_blank"
          rel="noreferrer"
          class="text-(--page-link) hover:text-(--page-link-hover) hover:underline underline-offset-2 flex items-center"
        >
          <span>
            {{ formatSpecHostname(url) }}
          </span>
          <UIcon name="mingcute:arrow-right-up-line" class="size-4" />
        </a>
      </div>
    </div>
    <dl class="contents text-sm">
      <div class="">
        <dt
          class="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--color-olive-600)_72%,white)]"
        >
          Baseline low date
        </dt>
        <dd class="mt-2 font-semibold text-(--page-text)">
          {{ feature.baselineLowDate || 'Not available' }}
        </dd>
      </div>
      <div class="">
        <dt
          class="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--color-olive-600)_72%,white)]"
        >
          Available at
        </dt>
        <dd class="mt-2 font-semibold text-(--page-text)">
          <span class="inline-flex items-center gap-1.5">
            <UIcon
              v-if="showAvailableAtStatus"
              :name="isAvailable ? 'mingcute:check-circle-fill' : 'mingcute:time-line'"
              class="size-4"
              :class="isAvailable ? 'text-success' : 'text-warning'"
            />
            <span>{{ feature.availableAt || 'Not available' }}</span>
          </span>
        </dd>
      </div>
      <div class="">
        <dt
          class="text-xs uppercase tracking-wide text-[color-mix(in_srgb,var(--color-olive-600)_72%,white)]"
        >
          Support versions
        </dt>
        <dd
          class="mt-2 grid gap-4 text-(--page-text-soft) grid-cols-[repeat(var(--browser-count),minmax(0,1fr))]"
          :style="{ '--browser-count': CORE_BROWSERS.length }"
        >
          <span
            v-for="browser in CORE_BROWSERS"
            :key="browser"
            class="inline-flex flex-col items-center"
          >
            <UIcon :name="browserIcons[browser]" class="size-6" />
            <span class="mt-[0.25em]">
              {{ feature.support[browser] ?? '—' }}
            </span>
          </span>
        </dd>
      </div>
    </dl>
  </article>
</template>
