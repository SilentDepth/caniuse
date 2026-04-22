import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
  },
  lint: { options: { typeAware: true, typeCheck: true } },
})
