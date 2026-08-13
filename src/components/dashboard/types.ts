export type TaskStatus = 'backlog' | 'inProgress' | 'inReview' | 'done'

export interface DiffStat {
  added: number
  removed: number
}

export interface Task {
  id: string
  /** Working branch the agent is running on. */
  branch: string
  title: string
  summary: string
  status: TaskStatus
  diff?: DiffStat
  /** Pre-formatted in the PoC; becomes a timestamp once tasks are persisted. */
  updatedLabel: string
  pullRequest?: { number: number; url: string }
}

export interface ProjectItem {
  id: string
  label: string
  diff?: DiffStat
  /** Highlights a task the agent surfaced on its own. */
  spotlight?: boolean
  active?: boolean
  /** Sidebar rows show a branch glyph unless the row is the open task. */
  branch?: boolean
}

export interface Project {
  id: string
  name: string
  items: ProjectItem[]
}
