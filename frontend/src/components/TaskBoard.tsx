import { useEffect } from 'react'
import type { Task, TaskStatus } from '../types/task'
import { STATUS_LABELS } from '../types/task'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchTasks } from '../store/tasksSlice'
import TaskCard from './TaskCard'

const COLUMNS: { status: TaskStatus; color: string }[] = [
  { status: 'todo', color: 'border-t-[#777]' },
  { status: 'in_progress', color: 'border-t-warning' },
  { status: 'done', color: 'border-t-success' },
]

interface TaskBoardProps {
  onEditTask: (task: Task) => void
}

export default function TaskBoard({ onEditTask }: TaskBoardProps) {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((s) => s.tasks)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-5 p-[30px]">
        {COLUMNS.map(({ status }) => (
          <div key={status} className="flex flex-col gap-3">
            <div className="skeleton h-7 w-32 rounded-lg" />
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="alert alert-error max-w-sm">
          <span>{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-5 p-[30px]">
      {COLUMNS.map(({ status, color }) => {
        const columnTasks = items.filter((t) => t.status === status)
        return (
          <div key={status} className="flex flex-col gap-3">
            {/* Column header */}
            <div className={`card bg-base-200 border-t-4 ${color} shadow-sm`}>
              <div className="card-body py-3 px-4 flex-row items-center justify-between">
                <h2 className="font-semibold text-sm text-[#333]">{STATUS_LABELS[status]}</h2>
                <span className="badge badge-neutral badge-sm">{columnTasks.length}</span>
              </div>
            </div>

            {/* Tasks */}
            <div className="flex flex-col gap-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-base-300 text-[#777] text-xs">
                  Sin tareas
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
