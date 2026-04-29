import {
  filterWebFeaturesDatasetByWindow,
  parseUtcDate,
  sanitizeEligibilityMonths,
  startOfMonthUtc,
  type FeatureTabId,
} from '#shared/utils/caniuse-features'

function getQueryString(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

function getReferenceMonthStart(value: unknown) {
  const queryValue = getQueryString(value)
  const parsed = typeof queryValue === 'string' ? parseUtcDate(queryValue) : null

  return parsed ? startOfMonthUtc(parsed) : startOfMonthUtc(new Date())
}

export default defineEventHandler(async event => {
  const startedAt = Date.now()
  const data = await getWebFeaturesDataset()
  setResponseHeader(
    event,
    'Server-Timing',
    `read;dur=${Date.now() - startedAt};desc="Read from cache"`,
  )

  const query = getQuery(event)
  const scope = getQueryString(query.scope)

  if (scope === 'window') {
    const tabId: FeatureTabId = getQueryString(query.tab) === 'upcoming' ? 'upcoming' : 'recent'
    const eligibilityMonths = sanitizeEligibilityMonths(getQueryString(query.eligibilityMonths))
    const referenceMonthStart = getReferenceMonthStart(query.referenceMonthStart)

    return filterWebFeaturesDatasetByWindow(data, {
      eligibilityMonths,
      referenceMonthStart,
      tabId,
    })
  }

  return data
})
