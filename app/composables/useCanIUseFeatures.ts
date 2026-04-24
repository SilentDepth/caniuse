import { computed, ref } from 'vue'

const DATASET_URLS = [
  'https://unpkg.com/web-features@latest/data.json',
  'https://cdn.jsdelivr.net/npm/web-features@latest/data.json',
] as const

export const CORE_BROWSERS = ['chrome', 'edge', 'firefox', 'safari'] as const
export const DEFAULT_ELIGIBILITY_MONTHS = 30
const WINDOW_MONTHS = 6
const ELIGIBILITY_MONTHS_COOKIE_KEY = 'eligibility-months'

export const FEATURE_TABS = [
  {
    id: 'recent',
    label: 'Eligible',
    emptyText: 'No newly eligible features in the last 6 months.',
    groupOrder: 'desc',
  },
  {
    id: 'upcoming',
    label: 'Upcoming',
    emptyText: 'No upcoming eligible features in the next 6 months.',
    groupOrder: 'asc',
  },
] as const

export type CoreBrowser = (typeof CORE_BROWSERS)[number]
export type FeatureTab = (typeof FEATURE_TABS)[number]
export type FeatureTabId = FeatureTab['id']
type FeatureGroupOrder = FeatureTab['groupOrder']

interface WebFeaturesDataset {
  features?: Record<string, WebFeature>
}

interface WebFeature {
  kind?: string
  name?: string
  description?: string
  spec?: string[]
  status?: {
    baseline_low_date?: string
    support?: Partial<Record<string, string>>
  }
}

export interface FeatureRecord {
  id: string
  name: string
  description?: string
  spec: string[]
  baselineLowDate: string
  availableAt: string
  support: Partial<Record<CoreBrowser, string>>
}

export interface FeatureGroup {
  monthKey: string
  monthLabel: string
  items: FeatureRecord[]
}

export function sanitizeEligibilityMonths(value: number | string | null | undefined) {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(parsed)) return DEFAULT_ELIGIBILITY_MONTHS

  return Math.min(120, Math.max(1, Math.round(parsed)))
}

const monthFormatter = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

function parseUtcDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfMonthUtc(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1))
}

function addMonthsUtc(value: Date, months: number) {
  return new Date(
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth() + months, value.getUTCDate()),
  )
}

function formatIsoDate(value: Date) {
  return value.toISOString().slice(0, 10)
}

function formatMonthLabel(value: Date) {
  const year = value.getUTCFullYear()
  const month = monthFormatter.formatToParts(value).find(part => part.type === 'month')?.value
  return month ? `${year} ${month}` : `${year}`
}

function getTrackingWindow(referenceMonthStart: Date) {
  return {
    currentMonthStart: referenceMonthStart,
    recentStart: addMonthsUtc(referenceMonthStart, -WINDOW_MONTHS),
    upcomingEnd: addMonthsUtc(referenceMonthStart, WINDOW_MONTHS),
  }
}

async function fetchWebFeatures(): Promise<WebFeaturesDataset> {
  let lastError: unknown

  for (const url of DATASET_URLS) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        lastError = new Error(`Failed to fetch ${url}: ${response.status}`)
        continue
      }

      return (await response.json()) as WebFeaturesDataset
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('Failed to fetch web features data')
}

function toFeatureRecord(
  id: string,
  feature: WebFeature,
  eligibilityMonths: number,
): FeatureRecord | null {
  if (feature.kind && feature.kind !== 'feature') return null

  const baselineLowDate = feature.status?.baseline_low_date
  const baselineLowMoment = baselineLowDate ? parseUtcDate(baselineLowDate) : null

  const availableAtMoment = baselineLowMoment
    ? addMonthsUtc(baselineLowMoment, eligibilityMonths)
    : null

  return {
    id,
    name: feature.name || id,
    description: feature.description,
    spec: feature.spec ?? [],
    baselineLowDate: baselineLowDate ?? '',
    availableAt: availableAtMoment ? formatIsoDate(availableAtMoment) : '',
    support: Object.fromEntries(
      CORE_BROWSERS.map(browser => [browser, feature.status?.support?.[browser]]),
    ) as Partial<Record<CoreBrowser, string>>,
  }
}

function compareFeatureAvailability(a: FeatureRecord, b: FeatureRecord) {
  if (!a.availableAt && !b.availableAt) return 0
  if (!a.availableAt) return 1
  if (!b.availableAt) return -1

  return a.availableAt.localeCompare(b.availableAt)
}

