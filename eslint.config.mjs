import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

// eslint-config-next 15 still ships legacy (eslintrc) configs, so they are
// loaded through FlatCompat. Next 16's config exports flat configs directly.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url))
})

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'public/**',
      'src/generated/**',
      'next-env.d.ts'
    ]
  },
  ...compat.extends('next/core-web-vitals')
]

export default eslintConfig
