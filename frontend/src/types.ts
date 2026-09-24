export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: number
  title: string
  description: string
  status: TaskStatus
  position: number
  created_at: string
  updated_at: string
}

export type TaskCreate = {
  title: string
  description?: string
  status?: TaskStatus
}

export type TaskUpdate = {
  title?: string
  description?: string
  status?: TaskStatus
  position?: number
}

export const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]
