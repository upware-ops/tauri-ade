import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [
    'syncpack',
    'taze',
    // eslint-plugin-react 7 supports ESLint 9 but not 10.
    '@eslint/js@10',
    'eslint@10',
    // 0.2.3 lets npm select an incompatible Babel 8 optional peer.
    '@rolldown/plugin-babel',
    // v4 requires ResizeObserver, which the current test runtime does not provide.
    'react-resizable-panels@4',
    // typescript-eslint 8 supports TypeScript <6.1; keep accepting TypeScript 6 updates.
    'typescript@7',
  ],
  includeLocked: true,
  maturityPeriod: 14,
  githubActions: {
    style: 'tag',
  },
  depFields: {
    overrides: false,
  },
})