function toAllFeatureRecords(dataset: WebFeaturesDataset | undefined, eligibilityMonths: number) {
  return Object.entries(dataset?.features ?? {})
    .flatMap(([id, feature]): FeatureRecord[] => {
      const record = toFeatureRecord(id, feature, eligibilityMonths)
      return record ? [record] : []
    })
    .sort(
      (a, b) =>
        compareFeatureAvailability(a, b) ||
        a.name.localeCompare(b.name) ||
        a.id.localeCompare(b.id),
    )
}

function toFeatureRecords(
  dataset: WebFeaturesDataset | undefined,
  tabId: FeatureTabId,
  referenceMonthStart: Date,
  eligibilityMonths: number,
) {
  const { recentStart, currentMonthStart, upcomingEnd } = getTrackingWindow(referenceMonthStart)
  const windowStart = tabId === 'recent' ? recentStart : currentMonthStart
  const windowEnd = tabId === 'recent' ? currentMonthStart : upcomingEnd
  const sortDirection = tabId === 'recent' ? -1 : 1

  return toAllFeatureRecords(dataset, eligibilityMonths)
    .filter(item => {
      if (!item.availableAt) return false

      const availableAtMoment = parseUtcDate(item.availableAt)
      if (!availableAtMoment) return false

      return (
        availableAtMoment.getTime() >= windowStart.getTime() &&
        availableAtMoment.getTime() < windowEnd.getTime()
      )
    })
    .sort((a, b) => {
      const aDate = parseUtcDate(a.availableAt)?.getTime() ?? 0
      const bDate = parseUtcDate(b.availableAt)?.getTime() ?? 0
      const timeDiff = (aDate - bDate) * sortDirection
      return timeDiff || a.name.localeCompare(b.name)
    })
}

function groupFeatureRecords(items: FeatureRecord[], order: FeatureGroupOrder) {
  const groups = new Map<string, FeatureGroup>()

  for (const item of items) {
    const month = startOfMonthUtc(parseUtcDate(item.availableAt) ?? new Date())
    const monthKey = item.availableAt.slice(0, 7)

    if (!groups.has(monthKey)) {
      groups.set(monthKey, {
        monthKey,
        monthLabel: formatMonthLabel(month),
        items: [],
      })
    }

    groups.get(monthKey)?.items.push(item)
  }

  return Array.from(groups.values()).sort((a, b) =>
    order === 'desc' ? b.monthKey.localeCompare(a.monthKey) : a.monthKey.localeCompare(b.monthKey),
  )
}

export async function useCanIUseFeatures() {
  const selectedTab = ref<FeatureTabId>('recent')
  const tabItems = FEATURE_TABS.map(tab => ({
    id: tab.id,
    label: tab.label,
  }))
  const eligibilityMonthsCookie = useCookie<string>(ELIGIBILITY_MONTHS_COOKIE_KEY, {
    default: () => String(DEFAULT_ELIGIBILITY_MONTHS),
  })

  const eligibilityMonths = computed<number>({
    get: () => sanitizeEligibilityMonths(eligibilityMonthsCookie.value),
    set: value => {
      eligibilityMonthsCookie.value = String(sanitizeEligibilityMonths(value))
    },
  })

  const { data, error, status } = await useAsyncData(
    'web-features-dataset',
    async () => {
      const dataset = await fetchWebFeatures()
      return {
        dataset,
        referenceMonthStart: formatIsoDate(startOfMonthUtc(new Date())),
      }
    },
    {
      server: true,
    },
  )

  const referenceMonthStart = computed(() => {
    const value = data.value?.referenceMonthStart
    if (!value) {
      return startOfMonthUtc(new Date())
    }

    return parseUtcDate(value) ?? startOfMonthUtc(new Date())
  })

  const groupsByTab = computed<Record<FeatureTabId, FeatureGroup[]>>(
    () =>
      Object.fromEntries(
        FEATURE_TABS.map(tab => [
          tab.id,
          groupFeatureRecords(
            toFeatureRecords(
              data.value?.dataset,
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
    toAllFeatureRecords(data.value?.dataset, eligibilityMonths.value),
  )

  const errorMessage = computed(() => {
    const cause = error.value
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
    selectedTab,
    status,
    tabItems,
  }
}
