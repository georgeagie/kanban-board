import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'

type TaskCardProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { type: 'task', task },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <article ref={setNodeRef} style={style} className="task-card" {...attributes}>
      <button type="button" className="task-card__handle" {...listeners} aria-label="Drag task">
        ⋮⋮
      </button>
      <div className="task-card__body">
        <h3 className="task-card__title">{task.title}</h3>
        {task.description ? (
          <p className="task-card__description">{task.description}</p>
        ) : null}
        <div className="task-card__actions">
          <button type="button" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" className="danger" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
