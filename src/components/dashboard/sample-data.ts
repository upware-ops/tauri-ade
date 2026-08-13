/**
 * Placeholder content matching the App Shell design. Replace with real data
 * once tasks and projects are persisted — nothing else imports these.
 */
import type { Project, Task } from './types'

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'acme-mono',
    name: 'acme-mono',
    items: [
      {
        id: 'feat-412',
        label: 'Feat/412 sign flows',
        branch: true,
        diff: { added: 1300, removed: 155 },
      },
      {
        id: 'search-reindex',
        label: 'Search reindex fix',
        branch: true,
        spotlight: true,
      },
      {
        id: 'release-24',
        label: 'Release/2.4 surveys',
        branch: true,
        diff: { added: 19, removed: 11 },
      },
    ],
  },
  {
    id: 'tauri-ade',
    name: 'tauri-ade',
    items: [
      {
        id: 'startup-splash',
        label: 'Add startup splash and reliable release automation',
        active: true,
        diff: { added: 943, removed: 254 },
      },
    ],
  },
]

export const SAMPLE_TASKS: Task[] = [
  {
    id: 'fix-auth-refresh',
    branch: 'fix-auth-refresh',
    title: 'Fix OAuth token refresh race',
    summary:
      'Refresh tokens were reused after rotation — added a jitter window and a retry guard.',
    status: 'inProgress',
    diff: { added: 214, removed: 38 },
    updatedLabel: '15m ago',
  },
  {
    id: 'billing-webhooks',
    branch: 'billing-webhooks',
    title: 'Update billing webhook retries',
    summary: 'Review complete — 2 findings posted as inline comments.',
    status: 'inProgress',
    diff: { added: 612, removed: 140 },
    updatedLabel: '1h ago',
  },
  {
    id: 'search-index',
    branch: 'search-index',
    title: 'Search index warm start',
    summary:
      'It returns the same reference every time — added a memoized selector.',
    status: 'inProgress',
    diff: { added: 19, removed: 11 },
    updatedLabel: '1d ago',
  },
  {
    id: 'release-notes-v2',
    branch: 'release-notes-v2',
    title: 'Add startup splash and reliable release automation',
    summary: 'Rust tests have compiled the refreshed plugin graph.',
    status: 'inReview',
    diff: { added: 943, removed: 254 },
    updatedLabel: '18m ago',
    pullRequest: { number: 2, url: '#' },
  },
]
