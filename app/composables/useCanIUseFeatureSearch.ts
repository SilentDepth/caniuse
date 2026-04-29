import { debounce } from 'es-toolkit'
import { computed, nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'

import type { FeatureRecord, FeatureTabId } from '#shared/utils/caniuse-features'

const SEARCH_RESULT_LIMIT = 20

interface SearchTarget {
  blurSearch: () => void
  focusSearch: () => void
}

function getSearchRank(feature: FeatureRecord, keyword: string) {
  const normalizedKeyword = keyword.toLocaleLowerCase()
  const fields = [feature.id, feature.name, feature.description ?? '']

  return fields.findIndex(field => field.toLocaleLowerCase().includes(normalizedKeyword))
}

function compareAvailableAt(a: FeatureRecord, b: FeatureRecord) {
  if (!a.availableAt && !b.availableAt) return 0
  if (!a.availableAt) return 1
  if (!b.availableAt) return -1

  return a.availableAt.localeCompare(b.availableAt)
}

function isEditableTarget(target: EventTarget | null) {
  if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false

  return target.isContentEditable || target.matches('input, textarea, select, [role="textbox"]')
}

export function useCanIUseFeatureSearch(
  features: Ref<FeatureRecord[]>,
  selectedTab: Ref<FeatureTabId>,
  isEnabled: Ref<boolean>,
) {
  const isSearchMode = ref(false)
  const searchKeyword = ref('')
  const debouncedSearchKeyword = ref('')
  const searchTarget = ref<SearchTarget | null>(null)

  const updateDebouncedSearchKeyword = debounce((value: string) => {
    debouncedSearchKeyword.value = value
  }, 500)

  watch(searchKeyword, value => {
    if (!isEnabled.value) {
      updateDebouncedSearchKeyword.cancel()
      debouncedSearchKeyword.value = ''
      return
    }

    const normalizedValue = value.trim()

    if (!normalizedValue) {
      updateDebouncedSearchKeyword.cancel()
      debouncedSearchKeyword.value = ''
      return
    }

    updateDebouncedSearchKeyword(normalizedValue)
  })

  watch(isEnabled, enabled => {
    if (enabled) return

    updateDebouncedSearchKeyword.cancel()
    isSearchMode.value = false
    searchKeyword.value = ''
    debouncedSearchKeyword.value = ''
  })

  onBeforeUnmount(() => {
    updateDebouncedSearchKeyword.cancel()
  })

  const searchResults = computed(() => {
    const keyword = debouncedSearchKeyword.value
    if (!keyword) return []

    return features.value
      .map(feature => ({
        feature,
        rank: getSearchRank(feature, keyword),
      }))
      .filter(result => result.rank !== -1)
      .sort(
        (a, b) =>
          a.rank - b.rank ||
          compareAvailableAt(a.feature, b.feature) ||
          a.feature.name.localeCompare(b.feature.name) ||
          a.feature.id.localeCompare(b.feature.id),
      )
      .slice(0, SEARCH_RESULT_LIMIT)
      .map(result => result.feature)
  })

  function activateSearch() {
    if (!isEnabled.value) return

    isSearchMode.value = true
    void nextTick(() => {
      searchTarget.value?.focusSearch()
    })
  }

  function handleSearchEscape() {
    if (searchKeyword.value) {
      searchKeyword.value = ''
      return
    }

    isSearchMode.value = false
    searchTarget.value?.blurSearch()
  }

  function selectTab(value: FeatureTabId) {
    if (!isEnabled.value && value !== 'recent') return

    selectedTab.value = value
    isSearchMode.value = false
    searchKeyword.value = ''
  }

  onKeyStroke('f', (event: KeyboardEvent) => {
    if (!isEnabled.value || isSearchMode.value || isEditableTarget(event.target)) return

    event.preventDefault()
    activateSearch()
  })

  return {
    activateSearch,
    debouncedSearchKeyword,
    handleSearchEscape,
    isSearchMode,
    searchKeyword,
    searchResults,
    searchTarget,
    selectTab,
  }
}
