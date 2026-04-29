import type { WebFeaturesDataset } from '#shared/utils/caniuse-features'

const WEB_FEATURES_CACHE_KEY = 'web-features'

const DATASET_URLS = [
  'https://unpkg.com/web-features@latest/data.json',
  'https://cdn.jsdelivr.net/npm/web-features@latest/data.json',
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function assertWebFeaturesDataset(value: unknown): asserts value is WebFeaturesDataset {
  if (!isRecord(value)) {
    throw new Error('Invalid web-features dataset: expected an object')
  }

  if ('features' in value && !isRecord(value.features)) {
    throw new Error('Invalid web-features dataset: expected `features` to be an object')
  }
}

async function fetchRemoteWebFeatures(): Promise<WebFeaturesDataset> {
  let lastError: unknown

  for (const url of DATASET_URLS) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        lastError = new Error(`Failed to fetch ${url}: ${response.status}`)
        continue
      }

      const dataset = await response.json()
      assertWebFeaturesDataset(dataset)

      return dataset
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('Failed to fetch web features data')
}

function getWebFeaturesStorage() {
  return useStorage<WebFeaturesDataset>('kv')
}

export async function refreshWebFeaturesDataset() {
  const dataset = await fetchRemoteWebFeatures()
  await getWebFeaturesStorage().setItem(WEB_FEATURES_CACHE_KEY, dataset)

  return dataset
}

export async function getWebFeaturesDataset() {
  const cachedDataset = await getWebFeaturesStorage().getItem(WEB_FEATURES_CACHE_KEY)

  if (cachedDataset) {
    assertWebFeaturesDataset(cachedDataset)
    return cachedDataset
  }

  return await refreshWebFeaturesDataset()
}
