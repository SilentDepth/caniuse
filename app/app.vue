<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
})

const {
  activeGroups,
  activeTab,
  allFeatures,
  eligibilityMonths,
  errorMessage,
  selectedTab,
  status,
  tabItems,
} = await useCanIUseFeatures()

const {
  activateSearch,
  debouncedSearchKeyword,
  handleSearchEscape,
  isSearchMode,
  searchKeyword,
  searchResults,
  searchTarget: tabNav,
  selectTab,
} = useCanIUseFeatureSearch(allFeatures, selectedTab)

const title = 'Can I use this yet?'
const description =
  'Check when features are safe to adopt after full support across Chrome, Edge, Firefox, and Safari.'
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <UApp>
    <div class="min-h-dvh relative">
      <CanIUseHeader v-model="eligibilityMonths" />
      <main class="relative pb-12">
        <CanIUseTabNav
          ref="tabNav"
          v-model:search-value="searchKeyword"
          :model-value="selectedTab"
          :search-active="isSearchMode"
          :items="tabItems"
          @update:model-value="selectTab"
          @search-focus="activateSearch"
          @search-escape="handleSearchEscape"
        />
        <section
          v-if="status === 'pending'"
          class="mx-auto mt-8 max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8"
        >
          <div
            v-for="index in 6"
            :key="index"
            class="h-40 animate-pulse rounded-2xl border border-(--page-divider) bg-(--page-empty-bg)"
          />
        </section>
        <section v-else-if="errorMessage" class="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div class="rounded-2xl border border-error/30 bg-(--page-error-bg) p-5 text-sm">
            <p class="font-semibold text-error">Failed to load dataset.</p>
            <pre class="mt-3 whitespace-pre-wrap break-all font-mono text-xs text-error">{{
              errorMessage
            }}</pre>
          </div>
        </section>
        <LazyCanIUseSearchResults
          v-else-if="isSearchMode"
          :query="debouncedSearchKeyword"
          :results="searchResults"
        />
        <CanIUseFeatureGroups v-else :groups="activeGroups" :tab="activeTab" />
      </main>
    </div>
  </UApp>
</template>
