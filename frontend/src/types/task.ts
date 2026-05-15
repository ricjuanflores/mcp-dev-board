export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  estimated_hours: number | null
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  estimated_hours?: number | null
}

export interface AISuggestion {
  description: string
  estimated_hours: number
  subtasks: string[]
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Por hacer',
  in_progress: 'En progreso',
  done: 'Hecho',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

export const PRIORITY_BADGE: Record<TaskPriority, string> = {
  low: 'badge-success',
  medium: 'badge-warning',
  high: 'badge-error',
}
