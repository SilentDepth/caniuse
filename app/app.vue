<script setup lang="ts">
const {
  activeGroups,
  activeTab,
  allFeatures,
  eligibilityMonths,
  errorMessage,
  fullDatasetErrorMessage,
  fullDatasetStatus,
  isFullDatasetReady,
  selectedTab,
  status,
  tabItems,
} = useFeatures()

const {
  activateSearch,
  debouncedSearchKeyword,
  handleSearchEscape,
  isSearchMode,
  searchKeyword,
  searchResults,
  searchTarget: tabNav,
  selectTab,
} = useSearch(allFeatures, selectedTab, isFullDatasetReady)

const searchPlaceholder = computed(() => {
  if (isFullDatasetReady.value) return 'Search features'
  if (fullDatasetStatus.value === 'error') return 'Search unavailable'
  return 'Loading search data...'
})

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
    <div class="relative min-h-dvh font-sans">
      <AppHeader v-model="eligibilityMonths" :disabled="!isFullDatasetReady" />
      <main class="relative pb-12">
        <AppNav
          ref="tabNav"
          v-model:search-value="searchKeyword"
          :model-value="selectedTab"
          :search-disabled="!isFullDatasetReady"
          :search-placeholder="searchPlaceholder"
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
        <template v-else>
          <section
            v-if="fullDatasetErrorMessage"
            class="mx-auto mt-4 max-w-6xl px-4 sm:px-6 lg:px-8"
          >
            <div class="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
              Full dataset failed to load. Search, upcoming features, and safety window changes are
              unavailable.
            </div>
          </section>
          <LazySearchResults
            v-if="isSearchMode"
            :query="debouncedSearchKeyword"
            :results="searchResults"
          />
          <FeatureGroups v-else :groups="activeGroups" :tab="activeTab" />
        </template>
      </main>
    </div>
  </UApp>
</template>
