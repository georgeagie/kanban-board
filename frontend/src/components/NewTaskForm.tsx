import { type FormEvent, useState } from 'react'

type NewTaskFormProps = {
  onCreate: (title: string, description: string) => Promise<void>
}

export function NewTaskForm({ onCreate }: NewTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    try {
      await onCreate(trimmed, description.trim())
      setTitle('')
      setDescription('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="new-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>
    </form>
  )
}
