import { computed, ref } from 'vue'

import {
  DEFAULT_ELIGIBILITY_MONTHS,
  FEATURE_TABS,
  formatIsoDate,
  groupFeatureRecords,
  parseUtcDate,
  sanitizeEligibilityMonths,
  startOfMonthUtc,
  toAllFeatureRecords,
  toFeatureRecords,
  type FeatureGroup,
  type FeatureTabId,
  type WebFeaturesDataset,
} from '#shared/utils/caniuse-features'

const ELIGIBILITY_MONTHS_COOKIE_KEY = 'eligibility-months'

async function fetchWebFeatures(): Promise<WebFeaturesDataset> {
  return await $fetch<WebFeaturesDataset>('/api/web-features')
}

async function fetchWindowWebFeatures(
  tabId: FeatureTabId,
  referenceMonthStart: Date,
  eligibilityMonths: number,
): Promise<WebFeaturesDataset> {
  return await $fetch<WebFeaturesDataset>('/api/web-features', {
    query: {
      scope: 'window',
      tab: tabId,
      referenceMonthStart: formatIsoDate(referenceMonthStart),
      eligibilityMonths,
    },
  })
}

export function useCanIUseFeatures() {
  const selectedTab = ref<FeatureTabId>('recent')

  const eligibilityMonthsRaw = useCookie<string>(ELIGIBILITY_MONTHS_COOKIE_KEY, {
    default: () => String(DEFAULT_ELIGIBILITY_MONTHS),
  })
  const eligibilityMonths = computed<number>({
    get: () => sanitizeEligibilityMonths(eligibilityMonthsRaw.value),
    set: value => {
      eligibilityMonthsRaw.value = String(sanitizeEligibilityMonths(value))
    },
  })

  const initialReferenceMonthStart = startOfMonthUtc(new Date())
  const {
    data: initialData,
    error: initialError,
    status,
  } = useAsyncData(
    `web-features-window-${formatIsoDate(initialReferenceMonthStart)}-${eligibilityMonths.value}`,
    async () => {
      const dataset = await fetchWindowWebFeatures(
        'recent',
        initialReferenceMonthStart,
        eligibilityMonths.value,
      )

      return {
        dataset,
        referenceMonthStart: formatIsoDate(initialReferenceMonthStart),
      }
    },
    {
      default: () => ({
        dataset: { features: {} },
        referenceMonthStart: formatIsoDate(initialReferenceMonthStart),
      }),
    },
  )

  const {
    data: fullDataset,
    error: fullDatasetError,
    status: fullDatasetStatus,
  } = useAsyncData(
    'web-features-dataset-full',
    async () => {
      return await fetchWebFeatures()
    },
    {
      default: () => ({ features: {} }),
      server: false,
    },
  )

  const referenceMonthStart = computed(() => {
    const value = initialData.value?.referenceMonthStart
    if (!value) {
      return startOfMonthUtc(new Date())
    }

    return parseUtcDate(value) ?? startOfMonthUtc(new Date())
  })

  const isFullDatasetReady = computed(
    () => fullDatasetStatus.value === 'success' && Boolean(fullDataset.value),
  )
  const displayDataset = computed(() =>
    isFullDatasetReady.value ? fullDataset.value : initialData.value?.dataset,
  )
  const tabItems = computed(() =>
    FEATURE_TABS.map(tab => ({
      id: tab.id,
      label: tab.label,
      disabled: tab.id === 'upcoming' && !isFullDatasetReady.value,
    })),
  )

  const groupsByTab = computed<Record<FeatureTabId, FeatureGroup[]>>(
    () =>
      Object.fromEntries(
        FEATURE_TABS.map(tab => [
          tab.id,
          groupFeatureRecords(
            toFeatureRecords(
              displayDataset.value,
              tab.id,
              referenceMonthStart.value,
              eligibilityMonths.value,
            ),
            tab.groupOrder,
          ),
        ]),
      ) as Record<FeatureTabId, FeatureGroup[]>,
  )

  const activeTab = computed(
    () => FEATURE_TABS.find(tab => tab.id === selectedTab.value) ?? FEATURE_TABS[0],
  )

  const activeGroups = computed(() => groupsByTab.value[selectedTab.value])
  const allFeatures = computed(() =>
    toAllFeatureRecords(fullDataset.value, eligibilityMonths.value),
  )

  const errorMessage = computed(() => {
    const cause = initialError.value
    if (!cause) return ''
    if (cause instanceof Error) return cause.message
    if (typeof cause === 'object' && cause) {
      const message = Reflect.get(cause, 'message')
      if (typeof message === 'string') return message
    }

    return String(cause)
  })
  const fullDatasetErrorMessage = computed(() => {
    const cause = fullDatasetError.value
    if (!cause) return ''
    if (cause instanceof Error) return cause.message
    if (typeof cause === 'object' && cause) {
      const message = Reflect.get(cause, 'message')
      if (typeof message === 'string') return message
    }

    return String(cause)
  })

  return {
    activeGroups,
    activeTab,
    allFeatures,
    errorMessage,
    eligibilityMonths,
    fullDatasetErrorMessage,
    fullDatasetStatus,
    isFullDatasetReady,
    selectedTab,
    status,
    tabItems,
  }
}
