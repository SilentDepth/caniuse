export default defineTask({
  meta: {
    description: 'Refresh the web-features dataset in Cloudflare KV.',
  },
  async run() {
    const dataset = await refreshWebFeaturesDataset()

    return {
      result: {
        featureCount: Object.keys(dataset.features ?? {}).length,
        refreshedAt: new Date().toISOString(),
      },
    }
  },
})
