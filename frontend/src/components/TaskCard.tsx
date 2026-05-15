import type { Task } from '../types/task'
import { PRIORITY_LABELS, PRIORITY_BADGE } from '../types/task'
import { useAppDispatch } from '../store'
import { deleteTask } from '../store/tasksSlice'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const dispatch = useAppDispatch()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`¿Eliminar "${task.title}"?`)) {
      dispatch(deleteTask(task.id))
    }
  }

  const date = new Date(task.created_at).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short',
  })

  return (
    <div
      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-base-300 hover:border-primary"
      onClick={() => onEdit(task)}
    >
      <div className="card-body p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm text-base-content leading-snug flex-1">{task.title}</h3>
          <span className={`badge badge-xs ${PRIORITY_BADGE[task.priority]} shrink-0`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {task.description && (
          <p className="text-xs text-[#777] line-clamp-2 leading-relaxed">{task.description}</p>
        )}

        {task.estimated_hours && (
          <div className="flex items-center gap-1 text-xs text-[#777]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {task.estimated_hours}h estimadas
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[#777]">{date}</span>
          <button
            className="btn btn-ghost btn-xs text-error hover:bg-error/10"
            onClick={handleDelete}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
