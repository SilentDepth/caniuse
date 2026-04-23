<script setup lang="ts">
const title = 'Can I Use'

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
})

const { activeGroups, activeTab, eligibilityMonths, errorMessage, selectedTab, status, tabItems } =
  await useCanIUseFeatures()

const description = computed(
  () =>
    `Track web platform features that become eligible within the ${eligibilityMonths.value}-month window, grouped into recent and upcoming milestones.`,
)

useSeoMeta({
  title,
  description: () => description.value,
  ogTitle: title,
  ogDescription: () => description.value,
})
</script>

<template>
  <UApp>
    <div class="app-shell min-h-dvh antialiased">
      <CanIUseHeader v-model="eligibilityMonths" />

      <main class="pb-12">
        <CanIUseTabNav v-model="selectedTab" :items="tabItems" />

        <section
          v-if="status === 'pending'"
          class="mx-auto mt-8 max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8"
        >
          <div
            v-for="index in 6"
            :key="index"
            class="loading-card h-40 animate-pulse rounded-2xl border"
          />
        </section>

        <section v-else-if="errorMessage" class="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="error-panel rounded-2xl border border-error/30 p-5 text-sm">
            <p class="font-semibold text-error">Failed to load dataset.</p>
            <pre class="mt-3 whitespace-pre-wrap break-all font-mono text-xs text-error">{{
              errorMessage
            }}</pre>
          </div>
        </section>

        <CanIUseFeatureGroups v-else :groups="activeGroups" :tab="activeTab" />
      </main>
    </div>
  </UApp>
</template>
